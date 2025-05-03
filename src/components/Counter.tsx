import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../store/counterSlice';
import type { RootState } from '../store/store';

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '1rem',
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '300px',
      margin: '2rem auto'
    }}>
      <h2>Compteur Redux</h2>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem' 
      }}>
        <button 
          onClick={() => dispatch(decrement())}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          -
        </button>
        <span style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          minWidth: '50px',
          textAlign: 'center'
        }}>
          {count}
        </span>
        <button 
          onClick={() => dispatch(increment())}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            backgroundColor: '#44ff44',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          +
        </button>
      </div>
      <button 
        onClick={() => dispatch(incrementByAmount(5))}
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          backgroundColor: '#4444ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        +5
      </button>
    </div>
  );
};

export default Counter; 