import { fr } from './fr.ts'
import { en } from './en.ts'
import type { Content } from './types.ts'

export type Lang = 'fr' | 'en'

/** Ordre d'apparition dans la navigation de langue. */
export const LANGS: readonly Lang[] = ['fr', 'en']

export const CONTENT: Record<Lang, Content> = { fr, en }

export type { Content } from './types.ts'
