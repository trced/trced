import { describe, expect, test } from 'vitest'
import { resolveOrigin } from './origin.ts'

describe('resolveOrigin', () => {
  test('un domaine explicite gagne toujours', () => {
    expect(
      resolveOrigin({ SITE_ORIGIN: 'https://trced.dev', URL: 'https://autre.net' }),
    ).toBe('https://trced.dev')
  })

  test('à défaut, celui que Netlify fournit au build', () => {
    expect(resolveOrigin({ URL: 'https://trced.netlify.app' })).toBe(
      'https://trced.netlify.app',
    )
  })

  test('à défaut, le domaine de production Vercel, en https', () => {
    expect(resolveOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'trced.vercel.app' })).toBe(
      'https://trced.vercel.app',
    )
  })

  test('la barre finale est retirée : les chemins la portent déjà', () => {
    expect(resolveOrigin({ SITE_ORIGIN: 'https://trced.dev/' })).toBe(
      'https://trced.dev',
    )
  })

  test('sans rien, aucune adresse absolue', () => {
    expect(resolveOrigin({})).toBe('')
    expect(resolveOrigin({ SITE_ORIGIN: '  ' })).toBe('')
  })
})
