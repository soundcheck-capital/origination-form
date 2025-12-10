/**
 * Debug utilities for development
 */

/**
 * Clear validation bypass flags from localStorage
 */
export const clearValidationBypass = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const removed = [];
    
    if (localStorage.getItem('DISABLE_VALIDATION')) {
      localStorage.removeItem('DISABLE_VALIDATION');
      removed.push('DISABLE_VALIDATION');
    }
    
    if (localStorage.getItem('SKIP_VALIDATION')) {
      localStorage.removeItem('SKIP_VALIDATION');
      removed.push('SKIP_VALIDATION');
    }
    
    if (removed.length > 0) {
      console.log('🧹 Cleared validation bypass flags:', removed);
    } else {
      console.log('✅ No validation bypass flags found');
    }
    
    return removed;
  }
  
  return [];
};

/**
 * Check current validation settings
 */
export const checkValidationSettings = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const settings = {
      DISABLE_VALIDATION: localStorage.getItem('DISABLE_VALIDATION'),
      SKIP_VALIDATION: localStorage.getItem('SKIP_VALIDATION'),
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT
    };
    
    console.log('🔍 Current validation settings:', settings);
    return settings;
  }
  
  return null;
};

/**
 * Force enable validation (remove all bypass flags)
 */
export const forceEnableValidation = () => {
  const cleared = clearValidationBypass();
  console.log('🔒 Validation force-enabled');
  return cleared;
};

// Auto-run in development mode
if (process.env.NODE_ENV === 'development') {
  // Automatically clear validation bypass on load
  setTimeout(() => {
    checkValidationSettings();
    clearValidationBypass();
  }, 1000);
}
