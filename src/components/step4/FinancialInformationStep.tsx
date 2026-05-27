import React from 'react';

import StepTitle from '../customComponents/StepTitle';
import FileUploadField from '../customComponents/FileUploadField';

const FINANCIAL_UPLOAD_SECTIONS = [
  {
    period: 'Year To Date',
    uploads: [
      { field: 'financialsYtdPL', title: 'P&L' },
      { field: 'financialsYtdBS', title: 'Balance Sheet' },
    ],
  },
  {
    period: 'Year - 1',
    uploads: [
      { field: 'financialsYear1PL', title: 'P&L' },
      { field: 'financialsYear1BS', title: 'Balance Sheet' },
    ],
  },
  {
    period: 'Year - 2',
    uploads: [
      { field: 'financialsYear2PL', title: 'P&L' },
      { field: 'financialsYear2BS', title: 'Balance Sheet' },
    ],
  },
] as const;

const FinancialInformationStep: React.FC = () => {
  const handleFilesChange = (_field: string, _fileInfos: unknown[]) => {
    // Files are managed by FileUploadField
  };

  return (
    <div className="flex flex-col w-full animate-fade-in-right duration-1000">
      <StepTitle title="2. Finance" />

      <div className="w-full">
        {FINANCIAL_UPLOAD_SECTIONS.map(({ period, uploads }) => (
          <div key={period} className="mb-2">
            <p className="text-xs font-semibold text-neutral-800 mb-2">{period}</p>
            {uploads.map(({ field, title }) => (
              <FileUploadField
                key={field}
                field={field}
                title={title}
                accept=".xlsx,.pdf,.csv,.jpg,.png"
                multiple={false}
                onFilesChange={(fileInfos) => handleFilesChange(field, fileInfos)}
                required={true}
              />
            ))}
          </div>
        ))}

        <FileUploadField
          field="bankStatement"
          title="Last 6 months of bank statements"
          accept=".xlsx,.pdf,.csv,.jpg,.png"
          multiple={true}
          onFilesChange={(fileInfos) => handleFilesChange('bankStatement', fileInfos)}
        />
      </div>
    </div>
  );
};

export default FinancialInformationStep;
