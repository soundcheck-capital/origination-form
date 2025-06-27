import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateDiligenceInfo } from '../../store/form/formSlice';

interface FileUploadFieldProps {
  field: string;
  description: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  description,
  accept = ".pdf,.xlsx,.csv,.jpg,.png",
  multiple = true,
  className = ""
}) => {
  const dispatch = useDispatch();
  const diligenceInfo = useSelector((state: RootState) => state.form.diligenceInfo);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Récupérer les fichiers actuels depuis le store
  const currentFiles = diligenceInfo[field as keyof typeof diligenceInfo] as File[] || [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      if (multiple) {
        // Ajouter aux fichiers existants
        const allFiles = [...currentFiles, ...fileArray];
        dispatch(updateDiligenceInfo({ [field]: allFiles }));
      } else {
        // Remplacer les fichiers existants
        dispatch(updateDiligenceInfo({ [field]: fileArray }));
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileArray = Array.from(e.dataTransfer.files);
      if (multiple) {
        const allFiles = [...currentFiles, ...fileArray];
        dispatch(updateDiligenceInfo({ [field]: allFiles }));
      } else {
        dispatch(updateDiligenceInfo({ [field]: fileArray }));
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = currentFiles.filter((_, i) => i !== index);
    dispatch(updateDiligenceInfo({ [field]: newFiles }));
  };

  const clearAllFiles = () => {
    dispatch(updateDiligenceInfo({ [field]: [] }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex flex-col w-full mb-8 ${className}`}>
      <p className="upload-description text-sm font-300 text-gray-700 mb-2">
        {description}
      </p>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
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
        />
        
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
              Cliquez pour sélectionner
            </span>
            {' '}ou glissez-déposez vos fichiers ici
          </div>
          
          <p className="text-xs text-gray-500">
            {accept.split(',').map(ext => ext.trim()).join(', ')} acceptés
            {multiple && ' (plusieurs fichiers possibles)'}
          </p>
        </div>
      </div>
      
      {/* Zone d'affichage des fichiers sélectionnés */}
      {currentFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Fichiers sélectionnés ({currentFiles.length})
            </h4>
            {currentFiles.length > 1 && (
              <button
                onClick={clearAllFiles}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Tout supprimer
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {currentFiles.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type || 'Type inconnu'}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2 flex-shrink-0"
                  title="Supprimer le fichier"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadField; 