/**
 * Integration tests for TicketingVolumeStep with new underwriting formula
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TicketingVolumeStep from '../TicketingVolumeStep';
import formSlice from '../../../store/form/formSlice';
import { ValidationProvider } from '../../../contexts/ValidationContext';

// Mock the underwriting debug module
jest.mock('../../../utils/underwritingDebug', () => ({
  logUnderwritingBreakdown: jest.fn()
}));

// Mock axios to avoid import issues in tests
jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: {
      form: formSlice
    },
    preloadedState: {
      form: initialState
    }
  });
};

const renderWithProviders = (component: React.ReactElement, store: any) => {
  return render(
    <Provider store={store}>
      <ValidationProvider>
        {component}
      </ValidationProvider>
    </Provider>
  );
};

describe('TicketingVolumeStep with Underwriting Formula', () => {
  const mockFormState = {
    currentStep: 2,
    email: 'test@example.com',
    emailError: '',
    isSubmitted: false,
    formData: {
      personalInfo: {
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '555-1234',
        role: 'Owner'
      },
      companyInfo: {
        name: 'Test Company',
        dba: '',
        yearsInBusiness: '10+ years',
        socials: '',
        clientType: 'Promoter',
        businessType: 'LLC',
        companyAddressDisplay: '',
        companyAddress: '',
        companyZipcode: '',
        companyState: '',
        companyCountry: '',
        companyCity: '',
        ein: '',
        stateOfIncorporation: '',
        memberOf: ''
      },
      ticketingInfo: {
        currentPartner: 'Ticketmaster',
        otherPartner: '',
        settlementPayout: 'Daily',
        paymentProcessing: 'Ticketing Co'
      },
      volumeInfo: {
        lastYearEvents: 50,
        lastYearTickets: 0,
        lastYearSales: 2000000,
        nextYearEvents: 0,
        nextYearTickets: 0,
        nextYearSales: 0
      },
      fundsInfo: {
        yourFunds: '',
        useOfProceeds: '',
        timingOfFunding: ''
      },
      ownershipInfo: {
        owners: []
      },
      financesInfo: {
        singleEntity: true,
        assetsTransferred: false,
        filedLastYearTaxes: true,
        hasTicketingDebt: false,
        hasBusinessDebt: false,
        debts: [],
        hasOverdueLiabilities: false,
        isLeasingLocation: false,
        leaseEndDate: '',
        hasTaxLiens: false,
        hasJudgments: false,
        hasBankruptcy: false,
        ownershipChanged: false
      },
      industryReferences: '',
      additionalComments: '',
      diligenceFiles: {
        ticketing: { files: [], fileInfos: [] },
        financial: { files: [], fileInfos: [] },
        legal: { files: [], fileInfos: [] },
        additional: { files: [], fileInfos: [] }
      }
    }
  };

  it('should display correct advance amount for low-risk scenario', async () => {
    const store = createMockStore(mockFormState);
    
    renderWithProviders(<TicketingVolumeStep />, store);
    
    // Should show the pre-offer text
    expect(screen.getByText('You could qualify for a funding up to:')).toBeInTheDocument();
    
    // Should show the calculated amount ($200,000 for this scenario)
    // Risk score: 0 (10+ years) + 0 (50+ events) + 1 (Ticketing Co) + 0 (Daily) = 1
    // Max advance: 10% (risk score 1 is in 0-6 band)
    // Amount: $2,000,000 * 10% = $200,000
    expect(screen.getByText('$200,000')).toBeInTheDocument();
  });

  it('should display correct advance amount for medium-risk scenario', async () => {
    const mediumRiskState = {
      ...mockFormState,
      formData: {
        ...mockFormState.formData,
        companyInfo: {
          ...mockFormState.formData.companyInfo,
          yearsInBusiness: '3-5 years'
        },
        ticketingInfo: {
          ...mockFormState.formData.ticketingInfo,
          paymentProcessing: 'Payment Processor',
          settlementPayout: 'Weekly'
        },
        volumeInfo: {
          ...mockFormState.formData.volumeInfo,
          lastYearEvents: 5,
          lastYearSales: 3000000
        }
      }
    };

    const store = createMockStore(mediumRiskState);
    
    renderWithProviders(<TicketingVolumeStep />, store);
    
    // Risk score: 1.5 (3-5 years) + 5.85 (4-6 events) + 3 (Payment Processor) + 1 (Weekly) = 11.35
    // Max advance: 7.5% (risk score 11.35 is in 6.0000001-12 band)
    // Amount: $3,000,000 * 7.5% = $225,000
    expect(screen.getByText('$225,000')).toBeInTheDocument();
  });

  it('should display cap message for high ticket sales', async () => {
    const highSalesState = {
      ...mockFormState,
      formData: {
        ...mockFormState.formData,
        volumeInfo: {
          ...mockFormState.formData.volumeInfo,
          lastYearSales: 20000000 // $20M should trigger cap
        }
      }
    };

    const store = createMockStore(highSalesState);
    
    renderWithProviders(<TicketingVolumeStep />, store);
    
    // Should show capped amount
    expect(screen.getByText('$500,000')).toBeInTheDocument();
    
    // Should show cap message
    expect(screen.getByText('* Amount capped at maximum advance limit')).toBeInTheDocument();
  });

  it('should not display advance amount when required data is missing', async () => {
    const incompleteState = {
      ...mockFormState,
      formData: {
        ...mockFormState.formData,
        companyInfo: {
          ...mockFormState.formData.companyInfo,
          yearsInBusiness: '' // Missing required field
        }
      }
    };

    const store = createMockStore(incompleteState);
    
    renderWithProviders(<TicketingVolumeStep />, store);
    
    // Should not show pre-offer section
    expect(screen.queryByText('You could qualify for a funding up to:')).not.toBeInTheDocument();
  });

  it('should display funding fields after delay', async () => {
    const store = createMockStore(mockFormState);
    
    renderWithProviders(<TicketingVolumeStep />, store);
    
    // Initially, funding fields should not be visible
    expect(screen.queryByText('Funding Needs ($)')).not.toBeInTheDocument();
    
    // Wait for the delay (2 seconds) and check if fields appear
    await new Promise(resolve => setTimeout(resolve, 2100)); // Wait slightly more than 2 seconds
    
    // Now funding fields should be present (check by text content)
    expect(screen.getByText('Funding Needs ($)')).toBeInTheDocument();
    expect(screen.getByText('Timing for Funding')).toBeInTheDocument();
    expect(screen.getByText('What do you plan to use the money for?')).toBeInTheDocument();
  });
});
