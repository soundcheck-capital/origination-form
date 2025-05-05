import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SummaryStep: React.FC = () => {
  const {
    formData,
    ownershipInfo,
    financesInfo,
    diligenceInfo,

  } = useSelector((state: RootState) => state.form);

 
  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', {
      formData,
      ownershipInfo,
      financesInfo,
      diligenceInfo,
      
    });
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Let's get to know each other</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Summary</h3>

      <div className="summary-container">
        <div className="summary-section">
          <h4>Informations personnelles</h4>
          <p>{formData.personalInfo.email}</p>
          <p>{formData.companyInfo.address}</p>
          <p>{formData.companyInfo.city}, {formData.companyInfo.state} {formData.companyInfo.zipCode}</p>

          <h4>Informations de l'entreprise</h4>
          <p>{formData.companyInfo.name}</p>
          <p>{formData.companyInfo.ein}</p>
          <p>{formData.companyInfo.address}</p>
          <p>{formData.companyInfo.city}, {formData.companyInfo.state} {formData.companyInfo.zipCode}</p>
          <p>{formData.companyInfo.yearsInBusiness} years in business</p>
          <p>{formData.companyInfo.socials}</p>
          <p>{formData.companyInfo.type}</p>

          <h4>Informations de ticketing</h4>
          <p>Partenaire actuel : {formData.ticketingInfo.currentPartner}</p>
          <p>Politique de règlement : {formData.ticketingInfo.settlementPolicy}</p>
          <p>Adhésion : {formData.ticketingInfo.membership}</p>

          <h4>Volumes de tickets</h4>
          <p>Année dernière : {formData.volumeInfo.lastYearTickets} tickets</p>
          <p>Année prochaine : {formData.volumeInfo.nextYearTickets} tickets</p>

        <div className="summary-section">
          <h4>Ownership Information</h4>
          <p>Name: {ownershipInfo.name}</p>
          <p>Ownership: {ownershipInfo.ownership}</p>
          {!ownershipInfo.sameAddress && (
            <>
              <p>Address: {ownershipInfo.ownerAddress}</p>
              <p>City: {ownershipInfo.ownerCity}</p>
              <p>State: {ownershipInfo.ownerState}</p>
              <p>ZIP Code: {ownershipInfo.ownerZipCode}</p>
            </>
          )}
        </div>

        <div className="summary-section">
          <h4>Financial Information</h4>
          <p>Filed Last Year Taxes: {financesInfo.filedLastYearTaxes ? 'Yes' : 'No'}</p>
          <p>Has Business Debt: {financesInfo.hasBusinessDebt ? 'Yes' : 'No'}</p>
          {financesInfo.hasBusinessDebt && financesInfo.debts.length > 0 && (
            <div>
              <p>Debts:</p>
              {financesInfo.debts.map((debt, index) => (
                <p key={index}>- {debt.type}: ${debt.balance}</p>
              ))}
            </div>
          )}
          <p>Is Leasing Location: {financesInfo.isLeasingLocation ? 'Yes' : 'No'}</p>
          {financesInfo.isLeasingLocation && (
            <p>Lease End Date: {financesInfo.leaseEndDate}</p>
          )}
        </div>

          <h4>Documents de diligence</h4>
          <p>Compte bancaire lié : {diligenceInfo.bankAccountLinked ? 'Oui' : 'Non'}</p>
          <p>Fichiers de ticketing : {diligenceInfo.ticketingFiles.length} fichier(s)</p>
          <p>Fichiers financiers : {diligenceInfo.financialFiles.length} fichier(s)</p>
          <p>Autres fichiers : {diligenceInfo.otherFiles.length} fichier(s)</p>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Soumettre la demande
        </button>
      </div>
    </div>
  );
};

export default SummaryStep; 