import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/formSlice';

const DiligenceStep: React.FC = () => {
  const dispatch = useDispatch();
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);

  const handleFileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      dispatch(updateDiligenceInfo({ [field]: Array.from(files) }));
    }
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Diligence</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}>Upload Required Documents</h3>
      
      <p className="step-description">
        Please upload all required documents to complete your application. All documents should be in PDF format.
      </p>

      <div className="form-group">
        {/*<label className="form-label">Ticketing Company Report</label>*/}
        <p className="upload-description">
        Reports from ticketing company (last 3 years), not just Excel summary, including # events, $ gross ticket sales, # tickets sold per month        </p>
        <input
          type="file"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          onChange={handleFileChange('ticketingCompanyReport')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Copy of Ticketing Service Agreement </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('ticketingServiceAgreement')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Ticketing projections for next 2 years per month </p>
        <input  
          type="file"
          accept=".pdf"
          onChange={handleFileChange('ticketingProjections')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Certificate of Incorporation of contracting entity</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('incorporationCertificate')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Legal entity chart if more than one entity exists OR there have been distributions to other entities in the past</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('legalEntityChart')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Scanned copy of government issued ID (along with any other named partners in the agreement with SoundCheck)</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('governmentId')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Completed Form W-9 and IRS Letter 147C or SS-4 to authenticate your EIN </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('einAuthentication')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Last 2 years and YTD detailed financial statements (P&L, B/S, Cash Flow) per month</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('financialStatements')}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <p className="upload-description">Last 6 months of bank statements</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange('bankStatement')}
          className="form-control"
        />
      </div>

      {/* Plaid Auth code commented for later use
       const handleLinkBankAccount = () => {
    // TODO: Implement Plaid integration
    dispatch(updateDiligenceInfo({ bankAccountLinked: true }));
      <div className="form-group">
        <label className="form-label">Connect Bank Account</label>
        <button
          className="btn btn-primary"
          onClick={() => {
            // Plaid integration code will go here
          }}
        >
          Connect Bank Account
        </button>
      </div>
      <h4 className="diligence-title">Plaid - Connect your Bank Account</h4>
        
        <div className="diligence-description">
          <p>
            We link to your bank account to (i) have a complete understanding of your business and evaluate your application, 
            (ii) accelerate the payment of your Advance once your application is approved and (iii) collect the remittance with 
            ACH debit if we don't have a direct integration with your Ticketing partner.
          </p>
          <p>
            We use an industry-leading provider called <strong>Plaid</strong> (you might recognize them as the solution that 
            Venmo and their 40 million+ users use. Plaid's network has 12,000+ financial institutions and <strong>100+ million</strong> 
            consumers) to help you link your account.
          </p>
        </div>
      */}
    </div>
  );
};

export default DiligenceStep; 