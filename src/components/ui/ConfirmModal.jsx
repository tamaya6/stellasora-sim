import React from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, isDestructive = false }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-3">{t('confirm.title')}</h3>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{message}</p>
                </div>
                <div className="flex border-t border-slate-800 divide-x divide-slate-800">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        {t('confirm.cancel')}
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${isDestructive ? 'text-red-400 hover:bg-red-950/30 hover:text-red-300' : 'text-indigo-400 hover:bg-indigo-950/30 hover:text-indigo-300'}`}
                    >
                        {t('confirm.execute')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;