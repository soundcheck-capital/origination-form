import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { FileInfo, DiligenceFileData } from '../store/form/formTypes';
import { updateDiligenceInfo } from '../store/form/formSlice';

// Status d'upload pour chaque fichier
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface FileUploadStatus {
  status: UploadStatus;
  error?: string;
}

interface DiligenceFiles {
  ticketingCompanyReport: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  ticketingServiceAgreement: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  financialStatements: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  bankStatement: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  incorporationCertificate: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  legalEntityChart: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  governmentId: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  w9form: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  lastYearTaxes: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
  other: { files: File[]; fileInfos: FileInfo[]; uploadStatuses: FileUploadStatus[] };
}

interface DiligenceFilesContextType {
  diligenceFiles: DiligenceFiles;
  addFiles: (field: keyof DiligenceFiles, newFiles: File[]) => void;
  removeFile: (field: keyof DiligenceFiles, index: number) => void;
  clearFiles: (field: keyof DiligenceFiles) => void;
  getAllFiles: () => { [key: string]: File[] };
  getAllFileInfos: () => { [key: string]: FileInfo[] };
  updateFileUploadStatus: (field: keyof DiligenceFiles, index: number, status: FileUploadStatus) => void;
}

const DiligenceFilesContext = createContext<DiligenceFilesContextType | undefined>(undefined);

const initialDiligenceFiles: DiligenceFiles = {
  ticketingCompanyReport: { files: [], fileInfos: [], uploadStatuses: [] },
  ticketingServiceAgreement: { files: [], fileInfos: [], uploadStatuses: [] },
  financialStatements: { files: [], fileInfos: [], uploadStatuses: [] },
  bankStatement: { files: [], fileInfos: [], uploadStatuses: [] },
  incorporationCertificate: { files: [], fileInfos: [], uploadStatuses: [] },
  legalEntityChart: { files: [], fileInfos: [], uploadStatuses: [] },
  governmentId: { files: [], fileInfos: [], uploadStatuses: [] },
  w9form: { files: [], fileInfos: [], uploadStatuses: [] },
  lastYearTaxes: { files: [], fileInfos: [], uploadStatuses: [] },
  other: { files: [], fileInfos: [], uploadStatuses: [] },
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
          fileInfos: reduxDiligenceInfo.ticketingCompanyReport?.fileInfos || [],
          uploadStatuses: [] 
        },
        ticketingServiceAgreement: { 
          files: reduxDiligenceInfo.ticketingServiceAgreement?.files || [], 
          fileInfos: reduxDiligenceInfo.ticketingServiceAgreement?.fileInfos || [],
          uploadStatuses: [] 
        },
        financialStatements: { 
          files: reduxDiligenceInfo.financialStatements?.files || [], 
          fileInfos: reduxDiligenceInfo.financialStatements?.fileInfos || [],
          uploadStatuses: [] 
        },
        bankStatement: { 
          files: reduxDiligenceInfo.bankStatement?.files || [], 
          fileInfos: reduxDiligenceInfo.bankStatement?.fileInfos || [],
          uploadStatuses: [] 
        },
        incorporationCertificate: { 
          files: reduxDiligenceInfo.incorporationCertificate?.files || [], 
          fileInfos: reduxDiligenceInfo.incorporationCertificate?.fileInfos || [],
          uploadStatuses: [] 
        },
        legalEntityChart: { 
          files: reduxDiligenceInfo.legalEntityChart?.files || [], 
          fileInfos: reduxDiligenceInfo.legalEntityChart?.fileInfos || [],
          uploadStatuses: [] 
        },
        governmentId: { 
          files: reduxDiligenceInfo.governmentId?.files || [], 
          fileInfos: reduxDiligenceInfo.governmentId?.fileInfos || [],
          uploadStatuses: [] 
        },
        w9form: { 
          files: reduxDiligenceInfo.w9form?.files || [], 
          fileInfos: reduxDiligenceInfo.w9form?.fileInfos || [],
          uploadStatuses: [] 
        },
        other: { 
          files: reduxDiligenceInfo.other?.files || [], 
          fileInfos: reduxDiligenceInfo.other?.fileInfos || [],
          uploadStatuses: [] 
        },
        lastYearTaxes: { 
          files: reduxDiligenceInfo.lastYearTaxes?.files || [], 
          fileInfos: reduxDiligenceInfo.lastYearTaxes?.fileInfos || [],
          uploadStatuses: [] 
        },
      };
      
      // Vider les champs qui ont des fileInfos mais pas de fichiers (après refresh)
      let hasClearedFields = false;
      Object.keys(syncedFiles).forEach(key => {
        const fieldKey = key as keyof DiligenceFiles;
        const field = syncedFiles[fieldKey];
        
        // Si on a des métadonnées mais pas de fichiers, c'est qu'on a refreshé
        if (field.fileInfos.length > 0 && field.files.length === 0) {
          syncedFiles[fieldKey] = { files: [], fileInfos: [], uploadStatuses: [] };
          hasClearedFields = true;
        }
        
        // Vider aussi les fichiers invalides (avec des propriétés manquantes)
        const validFiles = field.files.filter(file => 
          file && 
          file.name && 
          file.name !== 'undefined' && 
          file.size !== undefined && 
          file.size > 0
        );
        
        if (validFiles.length !== field.files.length) {
          syncedFiles[fieldKey] = { 
            files: validFiles, 
            fileInfos: field.fileInfos.slice(0, validFiles.length),
            uploadStatuses: field.uploadStatuses?.slice(0, validFiles.length) || []
          };
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
      const newUploadStatuses = newFiles.map(() => ({ status: 'pending' as UploadStatus }));
      
      const updatedFiles = {
        ...prev,
        [field]: {
          files: [...currentField.files, ...newFiles],
          fileInfos: [...currentField.fileInfos, ...newFileInfos],
          uploadStatuses: [...(currentField.uploadStatuses || []), ...newUploadStatuses],
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
      const newUploadStatuses = (currentField.uploadStatuses || []).filter((_, i) => i !== index);
      
      const updatedFiles = {
        ...prev,
        [field]: {
          files: newFiles,
          fileInfos: newFileInfos,
          uploadStatuses: newUploadStatuses,
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
        [field]: { files: [], fileInfos: [], uploadStatuses: [] },
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

  const updateFileUploadStatus = useCallback((field: keyof DiligenceFiles, index: number, status: FileUploadStatus) => {
    console.log(`🔄 [DiligenceContext] Updating upload status for ${field}[${index}]:`, status);
    
    setDiligenceFiles(prev => {
      const currentField = prev[field];
      const newUploadStatuses = [...(currentField.uploadStatuses || [])];
      newUploadStatuses[index] = status;
      
      console.log(`📊 [DiligenceContext] New upload statuses for ${field}:`, newUploadStatuses);
      
      return {
        ...prev,
        [field]: {
          ...currentField,
          uploadStatuses: newUploadStatuses,
        },
      };
    });
  }, []);

  const value = {
    diligenceFiles,
    addFiles,
    removeFile,
    clearFiles,
    getAllFiles,
    getAllFileInfos,
    updateFileUploadStatus,
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