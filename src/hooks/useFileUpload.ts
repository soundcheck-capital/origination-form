import { useState } from 'react';

interface UploadResult {
  success: boolean;
  error?: string;
  response?: any;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToMake = async (formData: any, files: { [key: string]: File[] }): Promise<UploadResult> => {
    setIsUploading(true);

    try {
      // Créer un FormData pour envoyer les fichiers
      const formDataToSend = new FormData();

      // Ajouter les données du formulaire avec les fichiers intégrés
      const formDataWithFiles = {
        ...formData,
        files: files
      };

      formDataToSend.append('formData', JSON.stringify(formDataWithFiles));

      // Ajouter les fichiers individuellement
      Object.entries(files).forEach(([fieldName, fileList]) => {
        fileList.forEach((file, index) => {
          formDataToSend.append(`${fieldName}[${index}]`, file);
        });
      });

      // Envoyer à Make.com
      const response = await fetch(process.env.REACT_APP_WEBHOOK_URL || 'https://hook.us1.make.com/jgqcxlbrh75heny8znuyj8uel2de92hm', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.status === 200) {
        //const result = await response.json();
        return {
          success: true,
       //   response: result
        };
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadToMake
  };
}; 