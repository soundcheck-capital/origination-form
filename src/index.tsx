import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MultiStepForm from './components/MultiStepForm';
import ProtectedRoute from './components/ProtectedRoute';
import reportWebVitals from './reportWebVitals';
import SubmitSuccess from './components/SubmitSuccess';
import PasswordProtection from './components/PasswordProtection';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/form" replace />} />
            <Route path="/login" element={<PasswordProtection />} />
            <Route path="/form" element={<ProtectedRoute><MultiStepForm /></ProtectedRoute>} />
            <Route path="/submit-success" element={<SubmitSuccess />} />
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
