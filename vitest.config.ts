import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // Le rendu produit une chaîne HTML ; les tests la parsent pour vérifier
    // la structure plutôt que sa mise en forme.
    environment: 'jsdom',
    // Le site est en TypeScript ; les générateurs d'images sont des scripts
    // autonomes, sans dépendance ni compilation. Les deux sont testés.
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
    restoreMocks: true,
  },
})
