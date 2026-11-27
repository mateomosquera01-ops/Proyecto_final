export function sanitizeInput(value: string): string {
  return value.replace(/<[^>]*>?/gm, '').trim();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
