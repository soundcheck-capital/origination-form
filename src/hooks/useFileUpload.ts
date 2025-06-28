import { useState, useCallback } from 'react';
import { FileInfo } from '../store/form/formTypes';

interface UseFileUploadReturn {
  files: File[];
  fileInfos: FileInfo[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  getFileInfos: () => FileInfo[];
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [files, setFiles] = useState<File[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const getFileInfos = useCallback((): FileInfo[] => {
    return files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));
  }, [files]);

  const fileInfos = getFileInfos();

  return {
    files,
    fileInfos,
    addFiles,
    removeFile,
    clearFiles,
    getFileInfos,
  };
}; 