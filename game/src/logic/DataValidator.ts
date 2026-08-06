import {
  ASSET_CATEGORIES,
  ATTACK_PATTERN_IDS,
  CHALLENGE_CATEGORIES,
  CHALLENGE_MODES,
  ENCOUNTER_ORDER,
  ENEMY_ARCHETYPE_IDS,
  FINAL_SEQUENCE_ACTOR_IDS,
  FINAL_SEQUENCE_STEP_TYPES,
  SUPPORTED_LANGUAGES,
  type AttackPatternId,
  type ChallengeCategory,
  type FinalSequenceStepType,
} from '../types';

export const DATA_VALIDATION_DOMAINS = [
  'bundle',
  'manifest',
  'locale',
  'challenge',
  'attack',
  'encounter',
  'final-sequence',
] as const;

export type DataValidationDomain =
  (typeof DATA_VALIDATION_DOMAINS)[number];

export const DATA_VALIDATION_CODES = [
  'INVALID_TYPE',
  'MISSING_FIELD',
  'INVALID_VALUE',
  'INVALID_COUNT',
  'INVALID_ORDER',
  'DUPLICATE_ID',
  'MISSING_REFERENCE',
  'MISSING_LOCALE_KEY',
  'MISSING_REQUIRED_ASSET',
  'UNREGISTERED_ATTACK',
  'INCOMPATIBLE_RULE',
  'MISSING_SEQUENCE_STEP',
] as const;

export type DataValidationCode =
  (typeof DATA_VALIDATION_CODES)[number];

export type BootValidationErrorCode =
  | 'BOOT_ASSET_LOAD_FAILED'
  | 'BOOT_MANIFEST_INVALID'
  | 'BOOT_DATA_INVALID'
  | 'BOOT_LOCALE_INVALID';

export interface GameDataValidationInput {
  readonly manifest: unknown;
  readonly locales: unknown;
  readonly challenges: unknown;
  readonly registeredAttackIds: unknown;
  readonly encounters: unknown;
  readonly finalSequence: unknown;
  readonly missingRequiredAssetKeys: unknown;
}

export interface DataValidationIssue {
  readonly domain: DataValidationDomain;
  readonly code: DataValidationCode;
  readonly bootCode: BootValidationErrorCode;
  readonly path: string;
  readonly message: string;
}

export interface DataValidationReport {
  readonly valid: boolean;
  readonly issues: readonly DataValidationIssue[];
}

export class DataValidationError extends Error {
  public override readonly name = 'DataValidationError';
  public readonly code = 'BOOT_DATA_INVALID';

  public constructor(public readonly issues: readonly DataValidationIssue[]) {
    super(`Invalid game data (${issues.length} issue${issues.length === 1 ? '' : 's'})`);
  }
}

type UnknownRecord = Record<string, unknown>;

interface ChallengeProjection {
  readonly id: string;
  readonly category: ChallengeCategory;
  readonly instructionKey: string;
}

interface ManifestProjection {
  readonly keys: ReadonlySet<string>;
  readonly requiredKeys: ReadonlySet<string>;
}

interface LocaleProjection {
  readonly keysByLanguage: ReadonlyMap<string, ReadonlySet<string>>;
}

const ASSET_TYPES = ['font', 'image', 'spritesheet', 'tilemap', 'json'] as const;

class IssueCollector {
  readonly #issues: DataValidationIssue[] = [];

  public add(
    domain: DataValidationDomain,
    code: DataValidationCode,
    path: string,
    message: string,
  ): void {
    this.#issues.push({
      domain,
      code,
      bootCode: resolveBootCode(domain, code),
      path,
      message,
    });
  }

  public finish(): readonly DataValidationIssue[] {
    return [...this.#issues].sort(
      (left, right) =>
        DATA_VALIDATION_DOMAINS.indexOf(left.domain) -
          DATA_VALIDATION_DOMAINS.indexOf(right.domain) ||
        compareText(left.path, right.path) ||
        compareText(left.code, right.code) ||
        compareText(left.message, right.message),
    );
  }
}

function compareText(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function resolveBootCode(
  domain: DataValidationDomain,
  code: DataValidationCode,
): BootValidationErrorCode {
  if (domain === 'locale') return 'BOOT_LOCALE_INVALID';
  if (domain === 'manifest') {
    return code === 'MISSING_REQUIRED_ASSET'
      ? 'BOOT_ASSET_LOAD_FAILED'
      : 'BOOT_MANIFEST_INVALID';
  }
  return 'BOOT_DATA_INVALID';
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return typeof value === 'string' && allowed.some((item) => item === value);
}

function readRequiredString(
  record: UnknownRecord,
  field: string,
  domain: DataValidationDomain,
  path: string,
  issues: IssueCollector,
): string | null {
  const value = record[field];
  const fieldPath = `${path}.${field}`;
  if (value === undefined) {
    issues.add(domain, 'MISSING_FIELD', fieldPath, 'Required field is missing.');
    return null;
  }
  if (typeof value !== 'string') {
    issues.add(domain, 'INVALID_TYPE', fieldPath, 'Expected a string.');
    return null;
  }
  if (value.trim().length === 0) {
    issues.add(domain, 'INVALID_VALUE', fieldPath, 'String must not be empty.');
    return null;
  }
  return value;
}

function readPositiveNumber(
  record: UnknownRecord,
  field: string,
  domain: DataValidationDomain,
  path: string,
  issues: IssueCollector,
): number | null {
  const value = record[field];
  const fieldPath = `${path}.${field}`;
  if (value === undefined) {
    issues.add(domain, 'MISSING_FIELD', fieldPath, 'Required field is missing.');
    return null;
  }
  if (typeof value !== 'number') {
    issues.add(domain, 'INVALID_TYPE', fieldPath, 'Expected a number.');
    return null;
  }
  if (!Number.isFinite(value) || value <= 0) {
    issues.add(
      domain,
      'INVALID_VALUE',
      fieldPath,
      'Expected a finite number greater than zero.',
    );
    return null;
  }
  return value;
}

function readFiniteNumber(
  record: UnknownRecord,
  field: string,
  domain: DataValidationDomain,
  path: string,
  issues: IssueCollector,
): number | null {
  const value = record[field];
  const fieldPath = `${path}.${field}`;
  if (value === undefined) {
    issues.add(domain, 'MISSING_FIELD', fieldPath, 'Required field is missing.');
    return null;
  }
  if (typeof value !== 'number') {
    issues.add(domain, 'INVALID_TYPE', fieldPath, 'Expected a number.');
    return null;
  }
  if (!Number.isFinite(value)) {
    issues.add(domain, 'INVALID_VALUE', fieldPath, 'Expected a finite number.');
    return null;
  }
  return value;
}

function readRequiredArray(
  record: UnknownRecord,
  field: string,
  domain: DataValidationDomain,
  path: string,
  issues: IssueCollector,
): readonly unknown[] | null {
  const value = record[field];
  const fieldPath = `${path}.${field}`;
  if (value === undefined) {
    issues.add(domain, 'MISSING_FIELD', fieldPath, 'Required field is missing.');
    return null;
  }
  if (!Array.isArray(value)) {
    issues.add(domain, 'INVALID_TYPE', fieldPath, 'Expected an array.');
    return null;
  }
  return value;
}

function validateUniqueStrings(
  values: readonly unknown[],
  domain: DataValidationDomain,
  path: string,
  issues: IssueCollector,
): readonly string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  values.forEach((value, index) => {
    const itemPath = `${path}[${index}]`;
    if (typeof value !== 'string' || value.trim().length === 0) {
      issues.add(domain, 'INVALID_TYPE', itemPath, 'Expected a non-empty string.');
      return;
    }
    if (seen.has(value)) {
      issues.add(domain, 'DUPLICATE_ID', itemPath, `Duplicate value "${value}".`);
      return;
    }
    seen.add(value);
    result.push(value);
  });
  return result;
}

function validateDimensions(
  value: unknown,
  domain: DataValidationDomain,
  path: string,
  issues: IssueCollector,
): void {
  if (!isRecord(value)) {
    issues.add(domain, 'INVALID_TYPE', path, 'Expected a dimensions object.');
    return;
  }
  const width = readPositiveNumber(value, 'width', domain, path, issues);
  const height = readPositiveNumber(value, 'height', domain, path, issues);
  if (width !== null && !Number.isInteger(width)) {
    issues.add(domain, 'INVALID_VALUE', `${path}.width`, 'Width must be an integer.');
  }
  if (height !== null && !Number.isInteger(height)) {
    issues.add(domain, 'INVALID_VALUE', `${path}.height`, 'Height must be an integer.');
  }
}

function validateRuntimeUrl(
  value: string,
  path: string,
  issues: IssueCollector,
): void {
  const normalized = value.replaceAll('\\', '/');
  const forbiddenSource = /(^|\/)(output|sprite-export|assets-source)(\/|$)/u;
  const externalOrAbsolute = /^(?:[a-z][a-z\d+.-]*:|\/|[a-z]:\/)/iu;
  if (
    externalOrAbsolute.test(normalized) ||
    normalized.includes('/../') ||
    normalized.startsWith('../') ||
    (!normalized.startsWith('./assets/') && !normalized.startsWith('assets/'))
  ) {
    issues.add(
      'manifest',
      'INVALID_VALUE',
      path,
      'Asset URL must be relative to the runtime assets directory.',
    );
  }
  if (forbiddenSource.test(normalized) || /(?:^|\/)_.*-source\./u.test(normalized)) {
    issues.add(
      'manifest',
      'INVALID_VALUE',
      path,
      'Asset URL points to a source or staging path.',
    );
  }
}

function validateManifest(value: unknown, issues: IssueCollector): ManifestProjection {
  const keys = new Set<string>();
  const requiredKeys = new Set<string>();
  if (!isRecord(value)) {
    issues.add('manifest', 'INVALID_TYPE', 'manifest', 'Expected a manifest object.');
    return { keys, requiredKeys };
  }
  readRequiredString(value, 'version', 'manifest', 'manifest', issues);
  const assets = readRequiredArray(value, 'assets', 'manifest', 'manifest', issues);
  if (assets === null) return { keys, requiredKeys };

  assets.forEach((assetValue, index) => {
    const path = `manifest.assets[${index}]`;
    if (!isRecord(assetValue)) {
      issues.add('manifest', 'INVALID_TYPE', path, 'Expected an asset object.');
      return;
    }
    const key = readRequiredString(assetValue, 'key', 'manifest', path, issues);
    const type = assetValue.type;
    const category = assetValue.category;
    const url = readRequiredString(assetValue, 'url', 'manifest', path, issues);
    const required = assetValue.required;

    if (key !== null) {
      if (keys.has(key)) {
        issues.add('manifest', 'DUPLICATE_ID', `${path}.key`, `Duplicate asset key "${key}".`);
      }
      keys.add(key);
      if (required === true) requiredKeys.add(key);
    }
    if (!isOneOf(type, ASSET_TYPES)) {
      issues.add('manifest', 'INVALID_VALUE', `${path}.type`, 'Unknown asset type.');
    }
    if (!isOneOf(category, ASSET_CATEGORIES)) {
      issues.add('manifest', 'INVALID_VALUE', `${path}.category`, 'Unknown asset category.');
    }
    if (url !== null) validateRuntimeUrl(url, `${path}.url`, issues);
    if (typeof required !== 'boolean') {
      issues.add('manifest', required === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${path}.required`, 'Expected a boolean.');
    }

    if (assetValue.expectedDimensions !== undefined) {
      validateDimensions(assetValue.expectedDimensions, 'manifest', `${path}.expectedDimensions`, issues);
    }
    if (type === 'font') {
      readRequiredString(assetValue, 'family', 'manifest', path, issues);
    }
    if (type === 'tilemap' && assetValue.format !== 'tiled-json') {
      issues.add('manifest', 'INVALID_VALUE', `${path}.format`, 'Tilemap format must be "tiled-json".');
    }
    if (type === 'spritesheet') {
      const frameConfig = assetValue.frameConfig;
      if (!isRecord(frameConfig)) {
        issues.add('manifest', frameConfig === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${path}.frameConfig`, 'Expected a frame configuration object.');
      } else {
        const frameWidth = readPositiveNumber(frameConfig, 'frameWidth', 'manifest', `${path}.frameConfig`, issues);
        const frameHeight = readPositiveNumber(frameConfig, 'frameHeight', 'manifest', `${path}.frameConfig`, issues);
        if (frameWidth !== null && !Number.isInteger(frameWidth)) {
          issues.add('manifest', 'INVALID_VALUE', `${path}.frameConfig.frameWidth`, 'Frame width must be an integer.');
        }
        if (frameHeight !== null && !Number.isInteger(frameHeight)) {
          issues.add('manifest', 'INVALID_VALUE', `${path}.frameConfig.frameHeight`, 'Frame height must be an integer.');
        }
      }
    }
  });
  return { keys, requiredKeys };
}

function validateLocales(value: unknown, issues: IssueCollector): LocaleProjection {
  const keysByLanguage = new Map<string, ReadonlySet<string>>();
  if (!isRecord(value)) {
    issues.add('locale', 'INVALID_TYPE', 'locales', 'Expected a locale map.');
    return { keysByLanguage };
  }

  Object.keys(value)
    .filter((language) => !SUPPORTED_LANGUAGES.some((supported) => supported === language))
    .sort()
    .forEach((language) =>
      issues.add('locale', 'INVALID_VALUE', `locales.${language}`, 'Unsupported locale.'),
    );

  for (const language of SUPPORTED_LANGUAGES) {
    const dictionary = value[language];
    const path = `locales.${language}`;
    const keys = new Set<string>();
    if (!isRecord(dictionary)) {
      issues.add('locale', dictionary === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', path, 'Expected a locale dictionary.');
      keysByLanguage.set(language, keys);
      continue;
    }
    for (const key of Object.keys(dictionary).sort()) {
      const message = dictionary[key];
      if (typeof message !== 'string' || message.trim().length === 0) {
        issues.add('locale', 'INVALID_TYPE', `${path}.${key}`, 'Expected a non-empty localized string.');
      } else {
        keys.add(key);
      }
    }
    keysByLanguage.set(language, keys);
  }

  const allKeys = new Set<string>();
  for (const keys of keysByLanguage.values()) {
    for (const key of keys) allKeys.add(key);
  }
  for (const key of [...allKeys].sort()) {
    for (const language of SUPPORTED_LANGUAGES) {
      if (!keysByLanguage.get(language)?.has(key)) {
        issues.add('locale', 'MISSING_LOCALE_KEY', `locales.${language}.${key}`, `Locale "${language}" is missing key "${key}".`);
      }
    }
  }
  return { keysByLanguage };
}

function requireLocaleKey(
  key: string,
  sourcePath: string,
  locales: LocaleProjection,
  issues: IssueCollector,
): void {
  for (const language of SUPPORTED_LANGUAGES) {
    if (!locales.keysByLanguage.get(language)?.has(key)) {
      issues.add('locale', 'MISSING_LOCALE_KEY', `${sourcePath} -> locales.${language}.${key}`, `Referenced localization key "${key}" is missing for "${language}".`);
    }
  }
}

function validateChallenges(
  value: unknown,
  locales: LocaleProjection,
  issues: IssueCollector,
): readonly ChallengeProjection[] {
  if (!Array.isArray(value)) {
    issues.add('challenge', 'INVALID_TYPE', 'challenges', 'Expected a Challenge array.');
    return [];
  }
  if (value.length !== 12) {
    issues.add('challenge', 'INVALID_COUNT', 'challenges', 'Exactly 12 Challenges are required.');
  }

  const projections: ChallengeProjection[] = [];
  const ids = new Set<string>();
  const categoryCounts = new Map<ChallengeCategory, number>(
    CHALLENGE_CATEGORIES.map((category) => [category, 0]),
  );
  const modes = new Set<string>();

  value.forEach((challengeValue, index) => {
    const path = `challenges[${index}]`;
    if (!isRecord(challengeValue)) {
      issues.add('challenge', 'INVALID_TYPE', path, 'Expected a Challenge object.');
      return;
    }
    const id = readRequiredString(challengeValue, 'id', 'challenge', path, issues);
    const categoryValue = challengeValue.category;
    const modeValue = challengeValue.mode;
    const code = readRequiredString(challengeValue, 'code', 'challenge', path, issues);
    const instructionKey = readRequiredString(
      challengeValue,
      'instructionKey',
      'challenge',
      path,
      issues,
    );
    readPositiveNumber(challengeValue, 'damage', 'challenge', path, issues);
    readPositiveNumber(challengeValue, 'timeLimitMs', 'challenge', path, issues);

    if (id !== null) {
      if (ids.has(id)) {
        issues.add('challenge', 'DUPLICATE_ID', `${path}.id`, `Duplicate Challenge id "${id}".`);
      }
      ids.add(id);
    }
    if (!isOneOf(categoryValue, CHALLENGE_CATEGORIES)) {
      issues.add('challenge', 'INVALID_VALUE', `${path}.category`, 'Unknown Challenge category.');
    } else {
      categoryCounts.set(categoryValue, (categoryCounts.get(categoryValue) ?? 0) + 1);
    }
    if (!isOneOf(modeValue, CHALLENGE_MODES)) {
      issues.add('challenge', 'INVALID_VALUE', `${path}.mode`, 'Unknown Challenge mode.');
    } else {
      modes.add(modeValue);
    }
    if (instructionKey !== null) {
      requireLocaleKey(instructionKey, `${path}.instructionKey`, locales, issues);
    }

    if (modeValue === 'typed') {
      const answers = readRequiredArray(
        challengeValue,
        'acceptedAnswers',
        'challenge',
        path,
        issues,
      );
      if (answers !== null) {
        if (answers.length === 0) {
          issues.add('challenge', 'INVALID_COUNT', `${path}.acceptedAnswers`, 'At least one accepted answer is required.');
        }
        answers.forEach((answer, answerIndex) => {
          const answerPath = `${path}.acceptedAnswers[${answerIndex}]`;
          if (typeof answer !== 'string' || answer.length === 0) {
            issues.add('challenge', 'INVALID_TYPE', answerPath, 'Expected a non-empty answer string.');
          } else if (answer.length > 12) {
            issues.add('challenge', 'INVALID_VALUE', answerPath, 'Typed answers must fit the 12-character input limit.');
          }
        });
      }
      if (
        challengeValue.caseSensitive !== undefined &&
        typeof challengeValue.caseSensitive !== 'boolean'
      ) {
        issues.add('challenge', 'INVALID_TYPE', `${path}.caseSensitive`, 'Expected a boolean.');
      }
    }

    if (modeValue === 'multiple-choice') {
      const options = readRequiredArray(
        challengeValue,
        'options',
        'challenge',
        path,
        issues,
      );
      if (options !== null) {
        if (options.length < 3 || options.length > 4) {
          issues.add('challenge', 'INVALID_COUNT', `${path}.options`, 'Multiple-choice Challenges require three or four options.');
        }
        options.forEach((option, optionIndex) => {
          if (typeof option !== 'string' || option.trim().length === 0) {
            issues.add('challenge', 'INVALID_TYPE', `${path}.options[${optionIndex}]`, 'Expected a non-empty option string.');
          }
        });
      }
      const correctIndex = challengeValue.correctIndex;
      if (typeof correctIndex !== 'number' || !Number.isInteger(correctIndex)) {
        issues.add('challenge', correctIndex === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${path}.correctIndex`, 'Expected an integer option index.');
      } else if (options !== null && (correctIndex < 0 || correctIndex >= options.length)) {
        issues.add('challenge', 'INVALID_VALUE', `${path}.correctIndex`, 'Correct option index is outside the options array.');
      }
    }

    if (
      id !== null &&
      isOneOf(categoryValue, CHALLENGE_CATEGORIES) &&
      instructionKey !== null &&
      code !== null
    ) {
      projections.push({ id, category: categoryValue, instructionKey });
    }
  });

  for (const category of CHALLENGE_CATEGORIES) {
    if (categoryCounts.get(category) !== 3) {
      issues.add('challenge', 'INVALID_COUNT', `challenges.category.${category}`, `Category "${category}" must contain exactly three Challenges.`);
    }
  }
  for (const mode of CHALLENGE_MODES) {
    if (!modes.has(mode)) {
      issues.add('challenge', 'INVALID_COUNT', `challenges.mode.${mode}`, `At least one "${mode}" Challenge is required.`);
    }
  }
  return projections;
}

function validateRegisteredAttacks(
  value: unknown,
  issues: IssueCollector,
): ReadonlySet<AttackPatternId> {
  const registered = new Set<AttackPatternId>();
  if (!Array.isArray(value)) {
    issues.add('attack', 'INVALID_TYPE', 'registeredAttackIds', 'Expected an attack id array.');
    return registered;
  }
  const seen = new Set<string>();
  value.forEach((attackId, index) => {
    const path = `registeredAttackIds[${index}]`;
    if (!isOneOf(attackId, ATTACK_PATTERN_IDS)) {
      issues.add('attack', 'INVALID_VALUE', path, 'Unknown attack pattern id.');
      return;
    }
    if (seen.has(attackId)) {
      issues.add('attack', 'DUPLICATE_ID', path, `Duplicate attack id "${attackId}".`);
      return;
    }
    seen.add(attackId);
    registered.add(attackId);
  });
  for (const attackId of ATTACK_PATTERN_IDS) {
    if (!registered.has(attackId)) {
      issues.add('attack', 'MISSING_REFERENCE', `registeredAttackIds.${attackId}`, `Approved attack "${attackId}" is not registered.`);
    }
  }
  return registered;
}

function validateJsonNumbers(
  value: unknown,
  path: string,
  issues: IssueCollector,
): void {
  if (typeof value === 'number' && !Number.isFinite(value)) {
    issues.add('encounter', 'INVALID_VALUE', path, 'Numeric attack parameters must be finite.');
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateJsonNumbers(item, `${path}[${index}]`, issues));
    return;
  }
  if (isRecord(value)) {
    Object.keys(value)
      .sort()
      .forEach((key) => validateJsonNumbers(value[key], `${path}.${key}`, issues));
  }
}

function setsMatch(left: ReadonlySet<string>, right: ReadonlySet<string>): boolean {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

const EXPECTED_CATEGORIES: Readonly<Record<(typeof ENCOUNTER_ORDER)[number], ChallengeCategory>> = {
  'parse-mantis': 'syntax',
  'mutable-widow': 'variable',
  'cast-hornet': 'type',
  'boolean-beetle': 'logic',
};

const EXPECTED_COMPOSITION: Readonly<
  Record<(typeof ENCOUNTER_ORDER)[number], { readonly archetypeId: (typeof ENEMY_ARCHETYPE_IDS)[number]; readonly count: number }>
> = {
  'parse-mantis': { archetypeId: 'parse-mantis', count: 1 },
  'mutable-widow': { archetypeId: 'mutable-widow', count: 2 },
  'cast-hornet': { archetypeId: 'cast-hornet', count: 3 },
  'boolean-beetle': { archetypeId: 'boolean-beetle', count: 1 },
};

function validateEncounters(
  value: unknown,
  challenges: readonly ChallengeProjection[],
  manifest: ManifestProjection,
  locales: LocaleProjection,
  registeredAttacks: ReadonlySet<AttackPatternId>,
  issues: IssueCollector,
): void {
  if (!Array.isArray(value)) {
    issues.add('encounter', 'INVALID_TYPE', 'encounters', 'Expected an Encounter array.');
    return;
  }
  if (value.length !== ENCOUNTER_ORDER.length) {
    issues.add('encounter', 'INVALID_COUNT', 'encounters', 'Exactly four Encounters are required.');
  }
  const challengeById = new Map(challenges.map((challenge) => [challenge.id, challenge]));
  const encounterIds = new Set<string>();

  value.forEach((encounterValue, index) => {
    const path = `encounters[${index}]`;
    if (!isRecord(encounterValue)) {
      issues.add('encounter', 'INVALID_TYPE', path, 'Expected an Encounter object.');
      return;
    }
    const expectedId = ENCOUNTER_ORDER[index];
    const id = readRequiredString(encounterValue, 'id', 'encounter', path, issues);
    const mapKey = readRequiredString(encounterValue, 'mapKey', 'encounter', path, issues);
    const categoryValue = encounterValue.category;
    const transitionTextKey = readRequiredString(encounterValue, 'transitionTextKey', 'encounter', path, issues);
    readPositiveNumber(encounterValue, 'challengeIntervalMs', 'encounter', path, issues);
    readPositiveNumber(encounterValue, 'defaultTimeLimitMs', 'encounter', path, issues);

    if (id !== null) {
      if (encounterIds.has(id)) {
        issues.add('encounter', 'DUPLICATE_ID', `${path}.id`, `Duplicate Encounter id "${id}".`);
      }
      encounterIds.add(id);
      if (expectedId !== undefined && id !== expectedId) {
        issues.add('encounter', 'INVALID_ORDER', `${path}.id`, `Expected Encounter "${expectedId}" at index ${index}.`);
      }
    }
    if (!isOneOf(categoryValue, CHALLENGE_CATEGORIES)) {
      issues.add('encounter', 'INVALID_VALUE', `${path}.category`, 'Unknown Encounter category.');
    } else if (expectedId !== undefined && categoryValue !== EXPECTED_CATEGORIES[expectedId]) {
      issues.add('encounter', 'INVALID_VALUE', `${path}.category`, `Encounter "${expectedId}" must use category "${EXPECTED_CATEGORIES[expectedId]}".`);
    }
    if (mapKey !== null && !manifest.keys.has(mapKey)) {
      issues.add('encounter', 'MISSING_REFERENCE', `${path}.mapKey`, `Unknown map asset key "${mapKey}".`);
    }
    if (transitionTextKey !== null) {
      requireLocaleKey(transitionTextKey, `${path}.transitionTextKey`, locales, issues);
    }

    const spawns = readRequiredArray(encounterValue, 'enemySpawns', 'encounter', path, issues);
    const spawnIds = new Set<string>();
    const archetypeCounts = new Map<string, number>();
    if (spawns !== null) {
      spawns.forEach((spawnValue, spawnIndex) => {
        const spawnPath = `${path}.enemySpawns[${spawnIndex}]`;
        if (!isRecord(spawnValue)) {
          issues.add('encounter', 'INVALID_TYPE', spawnPath, 'Expected an Enemy spawn object.');
          return;
        }
        const spawnId = readRequiredString(spawnValue, 'id', 'encounter', spawnPath, issues);
        const archetypeId = spawnValue.archetypeId;
        readPositiveNumber(spawnValue, 'maxHp', 'encounter', spawnPath, issues);
        if (spawnId !== null) {
          if (spawnIds.has(spawnId)) {
            issues.add('encounter', 'DUPLICATE_ID', `${spawnPath}.id`, `Duplicate Enemy spawn id "${spawnId}".`);
          }
          spawnIds.add(spawnId);
        }
        if (!isOneOf(archetypeId, ENEMY_ARCHETYPE_IDS)) {
          issues.add('encounter', 'INVALID_VALUE', `${spawnPath}.archetypeId`, 'Unknown Enemy archetype.');
        } else {
          archetypeCounts.set(archetypeId, (archetypeCounts.get(archetypeId) ?? 0) + 1);
        }
        const position = spawnValue.position;
        if (!isRecord(position)) {
          issues.add('encounter', position === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${spawnPath}.position`, 'Expected a position object.');
        } else {
          readFiniteNumber(position, 'x', 'encounter', `${spawnPath}.position`, issues);
          readFiniteNumber(position, 'y', 'encounter', `${spawnPath}.position`, issues);
        }
        const attackIds = readRequiredArray(spawnValue, 'attackIds', 'encounter', spawnPath, issues);
        const validAttackIds: AttackPatternId[] = [];
        if (attackIds !== null) {
          if (attackIds.length === 0) {
            issues.add('encounter', 'INVALID_COUNT', `${spawnPath}.attackIds`, 'At least one attack is required.');
          }
          const uniqueAttackIds = validateUniqueStrings(attackIds, 'encounter', `${spawnPath}.attackIds`, issues);
          uniqueAttackIds.forEach((attackId, attackIndex) => {
            if (!isOneOf(attackId, ATTACK_PATTERN_IDS)) {
              issues.add('encounter', 'INVALID_VALUE', `${spawnPath}.attackIds[${attackIndex}]`, `Unknown attack "${attackId}".`);
            } else {
              validAttackIds.push(attackId);
              if (!registeredAttacks.has(attackId)) {
                issues.add('encounter', 'UNREGISTERED_ATTACK', `${spawnPath}.attackIds[${attackIndex}]`, `Attack "${attackId}" is not registered.`);
              }
            }
          });
        }
        const attackParams = spawnValue.attackParams;
        if (!isRecord(attackParams)) {
          issues.add('encounter', attackParams === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${spawnPath}.attackParams`, 'Expected an attack parameter map.');
        } else {
          for (const attackId of validAttackIds) {
            const params = attackParams[attackId];
            const paramsPath = `${spawnPath}.attackParams.${attackId}`;
            if (!isRecord(params)) {
              issues.add('encounter', params === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', paramsPath, 'Expected parameters for every configured attack.');
            } else {
              readPositiveNumber(params, 'damage', 'encounter', paramsPath, issues);
              validateJsonNumbers(params, paramsPath, issues);
            }
          }
          for (const configuredId of Object.keys(attackParams).sort()) {
            if (!validAttackIds.some((attackId) => attackId === configuredId)) {
              issues.add('encounter', 'MISSING_REFERENCE', `${spawnPath}.attackParams.${configuredId}`, `Parameters reference unconfigured attack "${configuredId}".`);
            }
          }
        }
      });
    }

    if (expectedId !== undefined) {
      const expectedComposition = EXPECTED_COMPOSITION[expectedId];
      if (
        spawns !== null &&
        (spawns.length !== expectedComposition.count ||
          archetypeCounts.get(expectedComposition.archetypeId) !== expectedComposition.count ||
          [...archetypeCounts.keys()].some((archetype) => archetype !== expectedComposition.archetypeId))
      ) {
        issues.add('encounter', 'INVALID_COUNT', `${path}.enemySpawns`, `Encounter "${expectedId}" requires exactly ${expectedComposition.count} "${expectedComposition.archetypeId}" Enemy spawn(s).`);
      }
    }

    const challengePool = readRequiredArray(encounterValue, 'challengePool', 'encounter', path, issues);
    if (challengePool !== null) {
      if (challengePool.length !== 3) {
        issues.add('encounter', 'INVALID_COUNT', `${path}.challengePool`, 'Each Encounter requires exactly three Challenges.');
      }
      const challengeIds = validateUniqueStrings(challengePool, 'encounter', `${path}.challengePool`, issues);
      challengeIds.forEach((challengeId, challengeIndex) => {
        const challenge = challengeById.get(challengeId);
        if (challenge === undefined) {
          issues.add('encounter', 'MISSING_REFERENCE', `${path}.challengePool[${challengeIndex}]`, `Unknown Challenge id "${challengeId}".`);
        } else if (isOneOf(categoryValue, CHALLENGE_CATEGORIES) && challenge.category !== categoryValue) {
          issues.add('encounter', 'INVALID_VALUE', `${path}.challengePool[${challengeIndex}]`, `Challenge "${challengeId}" does not belong to category "${categoryValue}".`);
        }
      });
    }

    const penalty = encounterValue.penalty;
    if (!isRecord(penalty)) {
      issues.add('encounter', penalty === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${path}.penalty`, 'Expected a penalty object.');
    } else {
      if (penalty.type !== 'extraProjectiles') {
        issues.add('encounter', 'INVALID_VALUE', `${path}.penalty.type`, 'Only extraProjectiles is supported.');
      }
      readPositiveNumber(penalty, 'multiplier', 'encounter', `${path}.penalty`, issues);
      readPositiveNumber(penalty, 'durationMs', 'encounter', `${path}.penalty`, issues);
    }

    const targetMode = encounterValue.damageTargetMode;
    if (!isOneOf(targetMode, ['roundRobin', 'allActive', 'sharedPool'] as const)) {
      issues.add('encounter', 'INVALID_VALUE', `${path}.damageTargetMode`, 'Unknown damage target mode.');
    }
    const completionRule = encounterValue.completionRule;
    if (!isRecord(completionRule)) {
      issues.add('encounter', completionRule === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${path}.completionRule`, 'Expected a completion rule object.');
    } else {
      const ruleType = completionRule.type;
      const idField = ruleType === 'sharedPoolDepleted' ? 'memberEnemyIds' : 'requiredEnemyIds';
      const memberIdsValue = completionRule[idField];
      const memberIds = Array.isArray(memberIdsValue)
        ? validateUniqueStrings(memberIdsValue, 'encounter', `${path}.completionRule.${idField}`, issues)
        : [];
      if (!Array.isArray(memberIdsValue)) {
        issues.add('encounter', memberIdsValue === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE', `${path}.completionRule.${idField}`, 'Expected an Enemy id array.');
      }
      const memberSet = new Set(memberIds);
      memberIds.forEach((memberId, memberIndex) => {
        if (!spawnIds.has(memberId)) {
          issues.add('encounter', 'MISSING_REFERENCE', `${path}.completionRule.${idField}[${memberIndex}]`, `Unknown Enemy spawn id "${memberId}".`);
        }
      });
      if (spawns !== null && !setsMatch(memberSet, spawnIds)) {
        issues.add('encounter', 'INCOMPATIBLE_RULE', `${path}.completionRule.${idField}`, 'Completion rule must include every Enemy spawn exactly once.');
      }
      if (ruleType === 'allRequiredEnemiesDefeated') {
        if (targetMode === 'sharedPool') {
          issues.add('encounter', 'INCOMPATIBLE_RULE', `${path}.completionRule.type`, 'sharedPool targeting requires sharedPoolDepleted completion.');
        }
      } else if (ruleType === 'sharedPoolDepleted') {
        readPositiveNumber(completionRule, 'sharedMaxHp', 'encounter', `${path}.completionRule`, issues);
        if (targetMode !== 'sharedPool') {
          issues.add('encounter', 'INCOMPATIBLE_RULE', `${path}.completionRule.type`, 'sharedPoolDepleted completion requires sharedPool targeting.');
        }
      } else {
        issues.add('encounter', 'INVALID_VALUE', `${path}.completionRule.type`, 'Unknown completion rule type.');
      }
    }

    if (encounterValue.tutorial !== undefined) {
      const tutorial = encounterValue.tutorial;
      if (!isRecord(tutorial)) {
        issues.add('encounter', 'INVALID_TYPE', `${path}.tutorial`, 'Expected a tutorial object.');
      } else {
        const stepKeys = readRequiredArray(tutorial, 'stepKeys', 'encounter', `${path}.tutorial`, issues);
        if (stepKeys !== null) {
          if (stepKeys.length === 0) {
            issues.add('encounter', 'INVALID_COUNT', `${path}.tutorial.stepKeys`, 'Tutorial requires at least one step.');
          }
          validateUniqueStrings(stepKeys, 'encounter', `${path}.tutorial.stepKeys`, issues).forEach((key, stepIndex) =>
            requireLocaleKey(key, `${path}.tutorial.stepKeys[${stepIndex}]`, locales, issues),
          );
        }
      }
    }
  });
}

function validateMissingRequiredAssets(
  value: unknown,
  manifest: ManifestProjection,
  issues: IssueCollector,
): void {
  if (!Array.isArray(value)) {
    issues.add(
      'manifest',
      value === undefined ? 'MISSING_FIELD' : 'INVALID_TYPE',
      'missingRequiredAssetKeys',
      'Expected the required-asset load result as an array.',
    );
    return;
  }
  validateUniqueStrings(value, 'manifest', 'missingRequiredAssetKeys', issues).forEach(
    (key, index) => {
      if (!manifest.keys.has(key)) {
        issues.add(
          'manifest',
          'MISSING_REFERENCE',
          `missingRequiredAssetKeys[${index}]`,
          `Unknown asset key "${key}".`,
        );
      } else if (!manifest.requiredKeys.has(key)) {
        issues.add(
          'manifest',
          'INVALID_VALUE',
          `missingRequiredAssetKeys[${index}]`,
          `Asset "${key}" is not marked as required.`,
        );
      } else {
        issues.add(
          'manifest',
          'MISSING_REQUIRED_ASSET',
          `missingRequiredAssetKeys[${index}]`,
          `Required asset "${key}" did not load.`,
        );
      }
    },
  );
}

function validateFinalSequence(
  value: unknown,
  manifest: ManifestProjection,
  locales: LocaleProjection,
  issues: IssueCollector,
): void {
  if (!isRecord(value)) {
    issues.add(
      'final-sequence',
      'INVALID_TYPE',
      'finalSequence',
      'Expected a FinalSequence object.',
    );
    return;
  }
  if (value.terminalState !== 'DemoEnd') {
    issues.add(
      'final-sequence',
      value.terminalState === undefined ? 'MISSING_FIELD' : 'INVALID_VALUE',
      'finalSequence.terminalState',
      'FinalSequence must terminate in DemoEnd.',
    );
  }
  const steps = readRequiredArray(
    value,
    'steps',
    'final-sequence',
    'finalSequence',
    issues,
  );
  if (steps === null) return;
  if (steps.length === 0) {
    issues.add(
      'final-sequence',
      'INVALID_COUNT',
      'finalSequence.steps',
      'FinalSequence requires at least one step.',
    );
  }

  const stepIds = new Set<string>();
  const firstIndexByType = new Map<FinalSequenceStepType, number>();
  steps.forEach((stepValue, index) => {
    const path = `finalSequence.steps[${index}]`;
    if (!isRecord(stepValue)) {
      issues.add('final-sequence', 'INVALID_TYPE', path, 'Expected a FinalSequence step object.');
      return;
    }
    const id = readRequiredString(stepValue, 'id', 'final-sequence', path, issues);
    const type = stepValue.type;
    if (id !== null) {
      if (stepIds.has(id)) {
        issues.add(
          'final-sequence',
          'DUPLICATE_ID',
          `${path}.id`,
          `Duplicate FinalSequence step id "${id}".`,
        );
      }
      stepIds.add(id);
    }
    if (!isOneOf(type, FINAL_SEQUENCE_STEP_TYPES)) {
      issues.add(
        'final-sequence',
        'INVALID_VALUE',
        `${path}.type`,
        'Unknown FinalSequence step type.',
      );
    } else if (!firstIndexByType.has(type)) {
      firstIndexByType.set(type, index);
    }
    const actorIds = readRequiredArray(
      stepValue,
      'actorIds',
      'final-sequence',
      path,
      issues,
    );
    if (actorIds !== null) {
      validateUniqueStrings(
        actorIds,
        'final-sequence',
        `${path}.actorIds`,
        issues,
      ).forEach((actorId, actorIndex) => {
        if (!isOneOf(actorId, FINAL_SEQUENCE_ACTOR_IDS)) {
          issues.add(
            'final-sequence',
            'INVALID_VALUE',
            `${path}.actorIds[${actorIndex}]`,
            `Unknown narrative actor "${actorId}".`,
          );
        }
      });
    }
    if (stepValue.effectKey !== undefined) {
      if (typeof stepValue.effectKey !== 'string' || stepValue.effectKey.length === 0) {
        issues.add(
          'final-sequence',
          'INVALID_TYPE',
          `${path}.effectKey`,
          'Expected a non-empty asset key.',
        );
      } else if (!manifest.keys.has(stepValue.effectKey)) {
        issues.add(
          'final-sequence',
          'MISSING_REFERENCE',
          `${path}.effectKey`,
          `Unknown effect asset key "${stepValue.effectKey}".`,
        );
      }
    }
    if (stepValue.dialogueKey !== undefined) {
      if (
        typeof stepValue.dialogueKey !== 'string' ||
        stepValue.dialogueKey.length === 0
      ) {
        issues.add(
          'final-sequence',
          'INVALID_TYPE',
          `${path}.dialogueKey`,
          'Expected a non-empty localization key.',
        );
      } else {
        requireLocaleKey(
          stepValue.dialogueKey,
          `${path}.dialogueKey`,
          locales,
          issues,
        );
      }
    }
    if (stepValue.durationMs !== undefined) {
      if (
        typeof stepValue.durationMs !== 'number' ||
        !Number.isFinite(stepValue.durationMs) ||
        stepValue.durationMs <= 0
      ) {
        issues.add(
          'final-sequence',
          'INVALID_VALUE',
          `${path}.durationMs`,
          'Duration must be a finite number greater than zero.',
        );
      }
    }
    if (
      stepValue.completionSignal !== undefined &&
      (typeof stepValue.completionSignal !== 'string' ||
        stepValue.completionSignal.length === 0)
    ) {
      issues.add(
        'final-sequence',
        'INVALID_TYPE',
        `${path}.completionSignal`,
        'Expected a non-empty completion signal.',
      );
    }
  });

  let previousIndex = -1;
  for (const requiredType of FINAL_SEQUENCE_STEP_TYPES) {
    const stepIndex = firstIndexByType.get(requiredType);
    if (stepIndex === undefined) {
      issues.add(
        'final-sequence',
        'MISSING_SEQUENCE_STEP',
        `finalSequence.steps.${requiredType}`,
        `Required FinalSequence step "${requiredType}" is missing.`,
      );
    } else {
      if (stepIndex < previousIndex) {
        issues.add(
          'final-sequence',
          'INVALID_ORDER',
          `finalSequence.steps[${stepIndex}].type`,
          `Step "${requiredType}" appears outside the required narrative order.`,
        );
      }
      previousIndex = Math.max(previousIndex, stepIndex);
    }
  }
  const finalStep = steps.at(-1);
  if (!isRecord(finalStep) || finalStep.type !== 'demoEndTransition') {
    issues.add(
      'final-sequence',
      'INVALID_ORDER',
      'finalSequence.steps',
      'The last FinalSequence step must transition to DemoEnd.',
    );
  }
}

export class DataValidator {
  public validate(input: unknown): DataValidationReport {
    const issues = new IssueCollector();
    const root: UnknownRecord = isRecord(input) ? input : {};
    if (!isRecord(input)) {
      issues.add('bundle', 'INVALID_TYPE', '$', 'Expected a game data bundle object.');
    }

    const manifest = validateManifest(root.manifest, issues);
    const locales = validateLocales(root.locales, issues);
    const challenges = validateChallenges(root.challenges, locales, issues);
    const registeredAttacks = validateRegisteredAttacks(
      root.registeredAttackIds,
      issues,
    );
    validateEncounters(
      root.encounters,
      challenges,
      manifest,
      locales,
      registeredAttacks,
      issues,
    );
    validateFinalSequence(root.finalSequence, manifest, locales, issues);
    validateMissingRequiredAssets(
      root.missingRequiredAssetKeys,
      manifest,
      issues,
    );

    const result = issues.finish();
    return { valid: result.length === 0, issues: result };
  }

  public validateOrThrow(input: unknown): DataValidationReport {
    const report = this.validate(input);
    if (!report.valid) throw new DataValidationError(report.issues);
    return report;
  }
}

export const dataValidator = new DataValidator();
