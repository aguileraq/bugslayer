import { describe, expect, it } from 'vitest';

import { SessionSettings, SessionSettingsError } from '../../src/core';
import {
  INITIAL_LOCALE_BUNDLES,
  INITIAL_LOCALIZATION_KEYS,
  TECHNICAL_TEXT,
} from '../../src/data';
import {
  LocalizationError,
  LocalizationStore,
  validateLocaleBundles,
} from '../../src/localization';
import type { LocaleBundle } from '../../src/types';

describe('SessionSettings', () => {
  it('accepts only Spanish and English and preserves the confirmed language', () => {
    const settings = new SessionSettings();

    expect(settings.language).toBeNull();
    expect(settings.hasLanguage).toBe(false);
    expect(settings.setLanguage('es')).toBe('es');
    expect(settings.language).toBe('es');
    expect(settings.hasLanguage).toBe(true);
    expect(settings.requireLanguage()).toBe('es');
    expect(() => settings.setLanguage('fr')).toThrowError(
      SessionSettingsError,
    );
    expect(settings.language).toBe('es');
    expect(settings.setLanguage('en')).toBe('en');
    expect(settings.requireLanguage()).toBe('en');
  });

  it('rejects reading a language before explicit confirmation', () => {
    const settings = new SessionSettings();

    expect(() => settings.requireLanguage()).toThrowError(
      SessionSettingsError,
    );
  });
});

describe('initial locales', () => {
  it('contain exactly the same non-empty keys in Spanish and English', () => {
    const validation = validateLocaleBundles(INITIAL_LOCALE_BUNDLES);
    const [spanish, english] = INITIAL_LOCALE_BUNDLES;

    expect(validation).toEqual({ valid: true, issues: [] });
    expect(Object.keys(spanish.messages).sort()).toEqual(
      INITIAL_LOCALIZATION_KEYS,
    );
    expect(Object.keys(english.messages).sort()).toEqual(
      INITIAL_LOCALIZATION_KEYS,
    );
    expect(INITIAL_LOCALIZATION_KEYS).toHaveLength(19);
  });

  it('includes the required Spanish glyph repertoire', () => {
    const spanish = INITIAL_LOCALE_BUNDLES[0];
    const sample = spanish.messages['font.validation.sample'];

    for (const character of ['¿', '?', '¡', '!', 'á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü']) {
      expect(sample).toContain(character);
    }
  });

  it('keeps technical tokens separate from localized prose', () => {
    const settings = new SessionSettings();
    const store = new LocalizationStore(INITIAL_LOCALE_BUNDLES, settings);
    settings.setLanguage('es');

    expect(TECHNICAL_TEXT).toEqual({
      productTitle: 'BugSlayer',
      confirmKey: 'Enter',
      pauseKey: 'ESC',
      programmingLanguage: 'TypeScript',
    });
    expect(
      store.translate('menu.title', {
        productTitle: TECHNICAL_TEXT.productTitle,
      }),
    ).toBe('BugSlayer');
    expect(
      store.translate('languageSelect.help', {
        confirmKey: TECHNICAL_TEXT.confirmKey,
      }),
    ).toContain('Enter');
  });
});

describe('LocalizationStore', () => {
  it('resolves Spanish and English messages with simple parameters', () => {
    const settings = new SessionSettings();
    const store = new LocalizationStore(INITIAL_LOCALE_BUNDLES, settings);

    store.setLanguage('es');
    expect(store.translate('menu.start')).toBe('Iniciar demo');
    expect(store.translate('boot.loading', { progress: 40 })).toBe(
      'Cargando recursos… 40%',
    );

    store.setLanguage('en');
    expect(store.translate('menu.start')).toBe('Start demo');
    expect(store.translate('boot.loading', { progress: 40 })).toBe(
      'Loading assets… 40%',
    );
  });

  it('does not use a silent fallback for unknown keys or absent parameters', () => {
    const settings = new SessionSettings();
    const store = new LocalizationStore(INITIAL_LOCALE_BUNDLES, settings);
    store.setLanguage('en');

    expect(store.has('menu.start')).toBe(true);
    expect(store.has('missing.key')).toBe(false);
    expect(() => store.translate('missing.key')).toThrowError(
      LocalizationError,
    );
    expect(() => store.translate('boot.loading')).toThrowError(
      LocalizationError,
    );
  });

  it('aggregates missing keys and mismatched parameters deterministically', () => {
    const bundles = [
      {
        language: 'es',
        messages: {
          'common.greeting': 'Hola, {name}.',
          'only.spanish': 'Solo español.',
        },
      },
      {
        language: 'en',
        messages: {
          'common.greeting': 'Hello, {person}.',
        },
      },
    ] satisfies readonly LocaleBundle[];

    const first = validateLocaleBundles(bundles);
    const second = validateLocaleBundles(bundles);

    expect(first.valid).toBe(false);
    expect(first).toEqual(second);
    expect(first.issues.map((entry) => entry.code)).toEqual([
      'PARAMETER_MISMATCH',
      'MISSING_KEY',
    ]);
    expect(() => new LocalizationStore(bundles, new SessionSettings())).toThrowError(
      LocalizationError,
    );
  });

  it('rejects duplicate or absent language bundles', () => {
    const spanish = INITIAL_LOCALE_BUNDLES[0];
    const validation = validateLocaleBundles([spanish, spanish]);

    expect(validation.valid).toBe(false);
    expect(validation.issues.map((entry) => entry.code)).toEqual([
      'MISSING_LANGUAGE',
      'DUPLICATE_LANGUAGE',
    ]);
  });
});
