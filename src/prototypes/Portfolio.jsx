import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// --- CONFIGURATION GLOBALE ---
const GRID_COLS = 30;  // LARGEUR de la grille
const GRID_ROWS = 30;  // HAUTEUR de la grille
const HEX_RADIUS = 2; // Taille (Rayon)
const HEX_THICKNESS = 5; // Épaisseur

// Calculs pour "Pointy Topped" (Pointe vers le haut)
const HEX_WIDTH = Math.sqrt(3) * HEX_RADIUS; // Largeur (plat à plat)
const HEX_HEIGHT = 2 * HEX_RADIUS;           // Hauteur (pointe à pointe)
const GAP = 0.02; // Espace entre les tuiles

// Distances entre les centres pour une grille "Pointy Topped"
const X_SPACING = HEX_WIDTH + GAP;
const Z_SPACING = HEX_HEIGHT * 0.75 + GAP;

const COLORS = {
    active: 0xff6b6b,
    hover: 0x4ecdc4,
    base: 0xffffff,
    dimmed: 0x333333,
    background: 0x1e272e,
    nonInteractive: 0xEEEEEE
};

// --- CONFIGURATION DES ZONES INTERACTIVES ---
// Zone interactive basée sur la position de la caméra
const CAMERA_INTERACTION_RADIUS = 10; // Rayon en unités 3D autour de la caméra

// Cette fonction sera appelée dans la boucle d'animation pour mettre à jour dynamiquement
const isTileInCameraRange = (tilePosition, cameraPosition, radius) => {
    // Calcul de la distance en 2D (X et Z, ignorer Y pour la hauteur)
    const dx = tilePosition.x - cameraPosition.x;
    const dz = tilePosition.z - cameraPosition.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    return distance <= radius;
};

// --- CONFIGURATION DES OBJETS PAR PROJET ---
const PROJECT_OBJECTS = {
    0: [
        { type: 'box', position: [0, 0.5, 0], size: [1, 1, 1], color: 0xff0000 },
        { type: 'sphere', position: [1, 0.5, 1], size: [0.3], color: 0xffff00 }
    ],
    1: [
        { type: 'torus', position: [0, 1, 0], size: [0.5, 0.2], color: 0x00ff00 },
        { type: 'box', position: [-1, 0.5, -0.5], size: [0.5, 0.5, 0.5], color: 0xff00ff }
    ],
    2: [
        { type: 'cone', position: [0, 1, 0], size: [0.8, 2], color: 0x0000ff }
    ]
};

const createContentGroup = (id) => {
    const group = new THREE.Group();
    group.position.y = HEX_THICKNESS / 2;

    let items = PROJECT_OBJECTS[id];

    if (!items) {
        items = [];
        const seed = id * 1337;
        const shapeType = Math.floor((seed % 3));

        if (shapeType === 0) {
            items.push({ type: 'box', position: [0, 0.5, 0], size: [0.8, 0.8, 0.8], color: Math.random() * 0xffffff });
        } else if (shapeType === 1) {
            items.push({ type: 'sphere', position: [0.5, 0.5, -0.5], size: [0.4], color: Math.random() * 0xffffff });
            items.push({ type: 'sphere', position: [-0.5, 0.8, 0.5], size: [0.3], color: Math.random() * 0xffffff });
        } else {
            items.push({ type: 'cone', position: [0, 0.8, 0], size: [0.5, 1.5], color: Math.random() * 0xffffff });
        }
    }

    items.forEach(item => {
        let geo, mat;
        mat = new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.3 });

        if (item.type === 'box') geo = new THREE.BoxGeometry(...(item.size || [1, 1, 1]));
        else if (item.type === 'sphere') geo = new THREE.SphereGeometry(...(item.size || [0.5, 16, 16]));
        else if (item.type === 'cone') geo = new THREE.ConeGeometry(...(item.size || [0.5, 1, 16]));
        else if (item.type === 'torus') geo = new THREE.TorusKnotGeometry(item.size[0], item.size[1], 64, 8);
        else geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...item.position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
    });

    group.scale.set(0, 0, 0);
    return group;
};

export default function Portfolio() {
    const mountRef = useRef(null);
    const [activeId, setActiveId] = useState(null);

    const sceneRef = useRef(null);
    const activeIdRef = useRef(null);

    useEffect(() => {
        // 1. SETUP THREE.JS
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(COLORS.background);
        scene.fog = new THREE.Fog(COLORS.background, 10, 80);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 50, 30);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(20, 30, 20);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        // 2. GÉNÉRATION GRILLE
        const tiles = [];

        // --- CORRECTION GÉOMÉTRIE ---
        // Utilisation de thetaStart (Math.PI / 6) pour avoir la pointe vers le haut nativement
        // Paramètres: radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart
        const tileGeometry = new THREE.CylinderGeometry(
            HEX_RADIUS,
            HEX_RADIUS,
            HEX_THICKNESS,
            6,
            1,
            false
        );
        // Plus besoin de rotateY()

        const tileMaterialBase = new THREE.MeshStandardMaterial({
            color: COLORS.base,
            roughness: 0.2,
            metalness: 0.1
        });

        let idCounter = 0;
        const totalWidth = (GRID_COLS - 1) * X_SPACING;
        const totalHeight = (GRID_ROWS - 1) * Z_SPACING;

        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {

                const xOffset = (row % 2 !== 0) ? X_SPACING / 2 : 0;

                const x = (col * X_SPACING) + xOffset - (totalWidth / 2);
                const z = (row * Z_SPACING) - (totalHeight / 2);

                const material = tileMaterialBase.clone();
                const tileMesh = new THREE.Mesh(tileGeometry, material);
                tileMesh.position.set(x, 0, z);
                tileMesh.castShadow = true;
                tileMesh.receiveShadow = true;

                tileMesh.userData = {
                    id: idCounter,
                    row: row,
                    col: col,
                    originalPos: new THREE.Vector3(x, 0, z),
                    isInteractive: false  // Sera mis à jour dynamiquement
                };

                const contentGroup = createContentGroup(idCounter);
                tileMesh.add(contentGroup);
                tileMesh.userData.content = contentGroup;

                // L'apparence sera mise à jour dynamiquement dans l'animation

                scene.add(tileMesh);
                tiles.push(tileMesh);

                idCounter++;
            }
        }

        // 3. INTERACTION
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let hoveredId = null;

        const onMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onClick = () => {
            if (hoveredId !== null) {
                const newId = (activeIdRef.current === hoveredId) ? null : hoveredId;
                activeIdRef.current = newId;
                setActiveId(newId);
            } else {
                activeIdRef.current = null;
                setActiveId(null);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('click', onClick);

        // 4. ANIMATION LOOP
        const clock = new THREE.Clock();
        const targetCameraPos = new THREE.Vector3();
        const currentLookAt = new THREE.Vector3(0, 0, 0);
        const targetLookAt = new THREE.Vector3();

        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(tiles);

            if (intersects.length > 0) {
                const tile = intersects[0].object;

                if (tile.userData.isInteractive) {
                    hoveredId = tile.userData.id;
                    document.body.style.cursor = 'pointer';
                } else {
                    hoveredId = null;
                    document.body.style.cursor = 'default';
                }
            } else {
                hoveredId = null;
                document.body.style.cursor = 'default';
            }

            const currentActive = activeIdRef.current;

            // Mettre à jour dynamiquement les tuiles interactives basées sur le point regardé par la caméra
            tiles.forEach(tile => {
                // Calculer dynamiquement si la tuile est dans le rayon du point lookAt (où regarde la caméra)
                const wasInteractive = tile.userData.isInteractive;
                tile.userData.isInteractive = isTileInCameraRange(
                    tile.position,
                    currentLookAt,  // Point où regarde la caméra, pas sa position
                    CAMERA_INTERACTION_RADIUS
                );

                // Mettre à jour le metalness si le statut interactif a changé
                if (wasInteractive !== tile.userData.isInteractive) {
                    if (tile.userData.isInteractive) {
                        tile.material.metalness = 0.1;
                    } else {
                        tile.material.metalness = 0.3;
                    }
                }

                const isHovered = tile.userData.id === hoveredId;
                const isActive = tile.userData.id === currentActive;
                const isAnyActive = currentActive !== null;

                let targetScale = 1;
                let targetColorHex = COLORS.base;
                let targetY = 0;

                if (isActive) {
                    targetColorHex = COLORS.active;
                } else if (isHovered && !isAnyActive) {
                    targetScale = 1.1;
                    targetY = 0.5;
                    targetColorHex = COLORS.hover;
                } else if (isAnyActive) {
                    targetColorHex = COLORS.dimmed;
                } else if (!tile.userData.isInteractive) {
                    // Tuile hors du rayon de la caméra
                    targetColorHex = COLORS.nonInteractive;
                }

                tile.position.y += (targetY - tile.position.y) * delta * 5;
                if (!isActive) {
                    tile.scale.lerp(new THREE.Vector3(targetScale, 1, targetScale), delta * 5);
                }

                const targetColor = new THREE.Color(targetColorHex);
                tile.material.color.lerp(targetColor, delta * 8);

                const content = tile.userData.content;
                if (content) {
                    const targetContentScale = isActive ? 1 : 0;
                    content.scale.lerp(new THREE.Vector3(targetContentScale, targetContentScale, targetContentScale), delta * 6);

                    if (isActive || content.scale.x > 0.01) {
                        content.rotation.y += delta * 0.5;
                        content.position.y = (HEX_THICKNESS / 2) + Math.sin(time * 2) * 0.1;
                    }
                }
            });

            if (currentActive !== null) {
                const activeTile = tiles.find(t => t.userData.id === currentActive);
                if (activeTile) {
                    targetCameraPos.set(
                        activeTile.position.x,
                        8,
                        activeTile.position.z + 10
                    );
                    targetLookAt.copy(activeTile.position);
                }
            } else {
                targetCameraPos.set(0, 25, 25);
                targetLookAt.set(0, 0, 0);
            }

            camera.position.lerp(targetCameraPos, delta * 2.5);
            currentLookAt.lerp(targetLookAt, delta * 3);
            camera.lookAt(currentLookAt);

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!mountRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-gray-900 font-sans overflow-hidden">
            <div ref={mountRef} className="absolute inset-0 z-0" />

            <div className="absolute top-0 left-0 p-8 pointer-events-none w-full flex justify-between items-start z-10">
                <div className="text-white drop-shadow-md">
                    <h1 className="text-4xl font-bold tracking-tighter mb-2">PORTFOLIO</h1>
                    <p className="text-gray-300 text-sm max-w-xs">
                        Grille {GRID_COLS}x{GRID_ROWS}
                    </p>
                </div>
            </div>

            {activeId !== null && (
                <div className="absolute bottom-10 right-10 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-sm transform transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in z-20">
                    <h2 className="text-3xl font-bold mb-1 text-gray-900">PROJET {activeId}</h2>
                    <div className="h-1 w-12 bg-blue-500 mb-4 rounded-full"></div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Description dynamique du projet {activeId}.
                    </p>
                    <button
                        className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition transform hover:scale-105"
                        onClick={() => setActiveId(null)}
                    >
                        Fermer
                    </button>
                </div>
            )}
        </div>
    );
}

