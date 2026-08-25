import React from 'react';
import StepTitle from '../customComponents/StepTitle';
import ButtonPrimary from '../customComponents/ButtonPrimary';
import ButtonSecondary from '../customComponents/ButtonSecondary';
import { usePlaidConnection } from '../../hooks/usePlaidConnection';
import { useValidation } from '../../contexts/ValidationContext';

const PlaidConnectionStep: React.FC = () => {
  const {
    ready,
    open,
    connected,
    institutionName,
    accountMask,
    accountName,
    error,
    isLoading,
    reset,
  } = usePlaidConnection();
  const { hasError, getFieldError } = useValidation();

  const fieldError = hasError('plaidConnected') ? getFieldError('plaidConnected') : null;

  return (
    <div className="flex flex-col w-full animate-fade-in-right duration-1000">
      <StepTitle title="Connect your bank account" />

      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-[#eef0f3] p-6 mt-4 text-left">
        <p className="text-[15px] text-[#5b6573] mb-4">
          We use Plaid to securely connect to your business bank account. We only read account
          identity, balances and recent transactions — we never move money or store your credentials.
        </p>

        {!connected && (
          <div className="flex flex-col items-center gap-3 py-4">
            <ButtonPrimary
              onClick={() => open()}
              disabled={!ready || isLoading}
              data-testid="plaid-connect-button"
            >
              {isLoading ? 'Loading...' : 'Connect your bank account'}
            </ButtonPrimary>
            {!ready && !isLoading && !error && (
              <span className="text-xs text-gray-400">Initializing secure connection…</span>
            )}
          </div>
        )}

        {connected && (
          <div
            className="border border-green-200 bg-green-50 rounded-lg p-4 mt-2"
            data-testid="plaid-connected-card"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-800">✓ Bank connected</span>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Disconnect
              </button>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Institution:</span>
                <span className="text-gray-700 font-medium">{institutionName || '—'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Account:</span>
                <span className="text-gray-700 font-medium">
                  {accountName || 'Account'} {accountMask ? `••••${accountMask}` : ''}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
            <div className="mt-2">
              <ButtonSecondary onClick={reset} disabled={false}>Retry</ButtonSecondary>
            </div>
          </div>
        )}

        {fieldError && !connected && (
          <div className="mt-4 text-sm text-red-600" data-testid="plaid-required-error">
            {fieldError}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaidConnectionStep;
