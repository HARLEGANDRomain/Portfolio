/**
 * Portfolio3D.jsx
 * ───────────────────────────────────────────────────────────────
 * Interactive 3D portfolio with suspended CRT monitors.
 * Built with React Three Fiber + @react-three/drei
 *
 * Dependencies (install before use):
 *   npm install three @react-three/fiber @react-three/drei
 *
 * Usage:
 *   Replace this file's default export as your App entry point,
 *   or import and mount it anywhere in your React tree.
 * ───────────────────────────────────────────────────────────────
 */

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Grid } from "@react-three/drei";
import * as THREE from "three";

// ══════════════════════════════════════════════════════════════
// MONITOR DIMENSIONS
// ══════════════════════════════════════════════════════════════
const MW = 1.4;   // Monitor width
const MH = 1.1;   // Monitor height
const MD = 0.18;  // Monitor depth
const SW = 1.05;  // Screen width
const SH = 0.82;  // Screen height

// ══════════════════════════════════════════════════════════════
// PORTFOLIO DATA
// Each monitor has: position, rotation (rad), and tabbed content
// ══════════════════════════════════════════════════════════════
const MONITORS = [
  {
    id: 0,
    label: "IDENTITY",
    position: [-0.1, 4.4, 0.0],
    rotation: [0.04, -0.08, 0.07],
    accent: "#7fd4ff",
    content: [
      { tab: "WHO",   title: "Gwido",            body: "Creative Developer & 3D Generalist", sub: "Paris, France · Open to remote" },
      { tab: "SKILLS",title: "Expertise",        body: "Three.js  ·  React  ·  Blender  ·  GLSL", sub: "5 years building immersive web experiences" },
      { tab: "HELLO", title: "Get in touch",     body: "gwido@studio.io", sub: "Usually replies within 24 h" },
    ],
  },
  {
    id: 1,
    label: "PROJECT Ⅰ",
    position: [1.75, 3.2, -0.15],
    rotation: [-0.07, 0.14, -0.09],
    accent: "#9ff0c8",
    content: [
      { tab: "INFO",  title: "Éclat",            body: "Generative light-art installation", sub: "2024 · Digital Art · Interactive" },
      { tab: "TECH",  title: "Stack",            body: "WebGL  ·  GLSL shaders  ·  Web Audio API", sub: "Real-time audio-reactive visuals" },
      { tab: "VISIT", title: "Live demo →",      body: "eclat.studio", sub: "Best experienced in Chrome" },
    ],
  },
  {
    id: 2,
    label: "PROJECT Ⅱ",
    position: [-1.5, 2.5, 0.12],
    rotation: [0.09, 0.07, 0.14],
    accent: "#ffb4c2",
    content: [
      { tab: "INFO",  title: "Nœud",             body: "3-D product configurator for luxury goods", sub: "2024 · E-commerce · Three.js" },
      { tab: "TECH",  title: "Stack",            body: "Next.js  ·  R3F  ·  Zustand  ·  GSAP", sub: "30 % lift in conversion vs flat images" },
      { tab: "VISIT", title: "Live demo →",      body: "noeud.store", sub: "Desktop recommended" },
    ],
  },
  {
    id: 3,
    label: "PROJECT Ⅲ",
    position: [0.35, 1.65, 0.25],
    rotation: [-0.05, -0.12, -0.06],
    accent: "#ffd97a",
    content: [
      { tab: "INFO",  title: "Spectre",          body: "Mobile AR companion for contemporary museums", sub: "2023 · AR · Mobile" },
      { tab: "TECH",  title: "Stack",            body: "React Native  ·  ARKit  ·  ARCore", sub: "Deployed in 4 museums across Europe" },
      { tab: "VISIT", title: "App Store →",      body: "spectre.app", sub: "iOS & Android" },
    ],
  },
  {
    id: 4,
    label: "PROJECT Ⅳ",
    position: [1.35, 0.55, -0.08],
    rotation: [0.08, 0.06, 0.11],
    accent: "#c4aaff",
    content: [
      { tab: "INFO",  title: "Trame",            body: "Procedural city generator for urban planners", sub: "2023 · Tool · Web" },
      { tab: "TECH",  title: "Stack",            body: "Three.js  ·  Worker threads  ·  IndexedDB", sub: "Generates 10 km² in < 2 s" },
      { tab: "VISIT", title: "Try it →",         body: "trame.city", sub: "Open source on GitHub" },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
// CABLE DATA  (deterministic — no Math.random() in render)
// ══════════════════════════════════════════════════════════════
// Each entry: { startX, startY, startZ, ctrlOffX, ctrlOffZ, targetX }
const CABLE_DEFS = MONITORS.flatMap((m, mi) => {
  // 2-3 cables per monitor, offsets baked in
  const offsets = [
    [-0.30, -0.15], [0.05, 0.25], [0.38, -0.1],
  ].slice(0, 2 + (mi % 2));
  return offsets.map(([ox, oz], ci) => ({
    sx: m.position[0] + ox,
    sy: m.position[1] + MH / 2,
    sz: m.position[2] + oz,
    cx: m.position[0] + ox * 0.6 + (mi % 3 - 1) * 0.4,
    cz: m.position[2] + oz * 0.5,
    tx: m.position[0] + ox * 1.8 + ci * 0.3 - 0.2,
  }));
});

// ══════════════════════════════════════════════════════════════
// GRADIENT SKYBOX TEXTURE  (created once)
// ══════════════════════════════════════════════════════════════
function makeGradientTexture() {
  const c = document.createElement("canvas");
  c.width = 4; c.height = 512;
  const g = c.getContext("2d");
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, "#ffffff");
  grad.addColorStop(0.45, "#c8c8c8");
  grad.addColorStop(1.0, "#363636");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 512);
  return new THREE.CanvasTexture(c);
}
const SKY_TEX = makeGradientTexture();

// ══════════════════════════════════════════════════════════════
// COMPONENT — SkyBox
// ══════════════════════════════════════════════════════════════
function SkyBox() {
  return (
    <mesh scale={[-60, -60, -60]}>
      <sphereGeometry args={[1, 32, 16]} />
      <meshBasicMaterial map={SKY_TEX} side={THREE.BackSide} />
    </mesh>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENT — Floor
// ══════════════════════════════════════════════════════════════
function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.95} metalness={0} />
      </mesh>
      <Grid
        position={[0, -0.595, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.4}
        cellColor="#b0b0b0"
        sectionSize={3}
        sectionThickness={0.8}
        sectionColor="#909090"
        fadeDistance={22}
        fadeStrength={1.2}
        followCamera={false}
        infiniteGrid={false}
      />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENT — Cables
// ══════════════════════════════════════════════════════════════
function Cables() {
  const tubes = useMemo(() =>
    CABLE_DEFS.map((d, i) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(d.sx, d.sy, d.sz),
        new THREE.Vector3(d.cx, d.sy + 1.4 + (i % 3) * 0.3, d.cz),
        new THREE.Vector3(d.tx, 9.5, d.sz * 0.6),
      ]);
      const geo = new THREE.TubeGeometry(curve, 24, 0.018, 8, false);
      return { geo, key: i };
    }), []);

  return (
    <group>
      {tubes.map(({ geo, key }) => (
        <mesh key={key} geometry={geo} castShadow>
          <meshStandardMaterial color="#c04070" roughness={0.35} metalness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENT — ScreenContent  (rendered as HTML in 3D space)
// ══════════════════════════════════════════════════════════════
function ScreenContent({ monitor, activeTab, isZoomed, onTabChange }) {
  const tab = monitor.content[activeTab];
  const accent = monitor.accent;

  return (
    <Html
      transform
      occlude="blending"
      position={[0, 0, MD / 2 + 0.005]}
      scale={0.0105}          // maps px → Three.js units
      style={{ pointerEvents: isZoomed ? "auto" : "none" }}
    >
      {/* ── outer shell ── */}
      <div style={{
        width:  `${SW / 0.0105}px`,  // ≈ 100 px per unit
        height: `${SH / 0.0105}px`,
        background: "linear-gradient(155deg, #07070f 0%, #0d0d22 100%)",
        color: "#c8d8ff",
        fontFamily: "'Courier New', Courier, monospace",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        border: `1px solid ${accent}33`,
      }}>

        {/* scanlines */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,30,.18) 3px, rgba(0,0,30,.18) 6px)",
        }} />

        {/* phosphor glow vignette */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)`,
        }} />

        {/* header bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "6px 10px 4px",
          borderBottom: `1px solid ${accent}44`,
          zIndex: 3,
        }}>
          <span style={{ fontSize: "9px", letterSpacing: ".18em", color: accent, opacity: .8 }}>
            {monitor.label}
          </span>
          <span style={{ fontSize: "8px", color: "#445", letterSpacing: ".1em" }}>
            {String(activeTab + 1).padStart(2, "0")}/{monitor.content.length}
          </span>
        </div>

        {/* main content */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "flex-start",
          padding: "10px 14px", zIndex: 3,
        }}>
          <div style={{
            fontSize: "24px", fontWeight: "bold", lineHeight: 1.15,
            color: accent, marginBottom: "10px",
            textShadow: `0 0 18px ${accent}99`,
          }}>
            {tab.title}
          </div>
          <div style={{ fontSize: "12px", color: "#99b8dd", lineHeight: 1.5, marginBottom: "8px" }}>
            {tab.body}
          </div>
          <div style={{ fontSize: "10px", color: "#445566", letterSpacing: ".05em" }}>
            {tab.sub}
          </div>
        </div>

        {/* tab strip — only shown when zoomed */}
        {isZoomed && (
          <div style={{
            display: "flex", borderTop: `1px solid ${accent}33`,
            zIndex: 3,
          }}>
            {monitor.content.map((c, i) => (
              <button
                key={i}
                onClick={() => onTabChange(i)}
                style={{
                  flex: 1, border: "none", outline: "none",
                  background: i === activeTab ? `${accent}22` : "transparent",
                  color: i === activeTab ? accent : "#445566",
                  fontSize: "9px", letterSpacing: ".12em",
                  padding: "7px 4px", cursor: "pointer",
                  borderRight: i < monitor.content.length - 1 ? `1px solid ${accent}22` : "none",
                  fontFamily: "inherit",
                  transition: "background .2s",
                }}
              >
                {c.tab}
              </button>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENT — CRTMonitor
// ══════════════════════════════════════════════════════════════
function CRTMonitor({ data, isSelected, onSelect }) {
  const [activeTab, setActiveTab] = useState(0);
  const groupRef = useRef();

  // Gentle idle float animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const amp = isSelected ? 0.005 : 0.018;
    const freq = 0.4 + data.id * 0.07;
    groupRef.current.position.y =
      data.position[1] + Math.sin(t * freq + data.id * 1.3) * amp;
    groupRef.current.rotation.z =
      data.rotation[2] + Math.sin(t * 0.3 + data.id * 0.8) * 0.004;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isSelected) onSelect(data.id, data.position);
  };

  return (
    <group
      ref={groupRef}
      position={data.position}
      rotation={data.rotation}
    >
      {/* ── Body ── */}
      <mesh onClick={handleClick} castShadow receiveShadow>
        <boxGeometry args={[MW, MH, MD]} />
        <meshStandardMaterial
          color={isSelected ? "#9dd4ee" : "#78b5d0"}
          roughness={0.15}
          metalness={0.08}
        />
      </mesh>

      {/* ── Screen bezel recess ── */}
      <mesh position={[0, 0.03, MD / 2 + 0.001]}>
        <planeGeometry args={[SW + 0.06, SH + 0.06]} />
        <meshStandardMaterial color="#0a0a15" roughness={1} />
      </mesh>

      {/* ── Slight CRT curvature overlay ── */}
      <mesh position={[0, 0.03, MD / 2 + 0.009]}>
        <planeGeometry args={[SW, SH]} />
        <meshStandardMaterial
          color="#001020"
          transparent
          opacity={0.06}
          roughness={0}
          metalness={0.3}
        />
      </mesh>

      {/* ── Brand badge (bottom strip) ── */}
      <mesh position={[0, -MH / 2 + 0.055, MD / 2 + 0.002]}>
        <planeGeometry args={[MW * 0.8, 0.06]} />
        <meshStandardMaterial color="#1a2a3a" roughness={1} />
      </mesh>

      {/* ── Side panel buttons (physical, on right edge) ── */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[MW / 2 + 0.045, MH / 4 - i * 0.22, -0.01]}
          onClick={(e) => { e.stopPropagation(); setActiveTab(i); }}
        >
          <cylinderGeometry args={[0.028, 0.028, 0.05, 12]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={activeTab === i ? data.accent : "#1a2a3a"}
            emissive={activeTab === i ? data.accent : "#000"}
            emissiveIntensity={activeTab === i ? 0.6 : 0}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      ))}

      {/* ── Suspension hook ── */}
      <mesh position={[0, MH / 2 + 0.06, 0]}>
        <boxGeometry args={[0.12, 0.09, MD * 0.7]} />
        <meshStandardMaterial color="#445" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* ── Screen HTML content ── */}
      <ScreenContent
        monitor={data}
        activeTab={activeTab}
        isZoomed={isSelected}
        onTabChange={setActiveTab}
      />
    </group>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENT — CameraRig
// Animates camera position/lookat smoothly on target change
// ══════════════════════════════════════════════════════════════
const DEFAULT_CAM_POS  = new THREE.Vector3(0.3, 2.8, 7.5);
const DEFAULT_CAM_LOOK = new THREE.Vector3(0.3, 2.4, 0);

function CameraRig({ targetMonitor, onComplete }) {
  const { camera } = useThree();
  const progress   = useRef(0);
  const fromPos    = useRef(new THREE.Vector3());
  const toPos      = useRef(new THREE.Vector3());
  const fromLook   = useRef(new THREE.Vector3());
  const toLook     = useRef(new THREE.Vector3());
  const running    = useRef(false);

  useEffect(() => {
    fromPos.current.copy(camera.position);

    if (targetMonitor) {
      const [tx, ty, tz] = targetMonitor.position;
      toPos.current.set(tx, ty, tz + 2.6);
      fromLook.current.copy(DEFAULT_CAM_LOOK);
      toLook.current.set(tx, ty, tz);
    } else {
      toPos.current.copy(DEFAULT_CAM_POS);
      // capture current look direction
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      fromLook.current.copy(camera.position).add(dir);
      toLook.current.copy(DEFAULT_CAM_LOOK);
    }

    progress.current = 0;
    running.current  = true;
  }, [targetMonitor]); // eslint-disable-line

  useFrame((_, delta) => {
    if (!running.current) return;

    progress.current = Math.min(1, progress.current + delta * 1.4);
    // Cubic ease-in-out
    const t = progress.current < 0.5
      ? 4 * progress.current ** 3
      : 1 - (-2 * progress.current + 2) ** 3 / 2;

    camera.position.lerpVectors(fromPos.current, toPos.current, t);

    const look = new THREE.Vector3().lerpVectors(fromLook.current, toLook.current, t);
    camera.lookAt(look);

    if (progress.current >= 1) {
      running.current = false;
      onComplete?.();
    }
  });

  return null;
}

// ══════════════════════════════════════════════════════════════
// COMPONENT — Scene  (all 3D content)
// ══════════════════════════════════════════════════════════════
function Scene({ selectedId, onSelect, onCameraComplete }) {
  const targetMonitor = selectedId !== null
    ? MONITORS.find((m) => m.id === selectedId)
    : null;

  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[3, 11, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={35}
        shadow-camera-top={12}
        shadow-camera-bottom={-3}
        shadow-camera-left={-12}
        shadow-camera-right={12}
      />
      <pointLight position={[-5, 7, 3]}  intensity={0.5} color="#b0d8ff" />
      <pointLight position={[ 5, 5, -4]} intensity={0.3} color="#ffd0a0" />

      {/* ── Environment ── */}
      <SkyBox />
      <Floor />
      <Cables />

      {/* ── Monitors ── */}
      {MONITORS.map((m) => (
        <CRTMonitor
          key={m.id}
          data={m}
          isSelected={selectedId === m.id}
          onSelect={onSelect}
        />
      ))}

      {/* ── Camera animation ── */}
      <CameraRig targetMonitor={targetMonitor} onComplete={onCameraComplete} />
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPONENT — UI Overlay  (pure HTML/CSS, sits above Canvas)
// ══════════════════════════════════════════════════════════════
function UIOverlay({ selectedId, animating, onBack }) {
  return (
    <>
      {/* Back button */}
      <div style={{
        position: "fixed", top: 24, left: 24, zIndex: 10,
        opacity: selectedId !== null && !animating ? 1 : 0,
        pointerEvents: selectedId !== null && !animating ? "auto" : "none",
        transition: "opacity .35s ease",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(8,8,20,.72)",
            color: "#a0c8ff",
            border: "1px solid rgba(100,160,255,.3)",
            padding: "10px 22px",
            cursor: "pointer",
            fontFamily: "'Courier New', monospace",
            fontSize: "12px",
            letterSpacing: ".18em",
            backdropFilter: "blur(10px)",
            transition: "background .2s",
          }}
          onMouseEnter={(e) => e.target.style.background = "rgba(40,60,100,.8)"}
          onMouseLeave={(e) => e.target.style.background = "rgba(8,8,20,.72)"}
        >
          ← BACK
        </button>
      </div>

      {/* Hint text */}
      <div style={{
        position: "fixed", bottom: 28, left: "50%",
        transform: "translateX(-50%)",
        opacity: selectedId === null && !animating ? 1 : 0,
        transition: "opacity .5s ease",
        pointerEvents: "none",
        fontFamily: "'Courier New', monospace",
        fontSize: "11px",
        color: "rgba(80,90,110,.7)",
        letterSpacing: ".22em",
        textTransform: "uppercase",
      }}>
        Click a monitor to explore
      </div>

      {/* Monitor label badge */}
      {selectedId !== null && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 10,
          opacity: !animating ? 1 : 0,
          transition: "opacity .4s ease",
          pointerEvents: "none",
          fontFamily: "'Courier New', monospace",
          fontSize: "11px",
          color: "rgba(120,180,255,.6)",
          letterSpacing: ".2em",
          textAlign: "right",
        }}>
          {MONITORS.find(m => m.id === selectedId)?.label}<br />
          <span style={{ fontSize: "9px", color: "rgba(80,100,140,.5)" }}>
            USE SIDE BUTTONS TO NAVIGATE
          </span>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT — Portfolio3D
// ══════════════════════════════════════════════════════════════
export default function Portfolio3D() {
  const [selectedId, setSelectedId] = useState(null);
  const [animating,  setAnimating]  = useState(false);

  const handleSelect = useCallback((id) => {
    if (animating) return;
    setSelectedId(id);
    setAnimating(true);
  }, [animating]);

  const handleBack = useCallback(() => {
    if (animating) return;
    setSelectedId(null);
    setAnimating(true);
  }, [animating]);

  const handleCameraComplete = useCallback(() => {
    setAnimating(false);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#1a1a1a" }}>
      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [0.3, 2.8, 7.5], fov: 52, near: 0.1, far: 200 }}
      >
        <Scene
          selectedId={selectedId}
          onSelect={handleSelect}
          onCameraComplete={handleCameraComplete}
        />
      </Canvas>

      <UIOverlay
        selectedId={selectedId}
        animating={animating}
        onBack={handleBack}
      />
    </div>
  );
}