import React, { useState, useEffect } from 'react';
import { useDiligenceFiles } from '../contexts/DiligenceFilesContext';

interface FileLossNotificationProps {
  className?: string;
}

const FileLossNotification: React.FC<FileLossNotificationProps> = ({ className = '' }) => {
  const { diligenceFiles } = useDiligenceFiles();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Vérifier s'il y a des champs vides qui avaient des métadonnées (fichiers perdus)
    const hasLostFiles = Object.values(diligenceFiles).some(field => 
      field.fileInfos.length === 0 && field.files.length === 0
    );

    // Afficher la notification seulement si on vient de perdre des fichiers
    if (hasLostFiles) {
      setShowNotification(true);
      
      // Masquer la notification après 5 secondes
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [diligenceFiles]);

  if (!showNotification) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Note :</strong> Les fichiers uploadés précédemment ont été perdus lors du rechargement de la page. 
            Veuillez les re-uploader si nécessaire.
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setShowNotification(false)}
            className="text-blue-400 hover:text-blue-600"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileLossNotification; 