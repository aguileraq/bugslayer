export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export type LocalizationKey = string;

export type LocalizationParameter = boolean | number | string;

export type LocalizationParameters = Readonly<
  Record<string, LocalizationParameter>
>;

export type LocaleDictionary = Readonly<Record<LocalizationKey, string>>;

export interface LocaleBundle {
  readonly language: Language;
  readonly messages: LocaleDictionary;
}

export interface SessionSettings {
  readonly language: Language | null;
}
