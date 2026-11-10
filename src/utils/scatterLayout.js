/**
 * Fonctions pures de placement pour le fond « éparpillé » de l'accueil.
 * Aucune dépendance au DOM ni à React : tout est calculé en pixels à partir de la taille de l'écran.
 *
 *  1. generateTile()   → une tuile qui se répète à l'infini (comme un canvas Figma),
 *                        grille décalée + jitter → jamais de chevauchement, répartition homogène.
 *  2. tileToScreen()   → position écran d'un emplacement pour un déplacement (pan) donné.
 *  3. pickClusterSlots → pour chaque image de l'amas, l'exemplaire le plus proche du centre.
 *  4. computeCluster() → disposition de l'amas (image principale au centre, chevauchement partiel borné).
 */

// ── Aléatoire déterministe ─────────────────────────────────────────────

/** Générateur pseudo-aléatoire à graine (mulberry32) : même graine → même disposition. */
export const createRng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const mod = (n, m) => ((n % m) + m) % m;
const between = (rng, min, max) => min + rng() * (max - min);

// ── Géométrie de la zone sombre (desktop) ──────────────────────────────

/** Zone « plan entier » : tout l'écran. Voir computeTargets (fieldZone). */
export const fullFieldZone = (vw, vh) => ({ left: 0, width: vw, height: vh });

/**
 * La vague desktop (utils/wavePath.js) va de 60vw en haut à 45vw en bas, ± 2vw d'amplitude.
 * On en déduit la zone utile pour placer l'amas.
 */
export const zoneGeometry = (vw, vh) => {
  const waveX = (yFrac) => ((60 - 15 * yFrac + 2) / 100) * vw; // bord gauche « sûr » (amplitude incluse)
  const left = 0.45 * vw;
  return {
    vw,
    vh,
    left,                 // bord gauche le plus à gauche de la zone (bas de l'écran)
    width: vw - left,
    height: vh,
    waveX,
    center: { x: (waveX(0.5) + vw) / 2, y: vh / 2 },
    innerWidth: vw - waveX(0), // largeur garantie sur toute la hauteur
  };
};

// ── 1. Tuile infinie ───────────────────────────────────────────────────

const ASPECT = 9 / 16;
const TIERS = [
  // largeur relative à la cellule, probabilité, profondeur (parallaxe à venir)
  { scale: 0.72, weight: 0.3, depth: 0.35 },
  { scale: 0.86, weight: 0.4, depth: 0.65 },
  { scale: 1, weight: 0.3, depth: 1 },
];

const pickTier = (rng) => {
  let r = rng();
  for (const tier of TIERS) {
    if ((r -= tier.weight) <= 0) return tier;
  }
  return TIERS[TIERS.length - 1];
};

/**
 * @param {object} opts
 * @param {number} opts.zoneW  largeur de la zone visible (px)
 * @param {number} opts.zoneH  hauteur de la zone visible (px)
 * @param {{src: string, slug: string}[]} opts.pool  images disponibles
 * @param {number} [opts.seed]
 * @param {number} [opts.cellW] taille cible d'une cellule
 * @param {number} [opts.cellH]
 * @param {number} [opts.gap]   écart minimal garanti entre deux images
 * @returns {{ W: number, H: number, slots: object[] }}
 */
export const generateTile = ({ zoneW, zoneH, pool, seed = 1, cellW = 290, cellH = 230, gap = 32 }) => {
  const rng = createRng(seed);
  const maxImgW = (cellW - gap) * TIERS[TIERS.length - 1].scale;

  // La tuile dépasse la zone d'au moins une image de chaque côté :
  // chaque emplacement n'a donc besoin que d'un seul nœud DOM (il « boucle » hors écran).
  const cols = Math.max(4, Math.ceil((zoneW + 2 * maxImgW + gap) / cellW));
  let rows = Math.max(4, Math.ceil((zoneH + 2 * maxImgW * ASPECT + gap) / cellH));
  if (rows % 2) rows += 1; // nombre pair : le décalage d'une ligne sur deux se raccorde
  const W = cols * cellW;
  const H = rows * cellH;

  const slots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tier = pickTier(rng);
      const w = (cellW - gap) * tier.scale;
      const h = w * ASPECT;
      // Jitter borné par la cellule (moins la moitié de l'écart de chaque côté) → aucun chevauchement
      const jx = between(rng, -1, 1) * Math.max(0, (cellW - gap - w) / 2);
      const jy = between(rng, -1, 1) * Math.max(0, (cellH - gap - h) / 2);
      const stagger = r % 2 ? cellW / 2 : 0;
      slots.push({
        id: slots.length,
        x: mod((c + 0.5) * cellW + stagger + jx, W),
        y: (r + 0.5) * cellH + jy,
        w,
        h,
        depth: tier.depth,
      });
    }
  }

  assignImages(slots, pool, { W, H, minDist: cellW * 1.9, rng });
  return { W, H, slots };
};

/**
 * Répartit les images : chaque image est utilisée un nombre de fois équilibré,
 * et deux exemplaires d'une même image ne sont jamais voisins (distance torique).
 */
const assignImages = (slots, pool, { W, H, minDist, rng }) => {
  const usage = new Map(pool.map((p) => [p.src, 0]));
  const placed = new Map(pool.map((p) => [p.src, []]));
  const order = slots.map((_, i) => i).sort(() => rng() - 0.5);

  const farEnough = (src, slot) =>
    placed.get(src).every((o) => {
      const dx = Math.min(Math.abs(o.x - slot.x), W - Math.abs(o.x - slot.x));
      const dy = Math.min(Math.abs(o.y - slot.y), H - Math.abs(o.y - slot.y));
      return Math.hypot(dx, dy) >= minDist;
    });

  for (const i of order) {
    const slot = slots[i];
    const shuffled = [...pool].sort(() => rng() - 0.5);
    const byUsage = shuffled.sort((a, b) => usage.get(a.src) - usage.get(b.src));
    const choice = byUsage.find((p) => farEnough(p.src, slot)) ?? byUsage[0];
    slot.src = choice.src;
    slot.slug = choice.slug;
    usage.set(choice.src, usage.get(choice.src) + 1);
    placed.get(choice.src).push(slot);
  }
};

// ── 2. Tuile → écran ───────────────────────────────────────────────────

/**
 * Position écran (centre) d'un emplacement.
 * La tuile est « enroulée » autour de la zone : la couture se trouve hors écran.
 * @param {{x:number,y:number}} pan déplacement courant du plan (px)
 */
export const tileToScreen = (slot, tile, zone, pan) => {
  const ox = zone.left - (tile.W - zone.width) / 2;
  const oy = -(tile.H - zone.height) / 2;
  // Fenêtre d'enroulement : [ox, ox + W) en x, [oy, oy + H) en y, centrée sur la zone
  return {
    x: ox + mod(slot.x + pan.x - ox, tile.W),
    y: oy + mod(slot.y + pan.y - oy, tile.H),
  };
};

// ── 3. Choix des exemplaires qui rejoignent l'amas ─────────────────────

/**
 * Pour chaque image de l'amas, prend l'exemplaire le plus proche du centre de la zone
 * (donc en priorité un exemplaire visible). Les autres exemplaires restent sur le plan.
 * @returns {Map<string, number>} src → id de l'emplacement choisi
 */
export const pickClusterSlots = (clusterSrcs, tile, zone, pan) => {
  const picked = new Map();
  for (const src of clusterSrcs) {
    let best = null;
    let bestDist = Infinity;
    for (const slot of tile.slots) {
      if (slot.src !== src) continue;
      const p = tileToScreen(slot, tile, zone, pan);
      const d = Math.hypot(p.x - zone.center.x, p.y - zone.center.y);
      if (d < bestDist) { bestDist = d; best = slot; }
    }
    if (best) picked.set(src, best.id);
  }
  return picked;
};

// ── 3 bis. Écartement des images qui ne sont pas dans l'amas ───────────

/**
 * Éloigne une image du point de groupement d'une distance constante `push`, dans l'axe centre → image.
 * Avec un décalage constant, toutes les distances entre images augmentent ou restent égales :
 * l'écartement ne peut donc pas créer de chevauchement.
 * @param {{x:number,y:number}} pos position écran (centre de l'image)
 */
export const repelFrom = (pos, center, push) => {
  const dx = pos.x - center.x;
  const dy = pos.y - center.y;
  const d = Math.hypot(dx, dy);
  if (d < 1) return { x: pos.x + push, y: pos.y };
  return { x: pos.x + (dx / d) * push, y: pos.y + (dy / d) * push };
};

/**
 * Écarte toutes les images hors amas.
 * Chaque image recule d'au moins `push` dans l'axe centre → image, puis continue sur cet axe
 * tant qu'elle touche l'amas ou une image déjà replacée (les plus proches du centre d'abord).
 * Résultat : rien ne reste caché sous l'amas, et aucun chevauchement entre images de fond.
 *
 * @param {{id:number,x:number,y:number,w:number,h:number}[]} items positions de repos
 * @param {Map} cluster résultat de computeCluster()
 * @returns {Map<number, {x:number,y:number}>} id → nouvelle position
 */
export const repelBackground = (items, cluster, center, { push, gap = 24, step = 10, maxSteps = 300 }) => {
  const hits = (a, b, margin) =>
    Math.abs(a.x - b.x) < (a.w + b.w) / 2 + margin && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + margin;
  const obstacles = [...cluster.values()];
  const placed = [];
  const result = new Map();

  const sorted = [...items].sort(
    (a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y)
  );
  for (const it of sorted) {
    const dx = it.x - center.x;
    const dy = it.y - center.y;
    const d = Math.hypot(dx, dy);
    const [ux, uy] = d < 1 ? [1, 0] : [dx / d, dy / d];
    const cand = { ...it, x: it.x + ux * push, y: it.y + uy * push };
    for (let i = 0; i < maxSteps; i++) {
      const blocked = obstacles.some((o) => hits(cand, o, gap)) || placed.some((o) => hits(cand, o, gap));
      if (!blocked) break;
      cand.x += ux * step;
      cand.y += uy * step;
    }
    placed.push(cand);
    result.set(it.id, { x: cand.x, y: cand.y });
  }
  return result;
};

// ── 4. Disposition de l'amas ───────────────────────────────────────────

/**
 * Amas centré dans la zone : l'image principale au centre, les autres autour.
 * Relaxation déterministe : attraction vers le centre + séparation des rectangles.
 * Les rectangles sont réduits de `overlap` pour la collision → chevauchement partiel autorisé,
 * jamais complet.
 *
 * @param {object} opts
 * @param {string[]} opts.srcs  images de l'amas (la 1re est l'image principale)
 * @param {object}   opts.zone  résultat de zoneGeometry()
 * @param {number}   [opts.seed]
 * @param {number}   [opts.overlap] part de chaque demi-taille qui peut chevaucher (0 = aucun contact)
 * @param {number}   [opts.maxCover] part maximale d'une image cachée par celles posées au-dessus
 * @param {number}   [opts.padding] marge avec le bord de la vague et de l'écran
 * @returns {Map<string, {x:number,y:number,w:number,h:number,rot:number,z:number}>}
 */
export const computeCluster = ({ srcs, zone, seed = 1, overlap = 0.16, maxCover = 0.22, padding = 32, iterations = 500 }) => {
  const rng = createRng(seed * 7919 + srcs.length);
  const inner = zone.innerWidth;
  const few = srcs.length <= 5;
  const heroW = Math.min(Math.max(inner * (few ? 0.56 : 0.5), 260), 560);

  const items = srcs.map((src, i) => {
    const w = i === 0 ? heroW : inner * between(rng, few ? 0.3 : 0.24, few ? 0.38 : 0.32);
    const angle = i * 2.39996 + between(rng, -0.3, 0.3); // angle d'or → répartition autour du centre
    const radius = i === 0 ? 0 : heroW * 0.55 + w * 0.4;
    return {
      src,
      hero: i === 0,
      w,
      h: w * ASPECT,
      x: zone.center.x + Math.cos(angle) * radius,
      y: zone.center.y + Math.sin(angle) * radius * 0.8,
    };
  });

  const clampToZone = (it) => {
    const top = it.y - it.h / 2;
    const minX = zone.waveX(Math.max(0, top) / zone.vh) + padding + it.w / 2;
    const maxX = zone.vw - padding - it.w / 2;
    it.x = Math.min(Math.max(it.x, minX), maxX);
    it.y = Math.min(Math.max(it.y, padding + it.h / 2), zone.vh - padding - it.h / 2);
  };

  for (let step = 0; step < iterations; step++) {
    const pull = 0.02 * (1 - step / iterations);
    for (const it of items) {
      if (it.hero) continue;
      it.x += (zone.center.x - it.x) * pull;
      it.y += (zone.center.y - it.y) * pull;
    }
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i];
        const b = items[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        // Les images secondaires peuvent se glisser sous l'image principale,
        // mais se chevauchent très peu entre elles (sinon les recouvrements s'additionnent)
        const allowed = a.hero || b.hero ? overlap : overlap * 0.3;
        const px = ((a.w + b.w) / 2) * (1 - allowed) - Math.abs(dx);
        const py = ((a.h + b.h) / 2) * (1 - allowed) - Math.abs(dy);
        if (px <= 0 || py <= 0) continue;
        // On sépare selon l'axe de plus faible pénétration ; l'image principale ne bouge pas
        const [wa, wb] = a.hero ? [0, 1] : b.hero ? [1, 0] : [0.5, 0.5];
        if (px < py) {
          const s = Math.sign(dx) || 1;
          a.x -= s * px * wa;
          b.x += s * px * wb;
        } else {
          const s = Math.sign(dy) || 1;
          a.y -= s * py * wa;
          b.y += s * py * wb;
        }
      }
    }
    items.forEach(clampToZone);
  }

  // Recentre l'ensemble sur le centre de la zone (l'image principale suit)
  const minX = Math.min(...items.map((i) => i.x - i.w / 2));
  const maxX = Math.max(...items.map((i) => i.x + i.w / 2));
  const minY = Math.min(...items.map((i) => i.y - i.h / 2));
  const maxY = Math.max(...items.map((i) => i.y + i.h / 2));
  const shiftX = zone.center.x - (minX + maxX) / 2;
  const shiftY = zone.center.y - (minY + maxY) / 2;
  items.forEach((it) => {
    it.x += shiftX;
    it.y += shiftY;
    clampToZone(it);
  });

  // Plafond de recouvrement : une image trop cachée est écartée du centre, pas à pas
  // Calques fixés une fois pour toutes, avant tout mouvement : principale tout au-dessus, puis de la plus grande
  // (devant) à la plus petite (derrière). z ≥ 200 : toujours au-dessus des images qui quittent un amas.
  [...items]
    .filter((it) => !it.hero)
    .sort((a, b) => a.w * a.h - b.w * b.h || 0)
    .forEach((it, rank) => { it.z = 210 + rank; });
  items.forEach((it) => { if (it.hero) it.z = 300; });
  for (let step = 0; step < 300; step++) {
    let worst = null;
    let worstCover = maxCover;
    for (const it of items) {
      const c = coverage(it, items);
      if (c > worstCover) { worstCover = c; worst = it; }
    }
    if (!worst) break;
    // On l'écarte de l'image qui la recouvre le plus (déplacement local, l'amas reste groupé)
    const over = items
      .filter((b) => b.z > worst.z)
      .map((b) => ({ b, area: Math.max(0, Math.min(worst.x + worst.w / 2, b.x + b.w / 2) - Math.max(worst.x - worst.w / 2, b.x - b.w / 2))
        * Math.max(0, Math.min(worst.y + worst.h / 2, b.y + b.h / 2) - Math.max(worst.y - worst.h / 2, b.y - b.h / 2)) }))
      .sort((m, n) => n.area - m.area)[0].b;
    const dx = worst.x - over.x;
    const dy = worst.y - over.y;
    const len = Math.hypot(dx, dy) || 1;
    worst.x += (dx / len) * 4;
    worst.y += (dy / len) * 4;
    clampToZone(worst);
  }

  return new Map(
    items.map((it, i) => [
      it.src,
      {
        x: it.x,
        y: it.y,
        w: it.w,
        h: it.h,
        rot: it.hero ? 0 : between(rng, -3.5, 3.5),
        z: it.z,
      },
    ])
  );
};

/** Part de `a` cachée par les images posées au-dessus (z plus grand), par échantillonnage. */
const coverage = (a, items, N = 20) => {
  const above = items.filter((b) => b.z > a.z);
  if (!above.length) return 0;
  let covered = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = a.x - a.w / 2 + ((i + 0.5) / N) * a.w;
      const y = a.y - a.h / 2 + ((j + 0.5) / N) * a.h;
      if (above.some((b) => Math.abs(x - b.x) < b.w / 2 && Math.abs(y - b.y) < b.h / 2)) covered++;
    }
  }
  return covered / (N * N);
};

/**
 * Part maximale d'une image de l'amas recouverte par les autres.
 * Sert à vérifier la règle « jamais de chevauchement complet » (approximation : rectangles sans rotation).
 */
export const maxClusterCoverage = (cluster) => {
  const items = [...cluster.values()];
  return Math.max(0, ...items.map((a) => coverage(a, items)));
};

// ── 5. Cibles de tous les emplacements pour un état donné ──────────────

/**
 * Calcule, pour CHAQUE emplacement du plan, la position / taille / rotation / mode à atteindre.
 * C'est la seule fonction que le moteur d'animation consomme : changer d'état = recalculer les cibles.
 *
 *  mode 'idle'       : repos, aucun amas
 *  mode 'background' : un amas est formé, cette image s'écarte
 *  mode 'cluster'    : cette image rejoint l'amas
 *
 * `delay` (ms) décale le départ de chaque image : l'amas se construit image par image
 * (du dessus vers le dessous, principale en premier), l'écartement se propage du centre vers l'extérieur.
 *
 * @param {object} zone       zone de l'amas (zone sombre au repos, cf. zoneGeometry)
 * @param {object} [fieldZone] zone sur laquelle le plan est tuilé (par défaut = zone ; sur le vrai site : tout l'écran,
 *                             car la vague recouvre presque tout l'écran pendant le splash)
 * @param {string[]|null} clusterSrcs images de l'amas (la 1re = principale), null au repos
 * @param {number} push écartement minimal des images hors amas (px)
 * @param {string|null} [slug] projet de l'amas (sert à reconnaître ses autres images dans le plan)
 * @param {'in'|'out'|null} [zoom] transition vers une étude de cas : l'image principale zoome (mode 'zoom' ;
 *        'out' = zoomée mais effacée), les images des AUTRES projets s'éloignent (mode 'away'), l'amas et les
 *        autres images du projet restent en place.
 */
export const computeTargets = ({ tile, zone, fieldZone = zone, pan, clusterSrcs, seed, overlap, push, slug = null, zoom = null }) => {
  const targets = new Map();
  const homes = tile.slots.map((s) => ({ id: s.id, slug: s.slug, ...tileToScreen(s, tile, fieldZone, pan), w: s.w, h: s.h, depth: s.depth }));
  const fromCenter = (p) => Math.min(Math.hypot(p.x - zone.center.x, p.y - zone.center.y) / zone.vw, 1);

  if (!clusterSrcs?.length) {
    for (const h of homes) {
      targets.set(h.id, { x: h.x, y: h.y, w: h.w, h: h.h, rot: 0, z: 1, depth: h.depth, mode: 'idle', delay: fromCenter(h) * 120 });
    }
    return { targets, cluster: new Map() };
  }

  const cluster = computeCluster({ srcs: clusterSrcs, zone, seed, overlap });
  const picked = pickClusterSlots(clusterSrcs, tile, { ...fieldZone, center: zone.center }, pan);
  const srcById = new Map([...picked].map(([src, id]) => [id, src]));
  const order = new Map(clusterSrcs.map((src, i) => [src, i]));
  const repelled = repelBackground(
    homes.filter((h) => !srcById.has(h.id)),
    cluster,
    zone.center,
    { push }
  );

  // Ordre d'arrivée = ordre des calques, du dessus vers le dessous : l'image principale arrive la première,
  // puis les autres par calque décroissant (celles qui doivent être devant arrivent avant).
  const arrival = new Map(
    [...cluster.entries()].sort((a, b) => b[1].z - a[1].z).map(([src], rank) => [src, rank])
  );

  for (const h of homes) {
    const src = srcById.get(h.id);
    if (src) {
      const c = cluster.get(src);
      const i = order.get(src);
      // Amas : profondeurs proches (il se déplace presque d'un bloc), l'image principale un peu plus « proche »
      if (zoom && i === 0) {
        // Zoom complet : l'image principale recouvre tout l'écran (« cover », 2 % de marge), centrée sur l'écran
        const aspect = c.h / c.w;
        const w = Math.max(zone.vw, zone.vh / aspect) * 1.02;
        targets.set(h.id, {
          x: zone.vw / 2, y: zone.vh / 2, w, h: w * aspect, rot: 0, z: c.z, depth: 0,
          mode: zoom === 'out' ? 'zoomOut' : 'zoom', delay: 0,
        });
      } else {
        targets.set(h.id, { ...c, depth: i === 0 ? 1 : 0.75, mode: 'cluster', delay: arrival.get(src) * 60 });
      }
    } else {
      const r = repelled.get(h.id);
      if (zoom && h.slug !== slug) {
        // Image d'un autre projet : on la chasse hors de l'écran (dilatation autour du centre : pas de chevauchement)
        const K = 3;
        targets.set(h.id, {
          x: zone.center.x + (r.x - zone.center.x) * K, y: zone.center.y + (r.y - zone.center.y) * K,
          w: h.w, h: h.h, rot: 0, z: 1, depth: h.depth, mode: 'away', delay: fromCenter(h) * 100,
        });
      } else {
        targets.set(h.id, { x: r.x, y: r.y, w: h.w, h: h.h, rot: 0, z: 1, depth: h.depth, mode: 'background', delay: fromCenter(h) * 180 });
      }
    }
  }
  return { targets, cluster };
};
