export function parseCT(value: string) {
  return value.substring(10);
}

export function parseTE(value: string) {
  if (value.includes('treatments')) {
    return value.substring(12);
  }
  return value;
}
