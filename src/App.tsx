import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';
import MultiStepForm from './components/MultiStepForm';
import ProtectedRoute from './components/ProtectedRoute';
import SubmitSuccess from './components/SubmitSuccess';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Route par défaut - redirige vers le formulaire protégé */}
            <Route path="/" element={<Navigate to="/form" replace />} />
            
            {/* Route du formulaire protégée par mot de passe */}
            <Route 
              path="/form" 
              element={
                <ProtectedRoute>
                  <MultiStepForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Route de succès après soumission */}
            <Route path="/submit-success" element={<SubmitSuccess />} />
            
            {/* Route de fallback */}
            <Route path="*" element={<Navigate to="/form" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
