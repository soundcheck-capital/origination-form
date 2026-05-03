import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePlaidLink, PlaidLinkOnSuccess, PlaidLinkOnExit } from 'react-plaid-link';
import { AppDispatch, RootState } from '../store';
import { updateBankInfo } from '../store/form/formSlice';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';
const PLAID_CLIENT_ID = process.env.REACT_APP_PLAID_CLIENT_ID || '';
// TODO production: move link_token creation server-side. The secret should not
// live in the frontend bundle. Acceptable for sandbox prototype only.
const PLAID_SECRET = process.env.REACT_APP_PLAID_SECRET || '';
const PLAID_WEBHOOK_URL = process.env.REACT_APP_PLAID_WEBHOOK_URL || '';

const PLAID_API_BASE: Record<string, string> = {
  sandbox: 'https://sandbox.plaid.com',
  development: 'https://development.plaid.com',
  production: 'https://production.plaid.com',
};

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
    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      setError('Plaid credentials are not configured.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const apiBase = PLAID_API_BASE[PLAID_ENV] || PLAID_API_BASE.sandbox;
      const res = await fetch(`${apiBase}/link/token/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: PLAID_CLIENT_ID,
          secret: PLAID_SECRET,
          user: { client_user_id: `user-${Date.now()}` },
          client_name: 'SoundCheck Capital',
          products: ['auth', 'transactions'],
          country_codes: ['US'],
          language: 'en',
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Plaid link_token create failed: ${res.status} ${body}`);
      }
      const data = await res.json();
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
      // Bypass the Plaid Link iframe in E2E tests; fire onSuccess with a
      // sandbox-shaped public_token. The hook then POSTs to the webhook
      // (which Playwright intercepts), so the rest of the flow is real.
      onSuccess(`public-sandbox-test-${Date.now()}`, {
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
