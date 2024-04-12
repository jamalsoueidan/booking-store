export function modifyImageUrl(
  originalUrl?: string | null,
  sizeSuffix?: string,
): string {
  if (!originalUrl) return '';
  const parts = originalUrl.split('.');
  if (parts.length < 2) return originalUrl;

  const lastPartIndex = parts.length - 2;
  parts[lastPartIndex] += `_${sizeSuffix}`;

  return parts.join('.');
}
