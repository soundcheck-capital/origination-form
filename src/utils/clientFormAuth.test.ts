import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  clearClientFormAuth,
  CLIENT_FORM_AUTH_TTL_MS,
  isClientFormAuthenticated,
  setClientFormAuth,
} from './clientFormAuth';

describe('clientFormAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  it('returns false when not authenticated', () => {
    expect(isClientFormAuthenticated()).toBe(false);
  });

  it('returns true after setClientFormAuth', () => {
    setClientFormAuth();
    expect(isClientFormAuthenticated()).toBe(true);
  });

  it('expires after TTL', () => {
    setClientFormAuth();
    jest.advanceTimersByTime(CLIENT_FORM_AUTH_TTL_MS + 1);
    expect(isClientFormAuthenticated()).toBe(false);
  });

  it('migrates legacy flag without expiry', () => {
    localStorage.setItem('formAuthenticated', 'true');
    expect(isClientFormAuthenticated()).toBe(true);
    expect(localStorage.getItem('formAuthenticatedExpiresAt')).toBeTruthy();
  });

  it('clearClientFormAuth removes session', () => {
    setClientFormAuth();
    clearClientFormAuth();
    expect(isClientFormAuthenticated()).toBe(false);
  });
});
