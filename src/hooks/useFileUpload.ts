import { useState } from 'react';

interface UploadResult {
  success: boolean;
  error?: string;
  response?: any;
}

interface FileUploadResult {
  success: boolean;
  error?: string;
  fileName?: string;
  fieldName?: string;
}

// Constante pour la limite de taille (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB en bytes

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Fonction pour valider la taille des fichiers
  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      console.error(`File ${file.name} is too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max: 100MB)`);
      return false;
    }
    return true;
  };

  // Fonction pour envoyer les données du formulaire (sans fichiers)
  const sendFormData = async (formData: any): Promise<UploadResult> => {
    try {
      console.log("Sending form data to:", process.env.REACT_APP_WEBHOOK_URL);
      const formData = new FormData();
      formData.append('applicationId', JSON.stringify(formData));
      formData.append('HubspotCompanyId', process.env.REACT_APP_HUBSPOT_COMPANY_ID || '');
      formData.append('HubspotDealId', process.env.REACT_APP_HUBSPOT_DEAL_ID || '');
      formData.append('HubspotContactId', process.env.REACT_APP_HUBSPOT_CONTACT_ID || '');

      const response = await fetch(process.env.REACT_APP_WEBHOOK_URL || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        return {
          success: true,
        };
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending form data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Fonction pour envoyer un fichier individuel
  const sendFile = async (file: File, fieldName: string, fileInfo: any): Promise<FileUploadResult> => {
    try {
      // Valider la taille du fichier
      if (!validateFileSize(file)) {
        return {
          success: false,
          error: `File ${file.name} exceeds the maximum size of 100MB`,
          fileName: file.name,
          fieldName
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fieldName', fieldName);
      formData.append('fileInfo', JSON.stringify(fileInfo));
      formData.append('HubspotCompanyId', process.env.REACT_APP_HUBSPOT_COMPANY_ID || '');
      formData.append('HubspotDealId', process.env.REACT_APP_HUBSPOT_DEAL_ID || '');
      formData.append('HubspotContactId', process.env.REACT_APP_HUBSPOT_CONTACT_ID || '');

      console.log(`Sending file ${file.name} (${fieldName}) to files endpoint`);

      const response = await fetch(process.env.REACT_APP_WEBHOOK_URL_FILES || '', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*"
        },
        body: formData,
      });

      if (response.status === 200) {
        return {
          success: true,
        };
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error sending file ${file.name}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fileName: file.name,
        fieldName
      };
    }
  };

  // Fonction principale pour gérer l'upload séparé
  const uploadToMake = async (formData: any, files: { [key: string]: File[] }): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress({});

    try {
      // 1. Envoyer d'abord les données du formulaire (sans fichiers)
      console.log("Step 1: Sending form data...");
      const formDataResult = await sendFormData(formData);
      
      if (!formDataResult.success) {
        return formDataResult;
      }

      // 2. Envoyer les fichiers individuellement
      console.log("Step 2: Sending files...");
      const fileResults: FileUploadResult[] = [];
      let totalFiles = 0;
      let processedFiles = 0;

      // Compter le nombre total de fichiers
      Object.values(files).forEach(fileList => {
        totalFiles += fileList.length;
      });

      // Traiter chaque fichier individuellement
      for (const [fieldName, fileList] of Object.entries(files)) {
        for (const file of fileList) {
          // Récupérer les informations du fichier depuis diligenceInfo
          const fileInfo = formData.diligenceInfo?.[fieldName]?.fileInfos?.find(
            (info: any) => info.name === file.name
          );

          const result = await sendFile(file, fieldName, fileInfo);
          fileResults.push(result);
          
          processedFiles++;
          // eslint-disable-next-line
          setUploadProgress(prev => ({
            ...prev,
            [fieldName]: Math.round((processedFiles / totalFiles) * 100)
          }));

          // Si un fichier échoue, on continue mais on note l'erreur
          if (!result.success) {
            console.warn(`File upload failed: ${result.fileName} - ${result.error}`);
          }
        }
      }

      // Vérifier s'il y a eu des erreurs
      const failedFiles = fileResults.filter(result => !result.success);
      
      if (failedFiles.length > 0) {
        console.warn(`${failedFiles.length} files failed to upload:`, failedFiles);
        return {
          success: false,
          error: `${failedFiles.length} files failed to upload. Check console for details.`
        };
      }

      return {
        success: true,
        response: {
          formData: formDataResult,
          files: fileResults
        }
      };

    } catch (error) {
      console.error('Error during upload process:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  return {
    isUploading,
    uploadToMake,
    uploadProgress
  };
}; 