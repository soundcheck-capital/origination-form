// Simple test to check localStorage
console.log('🔍 Debug Validation Settings:');
console.log('DISABLE_VALIDATION:', localStorage.getItem('DISABLE_VALIDATION'));
console.log('NODE_ENV:', process.env.NODE_ENV);

// Clear the flag if it exists
if (localStorage.getItem('DISABLE_VALIDATION')) {
  console.log('⚠️ Found DISABLE_VALIDATION flag, removing it...');
  localStorage.removeItem('DISABLE_VALIDATION');
  console.log('✅ DISABLE_VALIDATION flag removed');
} else {
  console.log('✅ No DISABLE_VALIDATION flag found');
}
