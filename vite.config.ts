import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import type { Lang } from './src/content/index.ts'
import { resolveOrigin } from './src/page/origin.ts'
import { renderBody, renderHead } from './src/page/render.ts'

/** Le contenu est écrit dans les fichiers au moment du build : les pages
 *  partent complètes, il n'y a rien à exécuter côté navigateur. */
function prerender(): Plugin {
  const origin = resolveOrigin(process.env)
  const year = new Date().getFullYear()

  return {
    name: 'trced-prerender',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const lang: Lang = ctx.path.startsWith('/en/') ? 'en' : 'fr'
        return html
          .replace('<!--%head%-->', renderHead(lang, origin))
          .replace('<!--%body%-->', renderBody(lang, year))
      },
    },
  }
}

export default defineConfig({
  plugins: [prerender()],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    rollupOptions: {
      // Une page par langue, à l'adresse qu'elle occupe en production.
      input: {
        fr: resolve(import.meta.dirname, 'index.html'),
        en: resolve(import.meta.dirname, 'en/index.html'),
      },
    },
  },
})
