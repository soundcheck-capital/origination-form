import React, { useState, useRef } from 'react';
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
  title?: string;
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
  const hasFieldError = hasError(field);
  const fieldError = getFieldError(field);

  // Constante locale pour la limite de taille (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes

  // Fonction locale pour valider la taille des fichiers
  const validateFileSizeLocal = (file: File): boolean => {
    const sizeInBytes = file.size;
    const sizeMB = (sizeInBytes / 1024 / 1024).toFixed(2);
    const maxSizeMB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(2);
    const isValid = sizeInBytes <= MAX_FILE_SIZE;
    
    console.log(`🔍 [FileUpload] ====== SIZE VALIDATION ======`);
    console.log(`🔍 [FileUpload] File: ${file.name}`);
    console.log(`🔍 [FileUpload] Size in bytes: ${sizeInBytes}`);
    console.log(`🔍 [FileUpload] Size in MB: ${sizeMB}`);
    console.log(`🔍 [FileUpload] Max size in bytes: ${MAX_FILE_SIZE}`);
    console.log(`🔍 [FileUpload] Max size in MB: ${maxSizeMB}`);
    console.log(`🔍 [FileUpload] Is valid (${sizeInBytes} <= ${MAX_FILE_SIZE}): ${isValid}`);
    console.log(`🔍 [FileUpload] ============================`);
    
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
    console.log(`📤 [FileUpload] Starting upload for file: ${file.name}, index: ${fileIndex}`);
    console.log(`📤 [FileUpload] File details:`, {
      name: file.name,
      size: file.size,
      sizeMB: (file.size / 1024 / 1024).toFixed(2),
      type: file.type,
      field: field,
      fileIndex: fileIndex
    });
    
    // Valider le type de fichier
    const typeValidation = validateFileType(file);
    console.log(`🔍 [FileUpload] Type validation result:`, typeValidation);
    
    if (!typeValidation.valid) {
      console.error(`❌ [FileUpload] Type validation failed for ${file.name}:`, typeValidation.error);
      console.log(`🔄 [FileUpload] Calling updateFileUploadStatus with error...`);
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'error',
        error: typeValidation.error
      });
      console.log(`✓ [FileUpload] Status update called`);
      return;
    }

    // Valider la taille du fichier
    const isValidSize = validateFileSizeLocal(file);
    console.log(`🔍 [FileUpload] Size validation result:`, isValidSize);
    
    if (!isValidSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      console.error(`❌ [FileUpload] Size validation failed for ${file.name}: ${sizeMB}MB > 10MB`);
      console.log(`🔄 [FileUpload] Calling updateFileUploadStatus with error...`);
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'error',
        error: `File exceeds the maximum size of 10MB (${sizeMB}MB)`
      });
      console.log(`✓ [FileUpload] Status update called`);
      return;
    }

    // Marquer comme en cours d'upload
    console.log(`⏳ [FileUpload] All validations passed. Uploading ${file.name}...`);
    updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
      status: 'uploading'
    });

    // Uploader le fichier
    console.log(`🌐 [FileUpload] Calling uploadFile hook...`);
    const result = await uploadFile(file, field);
    console.log(`🌐 [FileUpload] uploadFile result:`, result);

    // Mettre à jour le statut selon le résultat
    if (result.success) {
      console.log(`✅ [FileUpload] Upload successful for ${file.name}`);
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'success'
      });
    } else {
      console.error(`❌ [FileUpload] Upload failed for ${file.name}:`, result.error);
      console.log(`🔄 [FileUpload] Setting error status:`, {
        field: field,
        fileIndex: fileIndex,
        error: result.error
      });
      updateFileUploadStatus(field as keyof typeof diligenceFiles, fileIndex, {
        status: 'error',
        error: result.error || 'Upload failed'
      });
      console.log(`✓ [FileUpload] Error status set`);
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
          console.log(`🔍 [FileUpload] Pre-validating file: ${file.name}`);
          
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
          
          console.log(`✅ [FileUpload] File ${file.name} passed validation`);
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
          setValidationErrors(errors);
          
          // Effacer les erreurs après 10 secondes
          setTimeout(() => {
            setValidationErrors([]);
          }, 10000);
        }
        
        // Ne continuer que si on a des fichiers valides
        if (validFiles.length === 0) {
          console.warn(`⚠️ [FileUpload] No valid files to upload`);
          return;
        }
        
        console.log(`✅ [FileUpload] ${validFiles.length} valid file(s) to upload`);
        
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
          console.log(`🔍 [FileUpload] Pre-validating dropped file: ${file.name}`);
          
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
          
          console.log(`✅ [FileUpload] File ${file.name} passed validation`);
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
          setValidationErrors(errors);
          
          // Effacer les erreurs après 10 secondes
          setTimeout(() => {
            setValidationErrors([]);
          }, 10000);
        }
        
        // Ne continuer que si on a des fichiers valides
        if (validFiles.length === 0) {
          console.warn(`⚠️ [FileUpload] No valid files to upload`);
          return;
        }
        
        console.log(`✅ [FileUpload] ${validFiles.length} valid file(s) to upload`);
        
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

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (  
    <div className={`flex flex-col w-full mb-16 ${className}`}>
      <h4 className=" text-md font-medium text-neutral-900 leading-tight ">{title} {required && <span className="text-red-500">*</span>}</h4>
      {description && <p className=" text-xs font-300 text-gray-500" dangerouslySetInnerHTML={{ __html: description }} />}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 mt-4 text-center transition-colors ${
          isProcessing
            ? 'border-blue-500 bg-blue-50 cursor-wait'
            : dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
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
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="text-sm text-blue-600 font-medium">
              Processing and uploading files...
            </div>
            <p className="text-xs text-gray-500">
              Please wait
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">
                Click to select
              </span>
              {' '}or drag and drop your files here
            </div>
            
            <p className="text-xs text-gray-500">
              {accept.split(',').map(ext => ext.trim()).join(', ')} accepted
              {multiple && ' (multiple files accepted)'}
            </p>
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
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected files ({validFiles.length})
            </h4>
            {validFiles.length > 1 && (
              <button
                onClick={handleClearAllFiles}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove all
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {validFiles.map((file, index) => {
              const realIndex = files.findIndex(f => f === file);
              const uploadStatus = uploadStatuses[realIndex];
              
              // Debug log
              console.log(`🔍 [FileUpload] Rendering file ${file.name}:`, {
                realIndex,
                uploadStatus,
                allStatuses: uploadStatuses
              });
              
              return (
                <div 
                  key={`${file.name}-${index}`}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    uploadStatus?.status === 'error' 
                      ? 'bg-red-50 border-red-300' 
                      : uploadStatus?.status === 'success'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Icône de statut */}
                    {uploadStatus?.status === 'uploading' && (
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {uploadStatus?.status === 'success' && (
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {uploadStatus?.status === 'error' && (
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {(!uploadStatus || uploadStatus.status === 'pending') && (
                      <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        uploadStatus?.status === 'error' ? 'text-red-700' : 'text-gray-700'
                      }`}>
                        {file.name || 'Unknown file'}
                      </p>
                      <p className={`text-xs ${
                        uploadStatus?.status === 'error' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                        {uploadStatus?.status === 'uploading' && ' • Uploading...'}
                        {uploadStatus?.status === 'success' && ' • ✓ Uploaded'}
                      </p>
                      {uploadStatus?.status === 'error' && (
                        <p className="text-xs text-red-600 font-semibold mt-1">
                          ⚠️ {uploadStatus.error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700 p-1 ml-2 flex-shrink-0"
                    title="Remove file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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