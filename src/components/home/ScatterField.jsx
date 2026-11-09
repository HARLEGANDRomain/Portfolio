import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { assetUrl } from '../../utils/assetUrl';

/**
 * Champ d'images éparpillées animé par des ressorts, avec parallaxe et « respiration » de l'amas.
 *
 * Principe : le parent calcule des CIBLES (cf. computeTargets) ; ce composant fait voyager chaque image
 * vers sa cible. Rien ne passe par le state React : les styles sont écrits directement sur les éléments
 * dans une boucle requestAnimationFrame, qui s'arrête dès que plus rien ne bouge.
 *
 *  - Interruptible : changer les cibles en plein mouvement conserve position ET vitesse.
 *  - Décalage par image (`delay`) : l'amas se construit image par image.
 *  - Parallaxe : chaque image suit la souris proportionnellement à sa profondeur (grande = proche = bouge plus).
 *    Garantie anti-chevauchement : deux images voisines se déplacent l'une par rapport à l'autre d'au plus
 *    (écart de profondeur max 0,65) × `parallax` px. Avec parallax ≤ 28 → ≤ 18,2 px, sous l'écart minimal
 *    entre images (≥ 24 px, cf. generateTile et repelBackground).
 *  - Respiration : dérive lente et propre à chaque image de l'amas (quelques px, ±0,5°).
 *  - `layoutKey` : quand il change (redimensionnement, nouvelle graine) tout est placé instantanément.
 *  - `reducedMotion` : placement instantané, ni parallaxe ni respiration.
 *  - `paused` : la boucle s'arrête (ex. scène masquée).
 *  - `onItemClick(id)` : appelé au clic sur une image DE L'AMAS (les autres ne captent pas la souris).
 */

// Style visuel selon le mode : désaturation partielle au repos, couleurs pleines + ombre dans l'amas.
// Les cartes restent TOUJOURS opaques (op = 1) : l'effacement passe par la luminosité seule (≈ même rendu sur le
// fond sombre). Une carte translucide en cours de route laissait voir les cartes placées derrière elle.
const LOOK = {
  idle: { sat: 0.35, bri: 0.6, op: 1, sh: 0 },
  background: { sat: 0.2, bri: 0.25, op: 1, sh: 0 },
  cluster: { sat: 1, bri: 1, op: 1, sh: 1 },
};

const PROPS = ['x', 'y', 'w', 'h', 'rot', 'sat', 'bri', 'op', 'sh', 'depth', 'br'];
const EPS = { x: 0.05, y: 0.05, w: 0.05, h: 0.05, rot: 0.01, sat: 0.002, bri: 0.002, op: 0.002, sh: 0.002, depth: 0.002, br: 0.002 };

// Ressorts : l'amas arrive plus vite qu'il ne se disperse (les images « s'éloignent » plus doucement)
const STIFFNESS = { cluster: 110, background: 55, idle: 60 };
const DAMPING_RATIO = 0.9;
const STEP = 1 / 120;

const BREATH_PX = 3.5;   // amplitude de la dérive de l'amas
const BREATH_DEG = 0.5;
const PARALLAX_FOLLOW = 7; // 1/s : la parallaxe rattrape la souris en ~150 ms

const zeroVel = () => Object.fromEntries(PROPS.map((p) => [p, 0]));
const goalOf = (t, breathing) => ({
  x: t.x, y: t.y, w: t.w, h: t.h, rot: t.rot,
  depth: t.depth ?? 1,
  br: breathing && t.mode === 'cluster' ? (t.z >= 100 ? 0.6 : 1) : 0, // la principale respire moins
  ...LOOK[t.mode],
});
const near = (a, b) => PROPS.every((p) => Math.abs(a[p] - b[p]) < EPS[p]);

/** Nombre pseudo-aléatoire stable dans [0,1[ pour (id, k) : phases de respiration propres à chaque image. */
const rand = (id, k) => { const v = Math.sin(id * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };

const offsetsOf = (it, id, par, amp, clock) => {
  const c = it.cur;
  const f = amp * c.depth;
  const b = c.br;
  return {
    dx: par.x * f + (b > 0.001 ? Math.sin(clock * (0.55 + rand(id, 1) * 0.5) + rand(id, 2) * 6.283) * BREATH_PX * b : 0),
    dy: par.y * f + (b > 0.001 ? Math.cos(clock * (0.43 + rand(id, 3) * 0.5) + rand(id, 4) * 6.283) * BREATH_PX * b : 0),
    dr: b > 0.001 ? Math.sin(clock * (0.37 + rand(id, 5) * 0.4) + rand(id, 6) * 6.283) * BREATH_DEG * b : 0,
  };
};

const paintPos = (el, c, o) => {
  el.style.transform = `translate3d(${c.x + o.dx - c.w / 2}px, ${c.y + o.dy - c.h / 2}px, 0) rotate(${c.rot + o.dr}deg)`;
};

const paintFull = (el, c, z, o, interactive) => {
  const op = Math.min(Math.max(c.op, 0), 1);
  const sat = Math.max(c.sat, 0);
  el.style.width = `${c.w}px`;
  el.style.height = `${c.h}px`;
  paintPos(el, c, o);
  el.style.filter = sat > 0.995 && Math.abs(c.bri - 1) < 0.005 ? 'none' : `saturate(${sat}) brightness(${Math.max(c.bri, 0)})`;
  el.style.opacity = op;
  el.style.boxShadow = c.sh > 0.01 ? `0 18px 40px -12px rgba(0,0,0,${(0.7 * Math.min(c.sh, 1)).toFixed(3)})` : 'none';
  el.style.zIndex = z;
  // Seules les images de l'amas captent la souris (elles renvoient vers le projet)
  el.style.pointerEvents = interactive ? 'auto' : 'none';
  el.style.cursor = interactive ? 'pointer' : '';
};

const ScatterField = ({
  items, targets, layoutKey,
  reducedMotion = false, timeScale = 1, parallax = 28, breathing = true, paused = false, onItemClick, className = '',
}) => {
  const root = useRef(null);
  const els = useRef(new Map());
  const engine = useRef({
    items: new Map(), raf: 0, last: 0, layoutKey: null, clock: 0,
    mouse: { x: 0, y: 0 }, par: { x: 0, y: 0 }, settled: true, forcePaint: false,
  });
  // Dernières valeurs des props, lues par la boucle sans la relancer
  const live = useRef({});
  live.current = { timeScale, parallax: reducedMotion ? 0 : parallax, breathing: breathing && !reducedMotion, paused };

  const mark = (settled) => {
    const e = engine.current;
    if (e.settled === settled) return;
    e.settled = settled;
    if (root.current) root.current.dataset.settled = settled ? '1' : '0';
  };

  const tick = (t) => {
    const e = engine.current;
    const { timeScale: ts, parallax: amp, paused: isPaused } = live.current;
    if (isPaused) { e.raf = 0; return; }
    const dt = Math.min(((t - e.last) / 1000) * ts, 1 / 20);
    e.last = t;
    e.clock += dt;

    // Parallaxe : suit la souris avec un léger retard
    const dpx = e.mouse.x - e.par.x;
    const dpy = e.mouse.y - e.par.y;
    const parMoving = Math.abs(dpx) > 5e-4 || Math.abs(dpy) > 5e-4;
    if (parMoving) {
      const k = 1 - Math.exp(-dt * PARALLAX_FOLLOW);
      e.par.x += dpx * k;
      e.par.y += dpy * k;
    }

    let springs = false;
    let breathingNow = false;
    const forced = e.forcePaint;
    e.forcePaint = false;

    for (const [id, it] of e.items) {
      if (it.next && t >= it.next.at) {
        it.goal = it.next.goal;
        it.k = it.next.k;
        it.z = it.next.z;
        it.mode = it.next.mode;
        it.next = null;
        it.settled = false;
      }
      if (it.next) springs = true;

      let justSettled = false;
      if (!it.settled) {
        const k = it.k;
        const c = 2 * DAMPING_RATIO * Math.sqrt(k);
        const steps = Math.max(1, Math.ceil(dt / STEP));
        const h = dt / steps;
        for (let s = 0; s < steps; s++) {
          for (const p of PROPS) {
            it.vel[p] += (k * (it.goal[p] - it.cur[p]) - c * it.vel[p]) * h;
            it.cur[p] += it.vel[p] * h;
          }
        }
        if (near(it.cur, it.goal) && PROPS.every((p) => Math.abs(it.vel[p]) < EPS[p] * 4)) {
          it.cur = { ...it.goal };
          it.vel = zeroVel();
          it.settled = true;
          justSettled = true;
        } else {
          springs = true;
        }
      }

      const breathes = it.cur.br > 0.001;
      if (breathes) breathingNow = true;

      const el = els.current.get(id);
      if (!el) continue;
      if (!it.settled || justSettled || forced) {
        paintFull(el, it.cur, it.zNow, offsetsOf(it, id, e.par, amp, e.clock), it.mode === 'cluster');
      } else if (parMoving || breathes) {
        paintPos(el, it.cur, offsetsOf(it, id, e.par, amp, e.clock));
      }
    }

    // Les calques ne sont « normalisés » qu'une fois TOUT le champ au repos : une image qui arrive
    // à destination avant les autres ne change donc jamais de niveau pendant la transition.
    if (!springs) {
      for (const [id, it] of e.items) {
        if (it.zNow === it.z) continue;
        it.zNow = it.z;
        const el = els.current.get(id);
        if (el) el.style.zIndex = it.z;
      }
    }

    mark(!springs);
    if (springs || parMoving || breathingNow) {
      e.raf = requestAnimationFrame(tick);
    } else {
      e.raf = 0;
    }
  };

  const wake = () => {
    const e = engine.current;
    if (e.raf || live.current.paused) return;
    e.last = performance.now();
    e.raf = requestAnimationFrame(tick);
  };
  const wakeRef = useRef(wake);
  wakeRef.current = wake;

  // Applique les nouvelles cibles : placement instantané ou départ (différé) d'un ressort
  useLayoutEffect(() => {
    const e = engine.current;
    const now = performance.now();
    const instant = reducedMotion || e.layoutKey !== layoutKey;
    e.layoutKey = layoutKey;
    const withBreath = live.current.breathing;
    let moving = false;

    for (const { id } of items) {
      const t = targets.get(id);
      if (!t) continue;
      const goal = goalOf(t, withBreath);
      const it = e.items.get(id);

      if (!it || instant) {
        const fresh = {
          cur: { ...goal }, vel: zeroVel(), goal, next: null,
          k: STIFFNESS[t.mode], z: t.z, zNow: t.z, mode: t.mode, settled: true,
        };
        e.items.set(id, fresh);
        const el = els.current.get(id);
        if (el) paintFull(el, goal, t.z, offsetsOf(fresh, id, e.par, live.current.parallax, e.clock), t.mode === 'cluster');
        if (goal.br > 0) moving = true; // la respiration doit démarrer
        continue;
      }

      const pending = it.next?.goal ?? it.goal;
      if (near(pending, goal) && (it.next?.z ?? it.z) === t.z) continue; // cible inchangée
      // Les arrivants (z ≥ 200) passent devant immédiatement ; ceux qui quittent l'amas descendent sous eux
      // en gardant leur ordre relatif (−200) : aucun changement de calque visible entre images qui se chevauchent
      if (t.z > 1) it.zNow = t.z;
      else if (it.zNow >= 200) it.zNow -= 200;
      it.next = { goal, at: now + t.delay / live.current.timeScale, k: STIFFNESS[t.mode], z: t.z, mode: t.mode };
      it.settled = false;
      moving = true;
    }
    if (moving) wake();
    else mark(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, layoutKey, reducedMotion, breathing]);

  // Changement d'amplitude de parallaxe ou reprise après pause : tout repeindre
  useEffect(() => {
    engine.current.forcePaint = true;
    wakeRef.current();
  }, [parallax, paused, reducedMotion]);

  // Souris → parallaxe (souris uniquement : pas de parallaxe au doigt)
  useEffect(() => {
    if (reducedMotion) { engine.current.mouse = { x: 0, y: 0 }; return undefined; }
    const onMove = (ev) => {
      if (ev.pointerType && ev.pointerType !== 'mouse') return;
      const e = engine.current;
      e.mouse.x = Math.max(-1, Math.min(1, (ev.clientX / window.innerWidth - 0.5) * 2));
      e.mouse.y = Math.max(-1, Math.min(1, (ev.clientY / window.innerHeight - 0.5) * 2));
      wakeRef.current();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reducedMotion]);

  useEffect(() => () => {
    // Remise à zéro de raf : en mode strict React démonte/remonte aussitôt, sans ça wake() croirait la boucle active
    cancelAnimationFrame(engine.current.raf);
    engine.current.raf = 0;
  }, []);

  return (
    <div ref={root} className={`absolute inset-0 pointer-events-none ${className}`} data-settled="1" aria-hidden="true">
      {items.map(({ id, src }) => (
        <div
          key={id}
          ref={(el) => { if (el) els.current.set(id, el); else els.current.delete(id); }}
          className="absolute left-0 top-0 rounded-lg overflow-hidden border-2 border-white"
          onClick={() => { if (engine.current.items.get(id)?.mode === 'cluster') onItemClick?.(id); }}
        >
          <img src={assetUrl(src)} alt="" draggable={false} decoding="async" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
};

export default ScatterField;
