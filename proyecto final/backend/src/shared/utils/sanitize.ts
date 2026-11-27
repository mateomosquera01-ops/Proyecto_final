/**
 * Sanitiza cadenas de texto eliminando etiquetas HTML peligrosas y espacios sobrantes.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();
}

export function sanitizePayload<T>(input: T): T {
  if (typeof input === 'string') {
    return sanitizeText(input) as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => sanitizePayload(item)) as unknown as T;
  }
  if (input && typeof input === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(input as Record<string, unknown>)) {
      cleaned[key] = sanitizePayload(val);
    }
    return cleaned as T;
  }
  return input;
}
