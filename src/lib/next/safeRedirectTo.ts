export function safeRedirectTo(raw?: string | null): string | null {
  if (!raw) return null;

  const value = raw.trim();
  if (!value) return null;

  // Only allow same-origin relative paths.
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.startsWith("/\\")) return null;

  // Disallow control characters.
  if (/[\r\n\t]/.test(value)) return null;

  return value;
}

