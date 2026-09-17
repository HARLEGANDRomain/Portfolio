/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // ── Couleurs projet & outils ──────────────────────────────────
            colors: {
                // Palettes wave par projet
                'gwido-wave-1': '#4f8499',
                'gwido-wave-2': '#4e889d',
                'eom-wave-1':   '#fdcdb7',
                'eom-wave-2':   '#af99c7',
                // Couleurs brand des outils (page Identity)
                'tool-illustrator': '#FF9A00',
                'tool-photoshop':   '#31A8FF',
                'tool-blender':     '#F5792A',
                'tool-git':         '#F05032',
                'tool-figma':       '#a855f7',
            },

            // ── Typographie ───────────────────────────────────────────────
            fontSize: {
                // Pattern label récurrent : text-[10px] tracking-widest font-bold uppercase
                'label': ['0.625rem', {
                    lineHeight: '1',
                    letterSpacing: '0.2em',
                    fontWeight: '700',
                }],
            },

            // ── Easings ───────────────────────────────────────────────────
            transitionTimingFunction: {
                'spring':       'cubic-bezier(0.34, 1.56, 0.64, 1)',
                'spring-in':    'cubic-bezier(0.16, 1, 0.32, 1)',
                'ease-smooth':  'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            },

            // ── Ombres nommées ────────────────────────────────────────────
            boxShadow: {
                'nav-pill':        '0 8px 30px rgba(0,0,0,0.1)',
                'card-sm':         '0 20px 60px rgba(0,0,0,0.07)',
                'card-md':         '0 20px 60px rgba(0,0,0,0.14)',
                'card-hover':      '0 28px 80px rgba(0,0,0,0.2)',
                'role-hover':      '0 24px 48px rgba(0,0,0,0.12)',
                'lightbox':        '0 40px 120px rgba(0,0,0,0.8)',
                'indigo-glow':     '0 30px 80px rgba(99,102,241,0.28), 0 12px 40px rgba(0,0,0,0.18)',
                'emerald-btn':     '0 10px 30px rgba(16,185,129,0.3)',
            },

            // ── Z-Index centralisé ────────────────────────────────────────
            zIndex: {
                'overlay':         '15',
                'wave':            '20',
                'splash':          '25',
                'header':          '40',
                'lightbox':        '9999',
                'lightbox-close':  '10000',
            },
        },
    },
    plugins: [],
}

