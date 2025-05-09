import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateDiligenceInfo } from '../store/formSlice';

const DiligenceStep: React.FC = () => {
  const dispatch = useDispatch();
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);

  const handleLinkBankAccount = () => {
    // TODO: Implement Plaid integration
    dispatch(updateDiligenceInfo({ bankAccountLinked: true }));
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>, fileType: 'ticketingFiles' | 'financialFiles' | 'otherFiles') => {
    const files = Array.from(event.target.files || []);
    dispatch(updateDiligenceInfo({ [fileType]: files }));
  };

  const renderFileUploadSection = (
    title: string,
    description: string,
    fileType: 'ticketingFiles' | 'financialFiles' | 'otherFiles',
    files: File[]
  ) => (
    <div className="upload-section">
      <h4 className="upload-title">{title}</h4>
      <p className="upload-description">{description}</p>
      <div className="file-upload-container">
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(e, fileType)}
          className="file-input"
        />
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              {file.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="form-step">
      <h2 className="step-title">Diligence</h2>
      <h3 className="step-subtitle" style={{ color: '#F99927' }}></h3>

      <div className="diligence-container">
       

        {renderFileUploadSection(
          'Ticketing - Upload Historical Ticket Sales',
          'Minimum to provide: This year + last 3 year reports from ticketing company. Best to provide: This year + last 3 year reports from ticketing company month by month',
          'ticketingFiles',
          diligenceInfo.ticketingFiles
        )}

        {renderFileUploadSection(
          'Financial - Upload financial statements',
          'Minimum to provide: Up to Date Balance Sheet and Most Current P&L. Best to provide: Up to Date Balance Sheet, Most Current P&L and 3 years of financial statements',
          'financialFiles',
          diligenceInfo.financialFiles
        )}
{/*  <h4 className="diligence-title">Plaid - Connect your Bank Account</h4>
        
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

        <button 
          className="btn btn-primary" 
          onClick={handleLinkBankAccount}
          style={{ marginTop: '2rem' }}
        >
          Link Bank Account
        </button> */}
        {renderFileUploadSection(
          'Other (optional) - Upload relevant documents about your business',
          'Minimum: if a venue copy of the lease, if a promoter a copy of the venue/rental agreement, if an outdoor event copy of the event cancelation insurance. Best: Budget, insurance certificate, bank letter, investor deck, etc.',
          'otherFiles',
          diligenceInfo.otherFiles
        )}
      </div>
    </div>
  );
};

export default DiligenceStep; 