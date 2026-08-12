import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    // Le rendu produit une chaîne HTML ; les tests la parsent pour vérifier
    // la structure plutôt que sa mise en forme.
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    restoreMocks: true,
  },
})
