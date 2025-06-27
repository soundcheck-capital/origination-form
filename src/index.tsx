import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MultiStepForm from './components/MultiStepForm';
import ProtectedRoute from './components/ProtectedRoute';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Routes>
          {/* Direct access to form - bypassing login and dashboard */}
          <Route path="/" element={<MultiStepForm />} />
          <Route path="/new-application" element={<MultiStepForm />} />
          <Route path="/application/:id" element={<MultiStepForm />} />
          
          {/* OLD CODE - KEPT FOR LATER USE */}
          {/* 
          <Route path="/" element={<App />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-application" element={<MultiStepForm />} />
            <Route path="/application/:id" element={<MultiStepForm />} />
          </Route>
          */}
        </Routes>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
