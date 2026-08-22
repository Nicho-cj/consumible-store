import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
    // Cerrar modal con la tecla ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            {/* Overlay click para cerrar */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Contenedor Modal */}
            <div className={`relative bg-white w-full ${maxWidth} rounded-lg shadow-xl border border-[#E2E8F0] z-10 my-8 flex flex-col max-h-[90vh]`}>
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
                    <h3 className="font-bold text-slate-800 text-base">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (con scroll si el contenido es largo) */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;