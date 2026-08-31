import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDiligenceFiles } from '../../contexts/DiligenceFilesContext';
import { useValidation } from '../../contexts/ValidationContext';
import { useFileUpload } from '../../hooks/useFileUpload';
interface FileUploadFieldProps {
  field: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (fileInfos: any[]) => void;
  title?: React.ReactNode;
  uploadPeriods?: string[];
  required?: boolean;
  error?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  description,
  accept = ".pdf,.xlsx,.csv,.jpg,.png",
  multiple = true,
  className = "",
  onFilesChange,
  title = "",
  uploadPeriods,
  required = false,
  error = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{fileName: string, error: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { diligenceFiles, addFiles, removeFile, clearFiles, updateFileUploadStatus } = useDiligenceFiles(); 
  const { hasError, getFieldError, setFieldError } = useValidation();
  const { uploadFile } = useFileUpload();
  const companyName = useSelector((state: RootState) => state.form.formData.companyInfo.name);
  const hasFieldError = hasError(field);
  const fieldError = getFieldError(field);
  const GENERIC_UPLOAD_ERROR_UI = 'There is a server error, please contact Soundcheck support';
  const isFileTooLargeError = (message?: string) =>
    !!message &&
    (message.includes('File exceeds the maximum size of 10MB') ||
      message.includes('File too large for server'));
  const removeFailedFile = (fileIndex: number) => {
    removeFile(field as keyof typeof diligenceFiles, fileIndex);
    if (onFilesChange) {
      const newFileInfos = fileInfos.filter((_: any, i: number) => i !== fileIndex);
      onFilesChange(newFileInfos);
    }
  };
  const pushValidationErrors = (errors: Array<{fileName: string; error: string}>) => {
    setValidationErrors(prev => [...prev, ...errors]);
    setTimeout(() => {
      setValidationErrors([]);
    }, 10000);
  };

  // Constante locale pour la limite de taille (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

  // Fonction locale pour valider la taille des fichiers
  const validateFileSizeLocal = (file: File): boolean => {
    const sizeInBytes = file.size;
    const isValid = sizeInBytes <= MAX_FILE_SIZE;
    
    
    return isValid;
  };

  // Récupérer les fichiers et infos pour ce champ spécifique
  const fieldData = diligenceFiles[field as keyof typeof diligenceFiles];
  const files = fieldData?.files || [];
  const fileInfos = fieldData?.fileInfos || [];
  const uploadStatuses = fieldData?.uploadStatuses || [];
  
  // Filtrer les fichiers invalides (ceux qui ont été perdus après refresh)
  const validFiles = files.filter(file => 
    file && 
    file.name && 
    file.name !== 'undefined' && 
    file.size !== undefined && 
    file.size > 0
  );

  // Fonction pour valider le type de fichier selon les extensions acceptées
  const validateFileType = (file: File): { valid: boolean; error?: string } => {
    const acceptedExtensions = accept.split(',').map(ext => ext.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    
    const isValid = acceptedExtensions.some(ext => {
      // Gérer les extensions avec ou sans point
      const normalizedExt = ext.startsWith('.') ? ext : '.' + ext;
      return fileName.endsWith(normalizedExt);
    });
    
    if (!isValid) {
      return {
        valid: false,
        error: `File type not accepted. Accepted: ${accept}`
      };
    }
    
    return { valid: true };
  };

  // Fonction helper pour uploader un fichier immédiatement
  const uploadFileImmediately = async (file: File, fileIndex: number) => {
    // Valider le type de fichier
    const typeValidation = validateFileType(file);
    
    if (!typeValidation.valid) {
      console.error(`❌ [FileUpload] Type validation failed for ${file.name}:`, typeValidation.error);
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'error',
        error: typeValidation.error
      });
      return;
    }

    // Valider la taille du fichier
    const isValidSize = validateFileSizeLocal(file);
    
    if (!isValidSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      console.error(`❌ [FileUpload] Size validation failed for ${file.name}: ${sizeMB}MB > 10MB`);
      pushValidationErrors([
        {
          fileName: file.name,
          error: `File exceeds the maximum size of 10MB (${sizeMB}MB)`
        }
      ]);
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'error',
        error: `File exceeds the maximum size of 10MB (${sizeMB}MB)`
      });
      removeFailedFile(fileIndex);
      return;
    }

    // Marquer comme en cours d'upload
    updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
      status: 'uploading'
    });

    // Uploader le fichier
    const result = await uploadFile(file, field, companyName);

    // Mettre à jour le statut selon le résultat
    if (result.success) {
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'success'
      });
    } else {
      console.error(`❌ [FileUpload] Upload failed for ${file.name}:`, result.error);
      const uiError = isFileTooLargeError(result.error)
        ? result.error || 'Upload failed'
        : GENERIC_UPLOAD_ERROR_UI;
      pushValidationErrors([
        {
          fileName: file.name,
          error: uiError
        }
      ]);
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'error',
        error: uiError
      });
      removeFailedFile(fileIndex);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setIsProcessing(true);
      const fileArray = Array.from(selectedFiles);
      
      try {
        // ✅ VALIDER TOUS LES FICHIERS AVANT DE LES AJOUTER
        const validationResults = fileArray.map(file => {
          
          // Valider le type
          const typeValidation = validateFileType(file);
          if (!typeValidation.valid) {
            console.error(`❌ [FileUpload] Type validation failed for ${file.name}:`, typeValidation.error);
            return { file, valid: false, error: typeValidation.error };
          }
          
          // Valider la taille
          if (!validateFileSizeLocal(file)) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(2);
            const error = `File exceeds the maximum size of 10MB (${sizeMB}MB)`;
            console.error(`❌ [FileUpload] Size validation failed for ${file.name}:`, error);
            return { file, valid: false, error };
          }
          
          return { file, valid: true };
        });
        
        // Séparer les fichiers valides et invalides
        const validFiles = validationResults.filter(r => r.valid).map(r => r.file);
        const invalidFiles = validationResults.filter(r => !r.valid);
        
        // Afficher les erreurs pour les fichiers invalides
        if (invalidFiles.length > 0) {
          console.error(`❌ [FileUpload] ${invalidFiles.length} file(s) rejected:`, invalidFiles);
          
          // Stocker les erreurs pour affichage dans l'UI
          const errors = invalidFiles.map(f => ({
            fileName: f.file.name,
            error: f.error || 'Unknown error'
          }));
          pushValidationErrors(errors);
        }
        
        // Ne continuer que si on a des fichiers valides
        if (validFiles.length === 0) {
          console.warn(`⚠️ [FileUpload] No valid files to upload`);
          return;
        }
        
        
        const startIndex = multiple ? files.length : 0;
        
        // Ajouter UNIQUEMENT les fichiers valides au contexte
        if (multiple) {
          addFiles(field as keyof typeof diligenceFiles, validFiles);
        } else {
          clearFiles(field as keyof typeof diligenceFiles);
          addFiles(field as keyof typeof diligenceFiles, validFiles);
        }
        
        // Notify parent component about file changes
        if (onFilesChange) {
          const newFileInfos = validFiles.map((file, index) => ({
            id: `file-${Date.now()}-${index}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            data: file.arrayBuffer, 
          }));
          const updatedFileInfos = multiple ? [...fileInfos, ...newFileInfos] : newFileInfos;
          onFilesChange(updatedFileInfos);
          setFieldError(field, null);
        }

        // Uploader chaque fichier valide immédiatement et ATTENDRE la fin
        for (let i = 0; i < validFiles.length; i++) {
          const fileIndex = startIndex + i;
          await uploadFileImmediately(validFiles[i], fileIndex);
        }
      } finally {
        setIsProcessing(false);
        // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
        if (event.target) {
          event.target.value = '';
        }
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIsProcessing(true);
      const fileArray = Array.from(e.dataTransfer.files);
      
      try {
        // ✅ VALIDER TOUS LES FICHIERS AVANT DE LES AJOUTER
        const validationResults = fileArray.map(file => {
          
          // Valider le type
          const typeValidation = validateFileType(file);
          if (!typeValidation.valid) {
            console.error(`❌ [FileUpload] Type validation failed for ${file.name}:`, typeValidation.error);
            return { file, valid: false, error: typeValidation.error };
          }
          
          // Valider la taille
          if (!validateFileSizeLocal(file)) {
            const sizeMB = (file.size / 1024 / 1024).toFixed(2);
            const error = `File exceeds the maximum size of 10MB (${sizeMB}MB)`;
            console.error(`❌ [FileUpload] Size validation failed for ${file.name}:`, error);
            return { file, valid: false, error };
          }
          
          return { file, valid: true };
        });
        
        // Séparer les fichiers valides et invalides
        const validFiles = validationResults.filter(r => r.valid).map(r => r.file);
        const invalidFiles = validationResults.filter(r => !r.valid);
        
        // Afficher les erreurs pour les fichiers invalides
        if (invalidFiles.length > 0) {
          console.error(`❌ [FileUpload] ${invalidFiles.length} file(s) rejected:`, invalidFiles);
          
          // Stocker les erreurs pour affichage dans l'UI
          const errors = invalidFiles.map(f => ({
            fileName: f.file.name,
            error: f.error || 'Unknown error'
          }));
          pushValidationErrors(errors);
        }
        
        // Ne continuer que si on a des fichiers valides
        if (validFiles.length === 0) {
          console.warn(`⚠️ [FileUpload] No valid files to upload`);
          return;
        }
        
        
        const startIndex = multiple ? files.length : 0;
        
        // Ajouter UNIQUEMENT les fichiers valides au contexte
        if (multiple) {
          addFiles(field as keyof typeof diligenceFiles, validFiles);
        } else {
          clearFiles(field as keyof typeof diligenceFiles);
          addFiles(field as keyof typeof diligenceFiles, validFiles);
        }
        
        // Notify parent component about file changes
        if (onFilesChange) {
          const newFileInfos = validFiles.map((file, index) => ({
            id: `file-${Date.now()}-${index}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          }));
          const updatedFileInfos = multiple ? [...fileInfos, ...newFileInfos] : newFileInfos;
          onFilesChange(updatedFileInfos);
          setFieldError(field, null);
        }

        // Uploader chaque fichier valide immédiatement et ATTENDRE la fin
        for (let i = 0; i < validFiles.length; i++) {
          const fileIndex = startIndex + i;
          await uploadFileImmediately(validFiles[i], fileIndex);
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    // Trouver l'index réel dans le tableau original des fichiers
    const realIndex = files.findIndex(file => file === validFiles[index]);
    if (realIndex !== -1) {
      removeFile(field as keyof typeof diligenceFiles, realIndex);
      setFieldError(field, null);
      // Notify parent component about file changes
      if (onFilesChange) {
        const newFileInfos = fileInfos.filter((_: any, i: number) => i !== realIndex);
        onFilesChange(newFileInfos);
      }
    }
  };

  const handleClearAllFiles = () => {
    clearFiles(field as keyof typeof diligenceFiles);
    setFieldError(field, null);
    // Notify parent component about file changes
    if (onFilesChange) {
      onFilesChange([]);
    }
  };

 /*  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }; */

  return (  
    <div className={`flex flex-col w-full mb-6 ${className}`} data-field-name={field}>
      <h4 className="ml-1 text-left text-sm font-semibold text-[#1f2a37] leading-tight">{title}</h4>
      {uploadPeriods && uploadPeriods.length > 0 && (
        <p className="mt-1.5 ml-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-[#6b7280]">One file each for</span>
          {uploadPeriods.map((period) => (
            <span
              key={period}
              className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-900 ring-1 ring-orange-200/80"
            >
              {period}
            </span>
          ))}
        </p>
      )}
      {description && <p className="ml-1 text-left text-[13px] text-[#9aa3af] leading-tight mt-1" dangerouslySetInnerHTML={{ __html: description }} />}

      <div
        className={`relative border-[1.5px] border-dashed rounded-2xl px-5 py-4 mt-2 text-center transition-colors ${
          isProcessing
            ? 'border-violet-500 bg-violet-50 cursor-wait'
            : dragActive
              ? 'border-violet-500 bg-violet-50'
              : 'border-[#cfd5dd] bg-[#f7f8fa] hover:border-[#b8c0ca]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id={`file-upload-${field}`}
          disabled={isProcessing}
          title=""
        />
        
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2 py-1">
            <svg className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm text-blue-600 font-medium">Uploading... please wait</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 py-1">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-sm text-[#3f4a57]">
              <span className="font-semibold text-[#ef6b2f] hover:text-rose-500 transition-colors">Click to select</span>
              {' '}or drag & drop
              <span className="text-xs text-gray-400 ml-2">
                ({accept.split(',').map(ext => ext.trim()).join(', ')}{multiple && ', multiple'})
              </span>
            </div>
          </div>
        )}
      </div>
       {hasFieldError && <p className="text-red-500 text-xs mt-2">{fieldError}</p>} 

      {/* Messages d'erreur de validation */}
      {validationErrors.length > 0 && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm animate-fadeIn">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-red-800">
                {validationErrors.length} file{validationErrors.length > 1 ? 's' : ''} rejected
              </h3>
              <div className="mt-2 text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-start">
                    <span className="font-medium mr-2">•</span>
                    <div className="flex-1">
                      <span className="font-medium">{error.fileName}:</span>
                      <span className="ml-1">{error.error}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setValidationErrors([])}
              className="flex-shrink-0 ml-4 text-red-500 hover:text-red-700 transition-colors"
              title="Dismiss"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Zone d'affichage des fichiers sélectionnés */}
      {validFiles.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
              {validFiles.length} file{validFiles.length > 1 ? 's' : ''} selected
            </span>
            {validFiles.length > 1 && (
              <button onClick={handleClearAllFiles} className="text-[10px] text-red-400 hover:text-red-600">
                Remove all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {validFiles.map((file, index) => {
              const realIndex = files.findIndex(f => f === file);
              const uploadStatus = uploadStatuses[realIndex];
              const isError = uploadStatus?.status === 'error';
              const isSuccess = uploadStatus?.status === 'success';
              const isUploading = uploadStatus?.status === 'uploading';

              return (
                <div
                  key={`${file.name}-${index}`}
                  title={isError ? uploadStatus.error : file.name}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border max-w-[200px] ${
                    isError
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : isSuccess
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : isUploading
                          ? 'bg-blue-50 border-blue-200 text-blue-600'
                          : 'bg-green-50 border-green-200 text-green-700'
                  }`}
                >
                  {isUploading && (
                    <svg className="w-2.5 h-2.5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSuccess && <span className="flex-shrink-0">✓</span>}
                  {isError && <span className="flex-shrink-0">⚠</span>}
                  <span className="truncate">{file.name || 'Unknown file'}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="flex-shrink-0 ml-0.5 opacity-50 hover:opacity-100"
                    title="Remove"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* <div className='w-full border-b border-gray-200 mt-8'></div> */}
    </div>
  );
};

export default FileUploadField; 
