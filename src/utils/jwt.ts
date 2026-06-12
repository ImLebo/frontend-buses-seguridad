export interface JwtPayload {
  id?: string;
  [key: string]: unknown;
}

const decodeBase64Url = (input: string): string => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = padding === 0 ? normalized : normalized + '='.repeat(4 - padding);

  return atob(padded);
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) {
      return null;
    }

    const payloadJson = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadJson) as JwtPayload;
    return typeof payload.id === 'string' && payload.id.trim().length > 0 ? payload.id : null;
  } catch {
    return null;
  }
};
