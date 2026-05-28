/** Client link password session (links with ?companyName=...) */
const AUTH_FLAG_KEY = 'formAuthenticated';
const AUTH_EXPIRES_AT_KEY = 'formAuthenticatedExpiresAt';

/** 30 days — long enough for a multi-step application without re-prompting mid-flow */
export const CLIENT_FORM_AUTH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function setClientFormAuth(): void {
  try {
    localStorage.setItem(AUTH_FLAG_KEY, 'true');
    localStorage.setItem(
      AUTH_EXPIRES_AT_KEY,
      String(Date.now() + CLIENT_FORM_AUTH_TTL_MS)
    );
  } catch {
    // private browsing / quota
  }
}

export function clearClientFormAuth(): void {
  try {
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
  } catch {
    // ignore
  }
}

export function isClientFormAuthenticated(): boolean {
  try {
    if (localStorage.getItem(AUTH_FLAG_KEY) !== 'true') {
      return false;
    }

    const expiresAtRaw = localStorage.getItem(AUTH_EXPIRES_AT_KEY);
    if (!expiresAtRaw) {
      // Legacy sessions created before expiry — extend once
      setClientFormAuth();
      return true;
    }

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      clearClientFormAuth();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
