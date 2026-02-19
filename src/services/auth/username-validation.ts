export function isValidUsernameFormat(username: string): boolean {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

