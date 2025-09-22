"use client";

import React from 'react';

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onChange,
  children
}) => {
  const handleOpenChange = (open: boolean) => {
    if (onChange) {
      onChange(open);
    }
    if (!open) {
      onClose();
    }
  };

  return (
    <dialog 
      open={isOpen} 
      onClose={() => handleOpenChange(false)}
      className="fixed inset-0 z-50 w-full h-full bg-transparent p-0 m-0"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => handleOpenChange(false)}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {description}
              </p>
            </div>
            <button
              onClick={() => handleOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;