
import React from 'react';
import { XIcon } from './Icons';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-modal-title"
    >
      <div 
        className="relative p-4 bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-4xl w-11/12 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 id="image-modal-title" className="sr-only">Enlarged Image View</h2>
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-slate-600 text-white rounded-full p-2 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white z-10"
          aria-label="Close image view"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <div className="flex justify-center items-center h-full">
            <img 
                src={imageUrl} 
                alt="Enlarged view" 
                className="max-w-full max-h-[85vh] object-contain"
            />
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
       `}</style>
    </div>
  );
};

export default ImageModal;
