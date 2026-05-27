import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { formatCurrency } from '../../utils/format';

interface SummaryStepProps {
  renderValidationErrors?: React.ReactNode;
  onStepClick?: (stepNumber: number) => void;
}

const PencilIcon = () => (
  <svg className="absolute top-3 right-3 w-3.5 h-3.5 text-gray-400 hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const Row = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex justify-between gap-2">
    <span className="text-gray-500 shrink-0">{label}:</span>
    <span className="text-gray-600 font-semibold text-right">{value || '—'}</span>
  </div>
);

const SummaryStep: React.FC<SummaryStepProps> = ({ renderValidationErrors, onStepClick }) => {
  const formData = useSelector((state: RootState) => state.form.formData);
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);
  
  const { personalInfo, companyInfo, ticketingInfo, volumeInfo, fundsInfo, ownershipInfo, financesInfo, bankInfo } = formData;

  const [disableSubmissionBlock] = useState(() => {
    return localStorage.getItem('DISABLE_SUBMISSION_BLOCK') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('DISABLE_SUBMISSION_BLOCK', disableSubmissionBlock.toString());
  }, [disableSubmissionBlock]);

  const cardClass = "bg-white rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200 relative";

  return (
    <div className="flex flex-col items-center justify-center w-full mt-4 animate-fade-in-right duration-1000">
      {renderValidationErrors}

      <div className="w-full max-w-2xl space-y-1 text-xs">

        {/* Step 1 — Business Info */}
        <div className={cardClass} onClick={() => onStepClick?.(1)}>
          <PencilIcon />
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Business Info</h3>
          <div className="space-y-0.5">
            <Row label="Name" value={`${personalInfo.firstname} ${personalInfo.lastname}`} />
            <Row label="Email" value={personalInfo.email} />
            <Row label="Phone" value={personalInfo.phone} />
            <Row label="Role" value={personalInfo.role} />
            <Row label="Company" value={companyInfo.name} />
            <Row label="DBA" value={companyInfo.dba} />
            <Row label="EIN" value={companyInfo.ein} />
            <Row label="Legal Entity" value={companyInfo.businessType} />
            <Row label="Years in Business" value={companyInfo.yearsInBusiness} />
            <Row label="Address" value={companyInfo.companyAddressDisplay} />
            <Row label="State of Incorporation" value={companyInfo.stateOfIncorporation} />
            <Row label="Ticketing Partner" value={ticketingInfo.currentPartner} />
            <Row label="Settlement From" value={ticketingInfo.paymentProcessing} />
            <Row label="Settlement Policy" value={ticketingInfo.settlementPayout} />
            <Row label="Payment Processor" value={ticketingInfo.paymentProcessor} />
            {ticketingInfo.paymentProcessor === 'Other' && (
              <Row label="Other Payment Processor" value={ticketingInfo.otherPaymentProcessor} />
            )}
            <Row label="Accounting System" value={financesInfo.accountingSystem} />
            {financesInfo.accountingSystem === 'Other' && (
              <Row label="Other Accounting System" value={financesInfo.otherAccountingSystem} />
            )}
            <Row label="Events / Year" value={volumeInfo.nextYearEvents} />
            <Row label="Gross Ticketing Volume" value={formatCurrency(volumeInfo.nextYearSales)} />
          </div>
        </div>

        {/* Step 2 — Funding */}
        <div className={cardClass} onClick={() => onStepClick?.(2)}>
          <PencilIcon />
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Funding</h3>
          <div className="space-y-0.5">
            <Row label="Purchase Price" value={formatCurrency(parseFloat(fundsInfo.yourFunds) || 0)} />
            <Row label="Timing of Funding" value={fundsInfo.timingOfFunding} />
            <Row label="Use of Proceeds" value={fundsInfo.useOfProceeds} />
          </div>
        </div>

        {/* Step 3 — Business & Ownership */}
        <div className={cardClass} onClick={() => onStepClick?.(3)}>
          <PencilIcon />
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Business & Ownership</h3>
          <div className="space-y-0.5">
            {ownershipInfo.owners.map((owner, index) => (
              <div key={owner.id} className="mb-1">
                <p className="font-semibold text-gray-600 mb-0.5">Owner {index + 1}</p>
                <Row label="Name" value={owner.ownerName} />
                <Row label="Ownership" value={`${owner.ownershipPercentage}%`} />
                <Row label="Address" value={owner.ownerAddress} />
                <Row label="Birth Date" value={owner.ownerBirthDate} />
              </div>
            ))}
            <div className="mt-1 pt-1 border-t border-gray-100 space-y-0.5">
              <Row label="Single Entity" value={financesInfo.singleEntity ? 'Yes' : 'No'} />
              <Row label="Business Debt" value={financesInfo.hasBusinessDebt ? 'Yes' : 'No'} />
              <Row label="Tax Liens" value={financesInfo.hasTaxLiens ? 'Yes' : 'No'} />
              <Row label="Overdue Liabilities" value={financesInfo.hasOverdueLiabilities ? 'Yes' : 'No'} />
              <Row label="Bankruptcy" value={financesInfo.hasBankruptcy ? 'Yes' : 'No'} />
              <Row label="Ownership Changed" value={financesInfo.ownershipChanged ? 'Yes' : 'No'} />
              {financesInfo.industryReferences && <Row label="Industry References" value={financesInfo.industryReferences} />}
              {financesInfo.additionalComments && <Row label="Additional Comments" value={financesInfo.additionalComments} />}
            </div>
          </div>
        </div>

        {/* Step 4 — Bank Connection */}
        <div className={cardClass} onClick={() => onStepClick?.(4)}>
          <PencilIcon />
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Bank Connection</h3>
          <div className="space-y-0.5">
            <Row label="Status" value={bankInfo.plaidConnected ? 'Connected' : 'Not Connected'} />
            {bankInfo.plaidConnected && (
              <>
                <Row label="Institution" value={bankInfo.institutionName} />
                <Row label="Account" value={bankInfo.accountMask ? `••••${bankInfo.accountMask}` : '—'} />
                <Row label="Account Name" value={bankInfo.accountName} />
              </>
            )}
          </div>
        </div>

        {/* Step 5 — Diligence Files */}
        <div className={cardClass} onClick={() => onStepClick?.(5)}>
          <PencilIcon />
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Diligence Files</h3>
          <div className="space-y-0.5">
            {[
              { label: 'Future Event Schedule', key: 'futureEventSchedule' },
              { label: 'Ticketing Company Report', key: 'ticketingCompanyReport' },
              { label: 'Ticketing Service Agreement', key: 'ticketingServiceAgreement' },
              { label: 'Year To Date — P&L', key: 'financialsYtdPL' },
              { label: 'Year To Date — Balance Sheet', key: 'financialsYtdBS' },
              { label: 'Year - 1 — P&L', key: 'financialsYear1PL' },
              { label: 'Year - 1 — Balance Sheet', key: 'financialsYear1BS' },
              { label: 'Year - 2 — P&L', key: 'financialsYear2PL' },
              { label: 'Year - 2 — Balance Sheet', key: 'financialsYear2BS' },
              { label: 'Venue Agreements', key: 'venueAgreements' },
              { label: 'Bank Statement', key: 'bankStatement' },
              { label: 'Incorporation Certificate', key: 'incorporationCertificate' },
              { label: 'Legal Entity Chart', key: 'legalEntityChart' },
              { label: 'Government ID', key: 'governmentId' },
              { label: 'W9 Form', key: 'w9form' },
              { label: 'Other Documents', key: 'other' },
            ].map(({ label, key }) => {
              const count = (diligenceInfo as any)[key]?.fileInfos?.length ?? 0;
              return (
                <div key={key} className="flex justify-between gap-2">
                  <span className="text-gray-500 shrink-0">{label}:</span>
                  <span className={count > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {count > 0 ? `${count} file${count > 1 ? 's' : ''}` : 'No file'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SummaryStep;
