export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isArray(value: unknown): value is string[] {
  return Array.isArray(value);
}

export function isBooleanOrBooleanString(value: string | boolean): value is "true" | "false" | boolean {
  if (typeof value == "string") {
    return value === "true" || value === "false";
  }
  return value;
}

export function parseBooleanOrBooleanString(boolOrBoolString: "true" | "false" | boolean): boolean {
  if (typeof boolOrBoolString === "string") {
    return boolOrBoolString === "true";
  }
  return boolOrBoolString;
}
