/**
 * Génère le path SVG (clipPathUnits="objectBoundingBox", coordonnées 0→1)
 * d'une couche de vague.
 *
 * Desktop : vague verticale, le contenu sombre est à DROITE de la ligne.
 * Mobile  : vague horizontale, le contenu sombre est EN BAS.
 *
 * @param {number}  offset   décalage en vw (négatif = la vague couvre l'écran, 0 = position normale, 70 = sortie)
 * @param {number}  time     timestamp rAF (ms) — 0 pour une vague figée
 * @param {'main'|'bg1'|'bg2'} type couche (les couches de fond sont décalées et plus lentes)
 * @param {boolean} isMobile
 */
const LAYERS = {
  main: { shift: 0, slope: 0, amp: 1, freq: 1, speed: 0.0005, phase: 0 },
  bg1:  { shift: -3, slope: 3, amp: 1.1, freq: 0.8, speed: 0.0003, phase: 0.5 },
  bg2:  { shift: -3, slope: 8, amp: 1.3, freq: 0.7, speed: 0.0002, phase: 1.2 },
};

export const generateWavePath = (offset, time, type, isMobile) => {
  const layer = LAYERS[type] ?? LAYERS.main;
  const segments = isMobile ? 24 : 36;
  const amplitude = 2;
  const frequency = Math.PI * (isMobile ? 3 : 4);
  let d = '';

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const wave = amplitude * layer.amp * Math.sin(t * frequency * layer.freq - time * layer.speed + layer.phase);

    if (!isMobile) {
      const base = 60 - 15 * t + offset;               // ligne de partage, en vw
      const x = (base + layer.shift + layer.slope * t + wave) / 100;
      d += `${i === 0 ? 'M' : 'L'} ${x},${t} `;
    } else {
      const base = 110 + 10 * t + offset * 2.5;         // ligne de partage, en vh
      const y = (base + layer.shift + layer.slope * t + wave) / 100;
      d += `${i === 0 ? 'M' : 'L'} ${t},${y} `;
    }
  }

  return d + (isMobile ? 'L 1,1 L 0,1 Z' : 'L 1,1 L 1,0 Z');
};

export default generateWavePath;
