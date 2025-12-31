// Manual test to verify validation works
// Run this in browser console

console.log('🧪 Testing Step 1 Validation');

// Check if validation bypass is disabled
console.log('DISABLE_VALIDATION:', localStorage.getItem('DISABLE_VALIDATION'));

// Test validation logic manually
const testFormData = {
  formData: {
    personalInfo: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phone: '(555) 123-4567',
      role: 'Owner'
    },
    companyInfo: {
      name: 'Test Company',
      yearsInBusiness: '10+ years',
      socials: 'https://example.com',
      clientType: 'Promoter',
      memberOf: 'Other'
    },
    ticketingInfo: {
      currentPartner: 'Ticketmaster',
      otherPartner: '',
      settlementPayout: '', // EMPTY - should fail validation
      paymentProcessing: 'Ticketing Co'
    },
    volumeInfo: {
      lastYearEvents: 50,
      lastYearSales: 2000000
    }
  }
};

// Test the validation logic
function testValidation() {
  const { ticketingInfo, volumeInfo } = testFormData.formData;
  const errors = {};
  
  if (!ticketingInfo.paymentProcessing) errors.paymentProcessing = 'Payment processing is required';
  if (!ticketingInfo.currentPartner.trim()) errors.currentPartner = 'Ticketing partner is required';
  if (!ticketingInfo.settlementPayout) errors.settlementPayout = 'Settlement payout policy is required';
  if (volumeInfo.lastYearEvents <= 0) errors.lastYearEvents = 'Number of events must be greater than 0';
  if (volumeInfo.lastYearSales <= 0) errors.lastYearSales = 'Gross annual ticketing volume must be greater than 0';
  
  const isValid = Object.keys(errors).length === 0;
  
  console.log('Validation Result:', { isValid, errors });
  
  if (isValid) {
    console.log('❌ PROBLEM: Validation passed when it should have failed (settlementPayout is empty)');
  } else {
    console.log('✅ SUCCESS: Validation correctly failed');
    if (errors.settlementPayout) {
      console.log('✅ Settlement payout error correctly detected');
    }
  }
  
  return { isValid, errors };
}

testValidation();
