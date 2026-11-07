import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import fs from 'node:fs'
import path from 'node:path'
import { ROUTES } from './src/routes.js'

const BASE = '/Portfolio/'
const SITE_URL = 'https://harlegandromain.github.io'

/**
 * Génère une copie de index.html pour chaque route (dist/projets/gwido/index.html, …)
 * avec le bon <title>, canonical et balises Open Graph.
 * → GitHub Pages sert un vrai 200 sur chaque URL (partage de lien, SEO, analytics).
 * dist/404.html sert de filet pour les URLs inconnues (l'app revient à l'accueil).
 */
const staticRoutePages = () => ({
  name: 'static-route-pages',
  apply: 'build',
  closeBundle() {
    const dist = path.resolve('dist')
    const indexPath = path.join(dist, 'index.html')
    if (!fs.existsSync(indexPath)) return
    const html = fs.readFileSync(indexPath, 'utf-8')

    const withMeta = (route) => {
      const url = `${SITE_URL}${BASE.replace(/\/$/, '')}${route.path}`
      return html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="twitter:url" content=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${route.title}$2`)
        .replace(/(<meta property="twitter:title" content=")[^"]*(")/, `$1${route.title}$2`)
    }

    for (const route of ROUTES) {
      if (route.path === '/') continue
      const dir = path.join(dist, route.path)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'index.html'), withMeta(route))
    }
    fs.writeFileSync(path.join(dist, '404.html'), html)
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // Les SVG sont déjà minimes (et svgo n'est pas installé)
      test: /\.(jpe?g|png|webp|avif)$/i,
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      // Lossless faisait grossir les WebP (×2 à ×3) : le plugin les ignorait.
      webp: { quality: 80 },
    }),
    staticRoutePages(),
  ],
  base: BASE,
})
