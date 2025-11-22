import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    const styles = {
        success: "bg-green-900/90 border-green-500 text-green-100",
        error: "bg-red-900/90 border-red-500 text-red-100",
        info: "bg-slate-800/90 border-slate-500 text-slate-100"
    };

    const icons = {
        success: <CheckCircle2 size={18} className="text-green-400" />,
        error: <AlertCircle size={18} className="text-red-400" />,
        info: <AlertCircle size={18} className="text-blue-400" />
    };

    return createPortal(
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[10002] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md min-w-[300px] max-w-md ${styles[type] || styles.info}`}>
                <div className="flex-shrink-0">
                    {icons[type] || icons.info}
                </div>
                <div className="flex-1 text-sm font-medium">
                    {message}
                </div>
                <button 
                    onClick={onClose}
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default Toast;