import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as Sentry from '@sentry/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MultiStepForm from './components/MultiStepForm';
import ProtectedRoute from './components/ProtectedRoute';
import reportWebVitals from './reportWebVitals';
import SubmitSuccess from './components/SubmitSuccess';

Sentry.init({
  dsn: 'https://c5bcc114d568abceb81c07f53de7d301@o4510828693422080.ingest.us.sentry.io/4510828695388160',
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: false,
      blockAllMedia: true,
    }),
  ],
  // Tracing
  tracesSampleRate: 0.05,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const RootRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/form${location.search}`} replace />;
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/form" element={<ProtectedRoute><MultiStepForm /></ProtectedRoute>} />
            <Route path="/submit-success" element={<SubmitSuccess />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
