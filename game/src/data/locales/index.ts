import enMessages from './en.json';
import esMessages from './es.json';

import type { Language, LocaleBundle, LocaleDictionary } from '../../types';

export const INITIAL_LOCALES = {
  es: esMessages,
  en: enMessages,
} as const satisfies Readonly<Record<Language, LocaleDictionary>>;

export const INITIAL_LOCALE_BUNDLES = [
  { language: 'es', messages: INITIAL_LOCALES.es },
  { language: 'en', messages: INITIAL_LOCALES.en },
] as const satisfies readonly LocaleBundle[];

export const INITIAL_LOCALIZATION_KEYS = Object.keys(esMessages).sort();
