import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './store';
import './App.css';
import MultiStepForm from './components/MultiStepForm';
import ProtectedRoute from './components/ProtectedRoute';
import SubmitSuccess from './components/SubmitSuccess';

function App() {
  const isSubmitted = useSelector((state: RootState) => state.form.isSubmitted);
  return (
    <Provider store={store}>
      <Router>
        {isSubmitted ? <div className="App">
          <Routes>
            {/* Route par défaut - redirige vers le formulaire protégé */}

            {/* Route du formulaire protégée par mot de passe */}
            <Route
              path="/form"
              element={
                <ProtectedRoute>
                  <MultiStepForm />
                  <Route path="/" element={<Navigate to="/form" replace />} />

                  {/* Route de succès après soumission */}
                  <Route path="/submit-success" element={<SubmitSuccess />} />

                  {/* Route de fallback */}
                  <Route path="*" element={<Navigate to="/form" replace />} />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div> : <SubmitSuccess />
      }
      </Router>
    </Provider>
  );
}

export default App;
