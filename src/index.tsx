import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as Sentry from '@sentry/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MultiStepForm from './components/MultiStepForm';
import ProtectedRoute from './components/ProtectedRoute';
import FormSubmissionGuard from './components/FormSubmissionGuard';
import reportWebVitals from './reportWebVitals';
import SubmitSuccess from './components/SubmitSuccess';
import PasswordProtection from './components/PasswordProtection';

Sentry.init({
  dsn: 'https://c5bcc114d568abceb81c07f53de7d301@o4510828693422080.ingest.us.sentry.io/4510828695388160',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events.
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: true,
    }),
  ],
  // Tracing
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%.
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors.
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/form" replace />} />
            <Route path="/login" element={<PasswordProtection />} />
            <Route path="/form" element={
              <ProtectedRoute>
                <FormSubmissionGuard>
                  <MultiStepForm />
                </FormSubmissionGuard>
              </ProtectedRoute>
            } />
            <Route path="/submit-success" element={<SubmitSuccess />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
