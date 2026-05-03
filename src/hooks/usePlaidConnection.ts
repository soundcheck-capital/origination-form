import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePlaidLink, PlaidLinkOnSuccess, PlaidLinkOnExit } from 'react-plaid-link';
import { AppDispatch, RootState } from '../store';
import { updateBankInfo } from '../store/form/formSlice';

// Webhook that creates a Plaid link_token server-side. Plaid's API does not
// support CORS for browser callers, so the frontend cannot hit
// /link/token/create directly — it must go through a Make.com scenario that
// holds the Plaid client_id + secret and returns { link_token }.
const PLAID_LINK_TOKEN_URL = process.env.REACT_APP_PLAID_LINK_TOKEN_URL || '';
// Webhook that exchanges the public_token for the bank info (24a contract).
const PLAID_WEBHOOK_URL = process.env.REACT_APP_PLAID_WEBHOOK_URL || '';

const isTestMode = (): boolean =>
  typeof window !== 'undefined' && (window as any).__PLAID_TEST_MODE__ === true;

interface UsePlaidConnectionReturn {
  ready: boolean;
  open: () => void;
  connected: boolean;
  institutionName: string;
  accountMask: string;
  accountName: string;
  error: string | null;
  isLoading: boolean;
  reset: () => void;
}

export const usePlaidConnection = (): UsePlaidConnectionReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const bankInfo = useSelector((state: RootState) => state.form.formData.bankInfo);

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenRequested, setTokenRequested] = useState(false);

  const fetchLinkToken = useCallback(async () => {
    if (!PLAID_LINK_TOKEN_URL) {
      setError('Plaid link_token webhook URL is not configured.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(PLAID_LINK_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`link_token webhook failed: ${res.status} ${body}`);
      }
      const data = await res.json();
      if (!data.link_token) {
        throw new Error('link_token webhook response missing link_token field');
      }
      setLinkToken(data.link_token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize Plaid');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isTestMode()) return;
    if (!tokenRequested && !bankInfo.plaidConnected) {
      setTokenRequested(true);
      fetchLinkToken();
    }
  }, [tokenRequested, bankInfo.plaidConnected, fetchLinkToken]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token) => {
    if (!PLAID_WEBHOOK_URL) {
      setError('Plaid webhook URL is not configured.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(PLAID_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });
      if (!res.ok) {
        throw new Error(`Webhook returned ${res.status}`);
      }
      const data = await res.json();
      dispatch(updateBankInfo({
        plaidConnected: true,
        institutionName: data.institution || '',
        accountMask: data.account_mask || '',
        accountName: data.account_name || '',
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to exchange token');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const onExit = useCallback<PlaidLinkOnExit>((err) => {
    if (err) setError(err.display_message || err.error_message || 'Plaid Link exited with an error.');
  }, []);

  const { open: realOpen, ready: realReady } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  const open = useCallback(() => {
    if (isTestMode()) {
      // Bypass the Plaid Link iframe in E2E tests. Use the public_token
      // injected by the test (a real sandbox token created by Playwright via
      // Plaid's /sandbox/public_token/create endpoint) so the exchange hits
      // the live Make.com webhook and returns real bank info.
      const injectedToken = (window as any).__PLAID_TEST_PUBLIC_TOKEN__;
      const publicToken = typeof injectedToken === 'string' && injectedToken.length > 0
        ? injectedToken
        : `public-sandbox-test-${Date.now()}`;
      onSuccess(publicToken, {
        institution: { name: 'Test Bank', institution_id: 'ins_test' },
        accounts: [],
        link_session_id: 'test-session',
        transfer_status: undefined,
      } as any);
      return;
    }
    realOpen();
  }, [realOpen, onSuccess]);

  const ready = isTestMode() ? true : realReady;
  const effectiveError = isTestMode() ? null : error;

  const reset = useCallback(() => {
    dispatch(updateBankInfo({
      plaidConnected: false,
      institutionName: '',
      accountMask: '',
      accountName: '',
    }));
    setLinkToken(null);
    setTokenRequested(false);
  }, [dispatch]);

  return {
    ready,
    open,
    connected: bankInfo.plaidConnected,
    institutionName: bankInfo.institutionName,
    accountMask: bankInfo.accountMask,
    accountName: bankInfo.accountName,
    error: effectiveError,
    isLoading,
    reset,
  };
};
