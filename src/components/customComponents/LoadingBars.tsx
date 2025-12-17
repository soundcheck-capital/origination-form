import React from 'react';

type LoadingBarsProps = {
  className?: string;
  visible?: boolean;
};

/**
 * Reusable animated bars (taken from LoadingScreen.tsx) to mimic the moving logo.
 */
const LoadingBars: React.FC<LoadingBarsProps> = ({ className = '', visible = true }) => {
  return (
    <div
      className={[
        'flex justify-center items-end space-x-1 transition-all duration-500',
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
        className
      ].join(' ')}
    >
      <div
        className="w-2 h-3 bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-400 rounded-full animate-bounce"
        style={{ animationDelay: '0.3s', animationDuration: '1.5s' }}
      />
      <div
        className="w-2 h-7 bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-400 rounded-full animate-pulse"
        style={{ animationDelay: '0.4s', animationDuration: '1.1s' }}
      />
      <div
        className="w-2 h-5 bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-400 rounded-full animate-bounce"
        style={{ animationDelay: '0.5s', animationDuration: '0.9s' }}
      />
      <div
        className="w-2 h-4 bg-gradient-to-b from-pink-500 via-orange-400 to-yellow-400 rounded-full animate-pulse"
        style={{ animationDelay: '0.6s', animationDuration: '1.3s' }}
      />
    </div>
  );
};

export default LoadingBars;


