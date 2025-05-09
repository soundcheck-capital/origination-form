import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SummaryStep: React.FC = () => {
  const formData = useSelector((state: RootState) => state.form.formData);
  const ownershipInfo = useSelector((state: RootState) => state.form.ownershipInfo);
  const financesInfo = useSelector((state: RootState) => state.form.financesInfo);
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);

  const formatNumber = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', {
      formData,
      ownershipInfo,
      financesInfo,
      diligenceInfo
    });
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Summary</h3>

      <div className="summary-container">
        <div className="summary-section">
          <h4>Company Information</h4>
          <p>Name: {formData.companyInfo.name}</p>
          <p>Years in Business: {formData.companyInfo.yearsInBusiness}</p>
          <p>Type: {formData.companyInfo.type}</p>
          <p>Address: {formData.companyInfo.address}</p>
          <p>City: {formData.companyInfo.city}</p>
          <p>State: {formData.companyInfo.state}</p>
          <p>ZIP Code: {formData.companyInfo.zipCode}</p>
          <p>Socials: {formData.companyInfo.socials}</p>
        </div>

        <div className="summary-section">
          <h4>Ticketing Information</h4>
          <p>Current Partner: {formData.ticketingInfo.currentPartner}</p>
          <p>Settlement Policy: {formData.ticketingInfo.settlementPolicy}</p>
          <p>Membership: {formData.ticketingInfo.membership}</p>
        </div>

        <div className="summary-section">
          <h4>Volume Information</h4>
          <p>Last Year Events: {formData.volumeInfo.lastYearEvents}</p>
          <p>Last Year Tickets: {formData.volumeInfo.lastYearTickets}</p>
          <p>Last Year Sales: {formData.volumeInfo.lastYearSales}</p>
          <p>Next Year Events: {formData.volumeInfo.nextYearEvents}</p>
          <p>Next Year Tickets: {formData.volumeInfo.nextYearTickets}</p>
          <p>Next Year Sales: {formData.volumeInfo.nextYearSales}</p>
        </div>

        <div className="summary-section">
          <h4>Ownership Information</h4>
          {ownershipInfo.owners.map((owner, index) => (
            <div key={owner.id}>
              <p>Owner {index + 1}: {owner.name}</p>
              <p>Ownership Percentage: {owner.ownershipPercentage}%</p>
              {!owner.sameAddress && (
                <>
                  <p>Address: {owner.ownerAddress}</p>
                  <p>City: {owner.ownerCity}</p>
                  <p>State: {owner.ownerState}</p>
                  <p>ZIP Code: {owner.ownerZipCode}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="summary-section">
          <h4>Financial Information</h4>
          <p>Filed Last Year Taxes: {financesInfo.filedLastYearTaxes ? 'Yes' : 'No'}</p>
          <p>Has Business Debt: {financesInfo.hasBusinessDebt ? 'Yes' : 'No'}</p>
          {financesInfo.hasBusinessDebt && financesInfo.debts.length > 0 && (
            <div>
              <p>Debts:</p>
              <ul>
                {financesInfo.debts.map((debt, index) => (
                  <li key={index}>
                    {debt.type}: {formatNumber(debt.balance)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p>Has Overdue Liabilities: {financesInfo.hasOverdueLiabilities ? 'Yes' : 'No'}</p>
          <p>Is Leasing Location: {financesInfo.isLeasingLocation ? 'Yes' : 'No'}</p>
          {financesInfo.isLeasingLocation && (
            <p>Lease End Date: {financesInfo.leaseEndDate}</p>
          )}
          <p>Has Tax Liens: {financesInfo.hasTaxLiens ? 'Yes' : 'No'}</p>
          <p>Has Judgments: {financesInfo.hasJudgments ? 'Yes' : 'No'}</p>
          <p>Has Bankruptcy: {financesInfo.hasBankruptcy ? 'Yes' : 'No'}</p>
          <p>Ownership Changed: {financesInfo.ownershipChanged ? 'Yes' : 'No'}</p>
        </div>

        <div className="summary-section">
          <h4>Funds Information</h4>
          <p>Your Funds: {formatNumber(formData.fundsInfo.yourFunds)}</p>
          <p>Other Funds: {formatNumber(formData.fundsInfo.otherFunds)}</p>
          <p>Recoupment Period: {formData.fundsInfo.recoupmentPeriod} months</p>
          <p>Recoupment Percentage: {formData.fundsInfo.recoupmentPercentage}%</p>
          <p>Fund Use: {formData.fundsInfo.fundUse}</p>
        </div>

        <div className="summary-section">
          <h4>Diligence Information</h4>
          <p>Bank Account Linked: {diligenceInfo.bankAccountLinked ? 'Yes' : 'No'}</p>
          <p>Ticketing Files: {diligenceInfo.ticketingFiles.length} files</p>
          <p>Financial Files: {diligenceInfo.financialFiles.length} files</p>
          <p>Other Files: {diligenceInfo.otherFiles.length} files</p>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default SummaryStep; 