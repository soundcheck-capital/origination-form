import * as Sentry from '@sentry/react';

export type CriticalEventName =
  | 'step_blocked'
  | 'file_upload_failed'
  | 'form_submission_failed'
  | 'form_submission_succeeded';

type Outcome = 'success' | 'error';

interface CriticalEventPayload {
  event_name: CriticalEventName;
  outcome: Outcome;
  timestamp?: string;
  step_id?: number;
  duration_ms?: number;
  error_code?: string;
  http_status?: number;
}

const SUCCESS_SAMPLE_RATE = 0.2;

const shouldSample = (rate: number) => Math.random() < rate;

export const logCriticalEvent = (
  payload: CriticalEventPayload,
  error?: unknown
) => {
  const eventPayload: CriticalEventPayload = {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  if (eventPayload.outcome === 'success' && !shouldSample(SUCCESS_SAMPLE_RATE)) {
    return;
  }

  const sentryExtra: Record<string, unknown> = {
    ...eventPayload,
  };

  Sentry.captureMessage(eventPayload.event_name, {
    level: eventPayload.outcome === 'error' ? 'error' : 'info',
    extra: sentryExtra,
  });

  if (eventPayload.outcome === 'error' && error instanceof Error) {
    Sentry.captureException(error, {
      extra: sentryExtra,
    });
  }
};
