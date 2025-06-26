import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SummaryStep: React.FC = () => {
  const formData = useSelector((state: RootState) => state.form.formData);
  const financesInfo = useSelector((state: RootState) => state.form.financesInfo);
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: string) => {
    return `${value}%`;
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Summary</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Review Your Informations</h3>

      <div className="summary-container">
        {/* Company Information */}
        <div className="summary-section">
          <h4 className="summary-section-title">Company Information</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Company Name:</span>
              <span className="summary-value">{formData.companyInfo.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Company Type:</span>
              <span className="summary-value">{formData.companyInfo.clientType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Legal Entity Type:</span>
              <span className="summary-value">{formData.companyInfo.legalEntityType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Years in Business:</span>
              <span className="summary-value">{formData.companyInfo.yearsInBusiness}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Number of Employees:</span>
              <span className="summary-value">{formData.companyInfo.employees}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Tax ID:</span>
              <span className="summary-value">{formData.companyInfo.taxId}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Street:</span>
              <span className="summary-value">{formData.companyInfo.companyAddress}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">City:</span>
              <span className="summary-value">{formData.companyInfo.companyCity}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">State:</span>
              <span className="summary-value">{formData.companyInfo.companyState}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">ZIP Code:</span>
              <span className="summary-value">{formData.companyInfo.companyZipCode}</span>
            </div>
          </div>
       

       

        {/* Ticketing Information */}
          <h4 className="summary-section-title">Ticketing Information</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Current Partner:</span>
              <span className="summary-value">{formData.ticketingInfo.currentPartner}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Settlement Policy:</span>
              <span className="summary-value">{formData.ticketingInfo.settlementPolicy}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Membership:</span>
              <span className="summary-value">{formData.ticketingInfo.membership}</span>
            </div>
          </div>
       

        {/* Volume Information */}
          <h4 className="summary-section-title">Volume Information</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Last Year Events:</span>
              <span className="summary-value">{formData.volumeInfo.lastYearEvents}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Last Year Tickets:</span>
              <span className="summary-value">{formData.volumeInfo.lastYearTickets}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Last Year Sales:</span>
              <span className="summary-value">{formatCurrency(formData.volumeInfo.lastYearSales)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Next Year Events:</span>
              <span className="summary-value">{formData.volumeInfo.nextYearEvents}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Next Year Tickets:</span>
              <span className="summary-value">{formData.volumeInfo.nextYearTickets}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Next Year Sales:</span>
              <span className="summary-value">{formatCurrency(formData.volumeInfo.nextYearSales)}</span>
            </div>
          </div>

        {/* Funds Information */}
          <h4 className="summary-section-title">Funds Information</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Your Funds:</span>
              <span className="summary-value">{formatCurrency(parseFloat(formData.fundsInfo.yourFunds))}</span>
            </div>
           
            <div className="summary-item">
              <span className="summary-label">Recoupment Period:</span>
              <span className="summary-value">{formData.fundsInfo.recoupmentPeriod} months</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Recoupment Percentage:</span>
              <span className="summary-value">{formatPercentage(formData.fundsInfo.recoupmentPercentage)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Fund Use:</span>
              <span className="summary-value">{formData.fundsInfo.fundUse}</span>
            </div>
          </div>

        {/* Ownership Information */}
          <h4 className="summary-section-title">Ownership Information</h4>
          <div className="summary-grid">
        
            <div className="summary-item">
              <span className="summary-label">Company Type:</span>
              <span className="summary-value">{formData.companyInfo.companyType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">EIN:</span>
              <span className="summary-value">{formData.companyInfo.ein}</span>
            </div>

          <h5 className="summary-subsection-title">Owners</h5>
          {formData.ownershipInfo.owners.map((owner, index) => (
            <div key={owner.id} className="owner-summary">
              <h6 className="owner-title">Owner {index + 1}</h6>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Name:</span>
                  <span className="summary-value">{owner.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Ownership Percentage:</span>
                  <span className="summary-value">{formatPercentage(owner.ownershipPercentage)}</span>
                </div>
                {!owner.sameAddress && (
                  <>
                    <div className="summary-item">
                      <span className="summary-label">Address:</span>
                      <span className="summary-value">{owner.ownerAddress}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">City:</span>
                      <span className="summary-value">{owner.ownerCity}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">State:</span>
                      <span className="summary-value">{owner.ownerState}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">ZIP Code:</span>
                      <span className="summary-value">{owner.ownerZipCode}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Information */}
          <h4 className="summary-section-title">Financial Information</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Filed Last Year Taxes:</span>
              <span className="summary-value">{financesInfo.filedLastYearTaxes ? 'Yes' : 'No'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Has Business Debt:</span>
              <span className="summary-value">{financesInfo.hasBusinessDebt ? 'Yes' : 'No'}</span>
            </div>
            {financesInfo.hasBusinessDebt && financesInfo.debts.length > 0 && (
              <div className="summary-item debts-list">
                <span className="summary-label">Debts:</span>
                <div className="summary-value">
                  {financesInfo.debts.map((debt, index) => (
                    <div key={index}>
                      {debt.type}: {formatCurrency(parseFloat(debt.balance))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="summary-item">
              <span className="summary-label">Has Overdue Liabilities:</span>
              <span className="summary-value">{financesInfo.hasOverdueLiabilities ? 'Yes' : 'No'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Is Leasing Location:</span>
              <span className="summary-value">{financesInfo.isLeasingLocation ? 'Yes' : 'No'}</span>
            </div>
            {financesInfo.isLeasingLocation && (
              <div className="summary-item">
                <span className="summary-label">Lease End Date:</span>
                <span className="summary-value">{financesInfo.leaseEndDate}</span>
              </div>
            )}
            <div className="summary-item">
              <span className="summary-label">Has Tax Liens:</span>
              <span className="summary-value">{financesInfo.hasTaxLiens ? 'Yes' : 'No'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Has Judgments:</span>
              <span className="summary-value">{financesInfo.hasJudgments ? 'Yes' : 'No'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Has Bankruptcy:</span>
              <span className="summary-value">{financesInfo.hasBankruptcy ? 'Yes' : 'No'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Ownership Changed:</span>
              <span className="summary-value">{financesInfo.ownershipChanged ? 'Yes' : 'No'}</span>
            </div>
          </div>

        {/* Documents Uploaded */}
        
          <h4 className="summary-section-title">Documents Uploaded</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Ticketing Company Report:</span>
              <span className="summary-value">{diligenceInfo.ticketingCompanyReport.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Ticketing Service Agreement:</span>
              <span className="summary-value">{diligenceInfo.ticketingServiceAgreement.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Ticketing Projections:</span>
              <span className="summary-value">{diligenceInfo.ticketingProjections.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Incorporation Certificate:</span>
              <span className="summary-value">{diligenceInfo.incorporationCertificate.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Legal Entity Chart:</span>
              <span className="summary-value">{diligenceInfo.legalEntityChart.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Government ID:</span>
              <span className="summary-value">{diligenceInfo.governmentId.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">EIN Authentication:</span>
              <span className="summary-value">{diligenceInfo.einAuthentication.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Financial Statements:</span>
              <span className="summary-value">{diligenceInfo.financialStatements.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Bank Statement:</span>
              <span className="summary-value">{diligenceInfo.bankStatement.length > 0 ? 'Uploaded' : 'Not Uploaded'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Bank Account Linked:</span>
              <span className="summary-value">{diligenceInfo.bankAccountLinked ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default SummaryStep; 