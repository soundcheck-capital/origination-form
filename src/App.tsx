import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import { RootState, AppDispatch } from './store';
import { fetchUserProfile } from './store/auth/authThunks';  

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  
  // Check if user is authenticated on initial load
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);
  
  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="App auth-container">
      <header className="App-header">
        <div className="login-page">
            <LoginForm />
        </div>
      </header>
    </div>
  );
  
}

export default App;
