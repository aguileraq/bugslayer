import type {
  Language,
  LocaleBundle,
  LocaleDictionary,
  LocalizationKey,
  LocalizationParameters,
} from '../types';
import { SUPPORTED_LANGUAGES } from '../types';
import { SessionSettings } from '../core/SessionSettings';

export const LOCALIZATION_ISSUE_CODES = [
  'DUPLICATE_LANGUAGE',
  'MISSING_LANGUAGE',
  'MISSING_KEY',
  'INVALID_MESSAGE',
  'PARAMETER_MISMATCH',
] as const;

export type LocalizationIssueCode =
  (typeof LOCALIZATION_ISSUE_CODES)[number];

export interface LocalizationIssue {
  readonly code: LocalizationIssueCode;
  readonly language: Language;
  readonly key: LocalizationKey;
  readonly message: string;
}

export interface LocalizationValidationReport {
  readonly valid: boolean;
  readonly issues: readonly LocalizationIssue[];
}

export class LocalizationError extends Error {
  public readonly code = 'BOOT_LOCALE_INVALID';
  public readonly issues: readonly LocalizationIssue[];

  public constructor(issues: readonly LocalizationIssue[]) {
    super(`BOOT_LOCALE_INVALID: ${issues.length} localization issue(s).`);
    this.name = 'LocalizationError';
    this.issues = issues;
  }
}

const PARAMETER_PATTERN = /\{([A-Za-z][A-Za-z0-9]*)\}/g;

function compareIssues(left: LocalizationIssue, right: LocalizationIssue): number {
  return (
    left.language.localeCompare(right.language) ||
    left.key.localeCompare(right.key) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message)
  );
}

function issue(
  code: LocalizationIssueCode,
  language: Language,
  key: LocalizationKey,
  message: string,
): LocalizationIssue {
  return { code, language, key, message };
}

function parametersIn(message: string): ReadonlySet<string> {
  const parameters = new Set<string>();
  for (const match of message.matchAll(PARAMETER_PATTERN)) {
    const name = match[1];
    if (name !== undefined) parameters.add(name);
  }
  return parameters;
}

function setsMatch(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  return (
    left.size === right.size &&
    [...left].every((value) => right.has(value))
  );
}

export function validateLocaleBundles(
  bundles: readonly LocaleBundle[],
): LocalizationValidationReport {
  const issues: LocalizationIssue[] = [];
  const dictionaries = new Map<Language, LocaleDictionary>();

  for (const bundle of bundles) {
    if (dictionaries.has(bundle.language)) {
      issues.push(
        issue(
          'DUPLICATE_LANGUAGE',
          bundle.language,
          '$language',
          `Locale "${bundle.language}" was provided more than once.`,
        ),
      );
    } else {
      dictionaries.set(bundle.language, bundle.messages);
    }
  }

  for (const language of SUPPORTED_LANGUAGES) {
    if (!dictionaries.has(language)) {
      issues.push(
        issue(
          'MISSING_LANGUAGE',
          language,
          '$language',
          `Required locale "${language}" is missing.`,
        ),
      );
    }
  }

  const allKeys = new Set<string>();
  for (const dictionary of dictionaries.values()) {
    Object.keys(dictionary).forEach((key) => allKeys.add(key));
  }

  for (const language of SUPPORTED_LANGUAGES) {
    const dictionary = dictionaries.get(language);
    if (dictionary === undefined) continue;
    for (const key of [...allKeys].sort()) {
      const message = dictionary[key];
      if (message === undefined) {
        issues.push(
          issue(
            'MISSING_KEY',
            language,
            key,
            `Locale "${language}" is missing key "${key}".`,
          ),
        );
      } else if (message.trim().length === 0) {
        issues.push(
          issue(
            'INVALID_MESSAGE',
            language,
            key,
            `Locale "${language}" contains an empty message for "${key}".`,
          ),
        );
      }
    }
  }

  const reference = dictionaries.get('es');
  const english = dictionaries.get('en');
  if (reference !== undefined && english !== undefined) {
    for (const key of [...allKeys].sort()) {
      const spanishMessage = reference[key];
      const englishMessage = english[key];
      if (
        spanishMessage !== undefined &&
        englishMessage !== undefined &&
        !setsMatch(parametersIn(spanishMessage), parametersIn(englishMessage))
      ) {
        issues.push(
          issue(
            'PARAMETER_MISMATCH',
            'en',
            key,
            `Locale parameters for "${key}" do not match Spanish.`,
          ),
        );
      }
    }
  }

  const sorted = issues.sort(compareIssues);
  return { valid: sorted.length === 0, issues: sorted };
}

export class LocalizationStore {
  readonly #dictionaries: ReadonlyMap<Language, LocaleDictionary>;
  readonly #settings: SessionSettings;

  public constructor(
    bundles: readonly LocaleBundle[],
    settings: SessionSettings,
  ) {
    const validation = validateLocaleBundles(bundles);
    if (!validation.valid) throw new LocalizationError(validation.issues);
    this.#dictionaries = new Map(
      bundles.map((bundle) => [bundle.language, bundle.messages]),
    );
    this.#settings = settings;
  }

  public get language(): Language | null {
    return this.#settings.language;
  }

  public setLanguage(language: unknown): Language {
    return this.#settings.setLanguage(language);
  }

  public has(key: LocalizationKey, language?: Language): boolean {
    const resolvedLanguage = language ?? this.#settings.language;
    return (
      resolvedLanguage !== null &&
      this.#dictionaries.get(resolvedLanguage)?.[key] !== undefined
    );
  }

  public translate(
    key: LocalizationKey,
    parameters: LocalizationParameters = {},
  ): string {
    const language = this.#settings.requireLanguage();
    const message = this.#dictionaries.get(language)?.[key];
    if (message === undefined) {
      throw new LocalizationError([
        issue(
          'MISSING_KEY',
          language,
          key,
          `Locale "${language}" is missing key "${key}".`,
        ),
      ]);
    }

    const missingParameters = [...parametersIn(message)].filter(
      (name) => parameters[name] === undefined,
    );
    if (missingParameters.length > 0) {
      throw new LocalizationError([
        issue(
          'PARAMETER_MISMATCH',
          language,
          key,
          `Missing parameter(s): ${missingParameters.sort().join(', ')}.`,
        ),
      ]);
    }

    return message.replace(PARAMETER_PATTERN, (_placeholder, name: string) =>
      String(parameters[name]),
    );
  }
}
