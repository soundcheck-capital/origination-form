import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { FileInfo, DiligenceFileData } from '../store/form/formTypes';
import { updateDiligenceInfo } from '../store/form/formSlice';

interface DiligenceFiles {
  ticketingCompanyReport: { files: File[]; fileInfos: FileInfo[] };
  ticketingServiceAgreement: { files: File[]; fileInfos: FileInfo[] };
  financialStatements: { files: File[]; fileInfos: FileInfo[] };
  bankStatement: { files: File[]; fileInfos: FileInfo[] };
  incorporationCertificate: { files: File[]; fileInfos: FileInfo[] };
  legalEntityChart: { files: File[]; fileInfos: FileInfo[] };
  governmentId: { files: File[]; fileInfos: FileInfo[] };
  w9form: { files: File[]; fileInfos: FileInfo[] };
  other: { files: File[]; fileInfos: FileInfo[] };
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
  w9form: { files: [], fileInfos: [] },
  other: { files: [], fileInfos: [] },
};

interface DiligenceFilesProviderProps {
  children: ReactNode;
}

export const DiligenceFilesProvider: React.FC<DiligenceFilesProviderProps> = ({ children }) => {
  const [diligenceFiles, setDiligenceFiles] = useState<DiligenceFiles>(initialDiligenceFiles);
  const dispatch = useDispatch();
  const reduxDiligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);

  const updateReduxStore = useCallback((updatedFiles: DiligenceFiles) => {
    const diligenceInfo: { [key: string]: DiligenceFileData } = {};
    
    Object.keys(updatedFiles).forEach(key => {
      const fieldKey = key as keyof DiligenceFiles;
      diligenceInfo[fieldKey] = {
        files: updatedFiles[fieldKey].files,
        fileInfos: updatedFiles[fieldKey].fileInfos,
      };
    });

    dispatch(updateDiligenceInfo(diligenceInfo));
  }, [dispatch]);

  // Synchroniser l'état local avec le store Redux au chargement
  useEffect(() => {
    if (reduxDiligenceInfo) {
      const syncedFiles: DiligenceFiles = {
        ticketingCompanyReport: { 
          files: reduxDiligenceInfo.ticketingCompanyReport?.files || [], 
          fileInfos: reduxDiligenceInfo.ticketingCompanyReport?.fileInfos || [] 
        },
        ticketingServiceAgreement: { 
          files: reduxDiligenceInfo.ticketingServiceAgreement?.files || [], 
          fileInfos: reduxDiligenceInfo.ticketingServiceAgreement?.fileInfos || [] 
        },
        financialStatements: { 
          files: reduxDiligenceInfo.financialStatements?.files || [], 
          fileInfos: reduxDiligenceInfo.financialStatements?.fileInfos || [] 
        },
        bankStatement: { 
          files: reduxDiligenceInfo.bankStatement?.files || [], 
          fileInfos: reduxDiligenceInfo.bankStatement?.fileInfos || [] 
        },
        incorporationCertificate: { 
          files: reduxDiligenceInfo.incorporationCertificate?.files || [], 
          fileInfos: reduxDiligenceInfo.incorporationCertificate?.fileInfos || [] 
        },
        legalEntityChart: { 
          files: reduxDiligenceInfo.legalEntityChart?.files || [], 
          fileInfos: reduxDiligenceInfo.legalEntityChart?.fileInfos || [] 
        },
        governmentId: { 
          files: reduxDiligenceInfo.governmentId?.files || [], 
          fileInfos: reduxDiligenceInfo.governmentId?.fileInfos || [] 
        },
        w9form: { 
          files: reduxDiligenceInfo.w9form?.files || [], 
          fileInfos: reduxDiligenceInfo.w9form?.fileInfos || [] 
        },
        other: { 
          files: reduxDiligenceInfo.other?.files || [], 
          fileInfos: reduxDiligenceInfo.other?.fileInfos || [] 
        },
      };
      
      // Vider les champs qui ont des fileInfos mais pas de fichiers (après refresh)
      let hasClearedFields = false;
      Object.keys(syncedFiles).forEach(key => {
        const fieldKey = key as keyof DiligenceFiles;
        const field = syncedFiles[fieldKey];
        
        // Si on a des métadonnées mais pas de fichiers, c'est qu'on a refreshé
        if (field.fileInfos.length > 0 && field.files.length === 0) {
          console.log(`Clearing ${fieldKey} field - files lost after refresh`);
          syncedFiles[fieldKey] = { files: [], fileInfos: [] };
          hasClearedFields = true;
        }
      });
      
      // Si on a vidé des champs, mettre à jour Redux
      if (hasClearedFields) {
        updateReduxStore(syncedFiles);
      }
      
      // Vérifier si les données ont changé pour éviter les re-renders inutiles
      const hasChanged = JSON.stringify(syncedFiles) !== JSON.stringify(diligenceFiles);
      if (hasChanged) {
        setDiligenceFiles(syncedFiles);
      }
    }
  }, [reduxDiligenceInfo, diligenceFiles, updateReduxStore]);

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
      
      const updatedFiles = {
        ...prev,
        [field]: {
          files: [...currentField.files, ...newFiles],
          fileInfos: [...currentField.fileInfos, ...newFileInfos],
        },
      };

      // Mettre à jour Redux
      updateReduxStore(updatedFiles);
      
      return updatedFiles;
    });
  }, [updateReduxStore]);

  const removeFile = useCallback((field: keyof DiligenceFiles, index: number) => {
    setDiligenceFiles(prev => {
      const currentField = prev[field];
      const newFiles = currentField.files.filter((_, i) => i !== index);
      const newFileInfos = currentField.fileInfos.filter((_, i) => i !== index);
      
      const updatedFiles = {
        ...prev,
        [field]: {
          files: newFiles,
          fileInfos: newFileInfos,
        },
      };

      // Mettre à jour Redux
      updateReduxStore(updatedFiles);
      
      return updatedFiles;
    });
  }, [updateReduxStore]);

  const clearFiles = useCallback((field: keyof DiligenceFiles) => {
    setDiligenceFiles(prev => {
      const updatedFiles = {
        ...prev,
        [field]: { files: [], fileInfos: [] },
      };

      // Mettre à jour Redux
      updateReduxStore(updatedFiles);
      
      return updatedFiles;
    });
  }, [updateReduxStore]);

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