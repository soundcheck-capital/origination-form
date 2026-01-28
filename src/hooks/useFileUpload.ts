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

// Constante pour la limite de taille (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Fonction pour valider la taille des fichiers
  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      console.error(`File ${file.name} is too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max: 10MB)`);
      return false;
    }
    return true;
  };

  // Fonction publique pour uploader un seul fichier immédiatement
  const uploadFile = async (file: File, fieldName: string): Promise<FileUploadResult> => {
    return sendFile(file, fieldName, {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });
  };

  // Log "safe" pour vérifier la présence des variables sans exposer les valeurs
  const logEnvPresence = (context: string) => {
    console.log(`[env] ${context}`, {
      hubspotCompanyId: !!process.env.REACT_APP_HUBSPOT_COMPANY_ID,
      hubspotDealId: !!process.env.REACT_APP_HUBSPOT_DEAL_ID,
      hubspotDriveId: !!process.env.REACT_APP_HUBSPOT_DRIVE_ID,
      webhookUrl: !!process.env.REACT_APP_WEBHOOK_URL,
      webhookFilesUrl: !!process.env.REACT_APP_WEBHOOK_URL_FILES,
      emailSummaryUrl: !!process.env.REACT_APP_SEND_SUMMARY,
      calledFrom: !!process.env.REACT_APP_CALLED_FROM
    });
  };

  // Fonction pour envoyer les données du formulaire (sans fichiers)
  const sendFormData = async (formData: any): Promise<UploadResult> => {
    try {
      logEnvPresence('sendFormData');
      // Préparer les données communes (même payload pour les deux webhooks)
      const hubspotCompanyId = process.env.REACT_APP_HUBSPOT_COMPANY_ID;
      const hubspotDealId = process.env.REACT_APP_HUBSPOT_DEAL_ID;
      const calledFrom = process.env.REACT_APP_CALLED_FROM || 'local';

      // Vérifier que les IDs nécessaires au payload sont configurés
      if (!hubspotCompanyId || !hubspotDealId) {
        console.error('❌ [sendFormData] Missing HubSpot company/deal IDs in environment variables');
        throw new Error('Missing env vars for sendFormData: REACT_APP_HUBSPOT_COMPANY_ID and/or REACT_APP_HUBSPOT_DEAL_ID.');
      }

      const payload = {
        formData: formData,
        hubspotCompanyId: hubspotCompanyId,
        hubspotDealId: hubspotDealId,
        calledFrom: calledFrom
      };

      // URLs des webhooks
      const hubspotWebhookUrl = process.env.REACT_APP_WEBHOOK_URL;
      const emailSummaryWebhookUrl = process.env.REACT_APP_SEND_SUMMARY;

      // Log pour déboguer avec les URLs complètes
      console.log('📤 [sendFormData] Webhooks configuration:', {
        hubspotUrl: hubspotWebhookUrl || '❌ NOT CONFIGURED (REACT_APP_WEBHOOK_URL is empty)',
        emailSummaryUrl: emailSummaryWebhookUrl,
        hubspotConfigured: hubspotWebhookUrl ? '✅' : '❌',
        emailSummaryConfigured: emailSummaryWebhookUrl ? '✅' : '❌',
        payloadKeys: Object.keys(payload),
        formDataKeys: formData ? Object.keys(formData) : 'null'
      });

      // Vérifier que les URLs sont valides
      if (!hubspotWebhookUrl) {
        console.error('❌ [sendFormData] REACT_APP_WEBHOOK_URL is not configured! HubSpot webhook will fail.');
      }
      if (!emailSummaryWebhookUrl) {
        console.error('❌ [sendFormData] REACT_APP_SEND_SUMMARY is not configured and no fallback URL!');
      }

      // Préparer les promesses de fetch pour les deux webhooks
      const fetchPromises: Promise<Response>[] = [];

      // Webhook HubSpot (envoi du formData sur HubSpot)
      if (hubspotWebhookUrl) {
        console.log('📡 [sendFormData] Calling HubSpot webhook:', hubspotWebhookUrl);
        fetchPromises.push(
          fetch(hubspotWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(payload)
          }).catch(error => {
            console.error('❌ [sendFormData] HubSpot webhook error:', error);
            throw error;
          })
        );
      } else {
        console.warn('⚠️ [sendFormData] HubSpot webhook URL is empty, skipping...');
        // Créer une réponse factice pour maintenir la structure
        fetchPromises.push(Promise.resolve(new Response(null, { status: 200, statusText: 'Skipped (no URL)' })));
      }

      // Webhook Email Summary (envoi du summary par mail)
      if (emailSummaryWebhookUrl) {
        console.log('📡 [sendFormData] Calling Email Summary webhook:', emailSummaryWebhookUrl);
        fetchPromises.push(
          fetch(emailSummaryWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(payload)
          }).catch(error => {
            console.error('❌ [sendFormData] Email summary webhook error:', error);
            throw error;
          })
        );
      } else {
        console.warn('⚠️ [sendFormData] Email Summary webhook URL is empty, skipping...');
        // Créer une réponse factice pour maintenir la structure
        fetchPromises.push(Promise.resolve(new Response(null, { status: 200, statusText: 'Skipped (no URL)' })));
      }

      // Appeler les deux webhooks en parallèle
      const [hubspotResponse, emailResponse] = await Promise.all(fetchPromises);

      // Vérifier les deux réponses
      const hubspotSuccess = hubspotResponse.status === 200;
      const emailSuccess = emailResponse.status === 200;

      // Log des réponses pour déboguer
      console.log('📥 [sendFormData] Webhook responses:', {
        hubspot: {
          status: hubspotResponse.status,
          statusText: hubspotResponse.statusText,
          success: hubspotSuccess,
          url: hubspotWebhookUrl
        },
        emailSummary: {
          status: emailResponse.status,
          statusText: emailResponse.statusText,
          success: emailSuccess,
          url: emailSummaryWebhookUrl
        }
      });

      // Essayer de lire les réponses pour plus de détails (cloner pour ne pas consommer le body)
      try {
        const hubspotClone = hubspotResponse.clone();
        const hubspotText = await hubspotClone.text();
        console.log('📄 [sendFormData] HubSpot response:', hubspotText.substring(0, 200));
      } catch (e) {
        console.warn('⚠️ [sendFormData] Could not read HubSpot response:', e);
      }

      try {
        const emailClone = emailResponse.clone();
        const emailText = await emailClone.text();
        console.log('📄 [sendFormData] Email summary response:', emailText.substring(0, 200));
      } catch (e) {
        console.warn('⚠️ [sendFormData] Could not read Email summary response:', e);
      }

      if (hubspotSuccess && emailSuccess) {
        return {
          success: true,
        };
      } else {
        // Si au moins un a échoué, on log l'erreur mais on considère le submit comme réussi
        // car les deux appels sont indépendants
        if (!hubspotSuccess) {
          console.warn('⚠️ [sendFormData] HubSpot webhook failed:', hubspotResponse.status, hubspotResponse.statusText);
        }
        if (!emailSuccess) {
          console.warn('⚠️ [sendFormData] Email summary webhook failed:', emailResponse.status, emailResponse.statusText);
        }
        // On retourne success true car les deux appels sont indépendants
        // et on ne veut pas bloquer le submit si un seul échoue
        return {
          success: true,
        };
      }
    } catch (error) {
      console.error('Error sending form data:', error);
      // Même en cas d'erreur, on considère le submit comme réussi
      // car les deux appels sont indépendants et ne doivent pas bloquer le submit
      return {
        success: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Mapping des champs vers leurs dossiers Google Drive
  const getGoogleDriveFolders = (fieldName: string): { folder: string; subFolder: string } => {
    const folderMapping: { [key: string]: { folder: string; subFolder: string } } = {
      // Ticketing Information
      'ticketingCompanyReport': { folder: 'Ticketing Information', subFolder: 'Ticketing Report' },
      'ticketingServiceAgreement': { folder: 'Ticketing Information', subFolder: 'Service Agreement' },
      
      // Financial Information
      'financialStatements': { folder: 'Financial Information', subFolder: 'Financial Statements' },
      'bankStatement': { folder: 'Financial Information', subFolder: 'Bank Statements' },
      'lastYearTaxes': { folder: 'Financial Information', subFolder: 'Last Year Taxes' },
      
      // Legal Information
      'incorporationCertificate': { folder: 'Legal Information', subFolder: 'Incorporation Certificate' },
      'legalEntityChart': { folder: 'Legal Information', subFolder: 'Legal Entity Chart' },
      'governmentId': { folder: 'Legal Information', subFolder: 'Government ID' },
      'w9form': { folder: 'Legal Information', subFolder: 'W9 Form' },
      
      // Other
      'other': { folder: 'Other Documents', subFolder: 'Other' },
    };

    return folderMapping[fieldName] || { folder: 'Other Documents', subFolder: 'Uncategorized' };
  };

  // Fonction pour envoyer un fichier individuel
  const sendFile = async (file: File, fieldName: string, fileInfo: any): Promise<FileUploadResult> => {
    try {
      console.log(`🚀 [useFileUpload] Sending file ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) to ${fieldName}`);
      logEnvPresence('sendFile');
      
      // Valider la taille du fichier
      if (!validateFileSize(file)) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);
        console.error(`❌ [useFileUpload] Client-side validation failed: ${sizeMB}MB > 10MB`);
        return {
          success: false,
          error: `File exceeds the maximum size of 10MB (${sizeMB}MB)`,
          fileName: file.name,
          fieldName
        };
      }

      // Récupérer les informations de dossier Google Drive
      const { folder, subFolder } = getGoogleDriveFolders(fieldName);
      console.log(`📁 [useFileUpload] Google Drive location: ${folder}/${subFolder}`);

      // Récupérer les IDs HubSpot depuis les variables d'environnement
      const hubspotCompanyId = process.env.REACT_APP_HUBSPOT_COMPANY_ID;
      const hubspotDealId = process.env.REACT_APP_HUBSPOT_DEAL_ID;
      const driveId = process.env.REACT_APP_HUBSPOT_DRIVE_ID;
      const webhookFilesUrl = process.env.REACT_APP_WEBHOOK_URL_FILES;

      // Vérifier que les IDs nécessaires à l'upload sont configurés
      if (!hubspotCompanyId || !hubspotDealId) {
        console.error('❌ [useFileUpload] Missing HubSpot company/deal IDs in environment variables');
        return {
          success: false,
          error: 'Missing env vars for file upload: REACT_APP_HUBSPOT_COMPANY_ID and/or REACT_APP_HUBSPOT_DEAL_ID.',
          fileName: file.name,
          fieldName
        };
      }

      if (!webhookFilesUrl) {
        console.error('❌ [useFileUpload] REACT_APP_WEBHOOK_URL_FILES is not configured!');
        return {
          success: false,
          error: 'Missing env var for file upload: REACT_APP_WEBHOOK_URL_FILES.',
          fileName: file.name,
          fieldName
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fieldName', fieldName);
      formData.append('folder', folder);
      formData.append('subFolder', subFolder);
      formData.append('hubspotCompanyId', hubspotCompanyId);
      formData.append('hubspotDealId', hubspotDealId);
      formData.append('driveId', driveId || '');

      console.log(`📡 [useFileUpload] Fetching ${webhookFilesUrl}`);
      
      const response = await fetch(webhookFilesUrl, {
        method: 'POST',
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: formData
      });

      console.log(`📥 [useFileUpload] Response status: ${response.status} ${response.statusText}`);

      if (response.status === 200) {
        console.log(`✅ [useFileUpload] File ${file.name} uploaded successfully`);
        return {
          success: true,
        };
      } else {
        // Gestion spécifique des codes d'erreur HTTP
        let errorMessage = '';
        
        switch (response.status) {
          case 413:
            const sizeMB = (file.size / 1024 / 1024).toFixed(2);
            errorMessage = `File too large for server (${sizeMB}MB). Server limit exceeded.`;
            break;
          case 400:
            errorMessage = `Invalid file or request`;
            break;
          case 415:
            errorMessage = `File type not supported by server`;
            break;
          case 500:
            errorMessage = `Server error while processing file`;
            break;
          case 503:
            errorMessage = `Service temporarily unavailable`;
            break;
          default:
            errorMessage = `Upload failed (HTTP ${response.status})`;
        }
        
        // Essayer de récupérer un message d'erreur du serveur
        try {
          const responseText = await response.text();
          console.error(`❌ [useFileUpload] Server response:`, responseText);
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
        } catch (e) {
          // Ignorer si on ne peut pas lire la réponse
        }
        
        console.error(`❌ [useFileUpload] Upload failed:`, errorMessage);
        
        return {
          success: false,
          error: errorMessage,
          fileName: file.name,
          fieldName
        };
      }
    } catch (error) {
      console.error(`❌ [useFileUpload] Exception sending file ${file.name}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
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
      const formDataResult = await sendFormData(formData);
      
      if (!formDataResult.success) {
        return formDataResult;
      }

      // 2. Envoyer les fichiers individuellement
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
    uploadProgress,
    uploadFile,
    validateFileSize,
    sendFormData
  };
}; 
