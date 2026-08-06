import {
  SUPPORTED_LANGUAGES,
  type Language,
  type SessionSettings as SessionSettingsContract,
} from '../types';

export class SessionSettingsError extends Error {
  public readonly code = 'INVALID_LANGUAGE';
  public readonly value: unknown;

  public constructor(value: unknown) {
    super('Language must be either "es" or "en".');
    this.name = 'SessionSettingsError';
    this.value = value;
  }
}

function isLanguage(value: unknown): value is Language {
  return SUPPORTED_LANGUAGES.some((language) => language === value);
}

export class SessionSettings implements SessionSettingsContract {
  #language: Language | null = null;

  public get language(): Language | null {
    return this.#language;
  }

  public get hasLanguage(): boolean {
    return this.#language !== null;
  }

  public setLanguage(value: unknown): Language {
    if (!isLanguage(value)) throw new SessionSettingsError(value);
    this.#language = value;
    return value;
  }

  public requireLanguage(): Language {
    if (this.#language === null) throw new SessionSettingsError(null);
    return this.#language;
  }
}
