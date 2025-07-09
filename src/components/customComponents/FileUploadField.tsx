import React, { useState, useRef } from 'react';
import { useDiligenceFiles } from '../../contexts/DiligenceFilesContext';

interface FileUploadFieldProps {
  field: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (fileInfos: any[]) => void;
  title?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  description,
  accept = ".pdf,.xlsx,.csv,.jpg,.png",
  multiple = true,
  className = "",
  onFilesChange,
  title = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { diligenceFiles, addFiles, removeFile, clearFiles } = useDiligenceFiles(); 

  // Récupérer les fichiers et infos pour ce champ spécifique
  const fieldData = diligenceFiles[field as keyof typeof diligenceFiles];
  const files = fieldData?.files || [];
  const fileInfos = fieldData?.fileInfos || [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      if (multiple) {
        addFiles(field as keyof typeof diligenceFiles, fileArray);
      } else {
        clearFiles(field as keyof typeof diligenceFiles);
        addFiles(field as keyof typeof diligenceFiles, fileArray);
      }
      
      // Notify parent component about file changes
      if (onFilesChange) {
        const newFileInfos = fileArray.map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          data: file.arrayBuffer, 
        }));
        const updatedFileInfos = multiple ? [...fileInfos, ...newFileInfos] : newFileInfos;
        onFilesChange(updatedFileInfos);
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
        addFiles(field as keyof typeof diligenceFiles, fileArray);
      } else {
        clearFiles(field as keyof typeof diligenceFiles);
        addFiles(field as keyof typeof diligenceFiles, fileArray);
      }
      
      // Notify parent component about file changes
      if (onFilesChange) {
        const newFileInfos = fileArray.map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }));
        const updatedFileInfos = multiple ? [...fileInfos, ...newFileInfos] : newFileInfos;
        onFilesChange(updatedFileInfos);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    removeFile(field as keyof typeof diligenceFiles, index);
    
    // Notify parent component about file changes
    if (onFilesChange) {
      const newFileInfos = fileInfos.filter((_: any, i: number) => i !== index);
      onFilesChange(newFileInfos);
    }
  };

  const handleClearAllFiles = () => {
    clearFiles(field as keyof typeof diligenceFiles);
    
    // Notify parent component about file changes
    if (onFilesChange) {
      onFilesChange([]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (  
    <div className={`flex flex-col w-full mb-16 ${className}`}>
      <h4 className=" text-xl font-medium text-neutral-900 ">{title}</h4>
      {description && <p className=" text-xs font-300 text-gray-500" dangerouslySetInnerHTML={{ __html: description }} />}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 mt-4 text-center transition-colors ${
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
              Click to select
            </span>
            {' '}or drag and drop your files here
          </div>
          
          <p className="text-xs text-gray-500">
            {accept.split(',').map(ext => ext.trim()).join(', ')} accepted
            {multiple && ' (multiple files accepted)'}
          </p>
        </div>
      </div>
      
      {/* Zone d'affichage des fichiers sélectionnés */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected files ({files.length})
            </h4>
            {files.length > 1 && (
              <button
                onClick={handleClearAllFiles}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove all
              </button>
            )}
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
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
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
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
            ))}
          </div>
        </div>
      )}
      {/* <div className='w-full border-b border-gray-200 mt-8'></div> */}
    </div>
  );
};

export default FileUploadField; 