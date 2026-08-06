export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

export type JsonObject = {
  readonly [key: string]: JsonValue;
};

export interface Dimensions {
  readonly width: number;
  readonly height: number;
}

export interface Vector2Data {
  readonly x: number;
  readonly y: number;
}
