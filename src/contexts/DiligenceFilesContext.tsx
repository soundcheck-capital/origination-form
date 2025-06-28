import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FileInfo } from '../store/form/formTypes';

interface DiligenceFiles {
  ticketingCompanyReport: { files: File[]; fileInfos: FileInfo[] };
  ticketingServiceAgreement: { files: File[]; fileInfos: FileInfo[] };
  financialStatements: { files: File[]; fileInfos: FileInfo[] };
  bankStatement: { files: File[]; fileInfos: FileInfo[] };
  incorporationCertificate: { files: File[]; fileInfos: FileInfo[] };
  legalEntityChart: { files: File[]; fileInfos: FileInfo[] };
  governmentId: { files: File[]; fileInfos: FileInfo[] };
  einAuthentication: { files: File[]; fileInfos: FileInfo[] };
}

interface DiligenceFilesContextType {
  diligenceFiles: DiligenceFiles;
  addFiles: (field: keyof DiligenceFiles, newFiles: File[]) => void;
  removeFile: (field: keyof DiligenceFiles, index: number) => void;
  clearFiles: (field: keyof DiligenceFiles) => void;
  getAllFiles: () => { [key: string]: File[] };
  getAllFileInfos: () => { [key: string]: FileInfo[] };
}

const DiligenceFilesContext = createContext<DiligenceFilesContextType | undefined>(undefined);

const initialDiligenceFiles: DiligenceFiles = {
  ticketingCompanyReport: { files: [], fileInfos: [] },
  ticketingServiceAgreement: { files: [], fileInfos: [] },
  financialStatements: { files: [], fileInfos: [] },
  bankStatement: { files: [], fileInfos: [] },
  incorporationCertificate: { files: [], fileInfos: [] },
  legalEntityChart: { files: [], fileInfos: [] },
  governmentId: { files: [], fileInfos: [] },
  einAuthentication: { files: [], fileInfos: [] },
};

interface DiligenceFilesProviderProps {
  children: ReactNode;
}

export const DiligenceFilesProvider: React.FC<DiligenceFilesProviderProps> = ({ children }) => {
  const [diligenceFiles, setDiligenceFiles] = useState<DiligenceFiles>(initialDiligenceFiles);

  const createFileInfo = (file: File, index: number): FileInfo => ({
    id: `file-${Date.now()}-${index}`,
    name: file.name,
    size: file.size,
    type: file.type,
    uploadedAt: new Date().toISOString(),
  });

  const addFiles = useCallback((field: keyof DiligenceFiles, newFiles: File[]) => {
    setDiligenceFiles(prev => {
      const currentField = prev[field];
      const newFileInfos = newFiles.map((file, index) => createFileInfo(file, currentField.files.length + index));
      
      return {
        ...prev,
        [field]: {
          files: [...currentField.files, ...newFiles],
          fileInfos: [...currentField.fileInfos, ...newFileInfos],
        },
      };
    });
  }, []);

  const removeFile = useCallback((field: keyof DiligenceFiles, index: number) => {
    setDiligenceFiles(prev => {
      const currentField = prev[field];
      const newFiles = currentField.files.filter((_, i) => i !== index);
      const newFileInfos = currentField.fileInfos.filter((_, i) => i !== index);
      
      return {
        ...prev,
        [field]: {
          files: newFiles,
          fileInfos: newFileInfos,
        },
      };
    });
  }, []);

  const clearFiles = useCallback((field: keyof DiligenceFiles) => {
    setDiligenceFiles(prev => ({
      ...prev,
      [field]: { files: [], fileInfos: [] },
    }));
  }, []);

  const getAllFiles = useCallback(() => {
    const allFiles: { [key: string]: File[] } = {};
    Object.keys(diligenceFiles).forEach(key => {
      allFiles[key] = diligenceFiles[key as keyof DiligenceFiles].files;
    });
    return allFiles;
  }, [diligenceFiles]);

  const getAllFileInfos = useCallback(() => {
    const allFileInfos: { [key: string]: FileInfo[] } = {};
    Object.keys(diligenceFiles).forEach(key => {
      allFileInfos[key] = diligenceFiles[key as keyof DiligenceFiles].fileInfos;
    });
    return allFileInfos;
  }, [diligenceFiles]);

  const value = {
    diligenceFiles,
    addFiles,
    removeFile,
    clearFiles,
    getAllFiles,
    getAllFileInfos,
  };

  return (
    <DiligenceFilesContext.Provider value={value}>
      {children}
    </DiligenceFilesContext.Provider>
  );
};

export const useDiligenceFiles = (): DiligenceFilesContextType => {
  const context = useContext(DiligenceFilesContext);
  if (context === undefined) {
    throw new Error('useDiligenceFiles must be used within a DiligenceFilesProvider');
  }
  return context;
}; 