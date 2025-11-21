import React from 'react';
import { createPortal } from 'react-dom';

const PortalTooltip = ({ title, description, visible, position }) => {
    if (!visible) return null;

    return createPortal(
        <div 
            className="fixed z-[9999] w-64 bg-slate-800 text-white text-xs rounded-lg shadow-2xl p-3 border border-slate-600 pointer-events-none"
            style={{ 
                top: position.top - 8, 
                left: position.left,
                transform: 'translate(-50%, -100%)'
            }}
        >
            <div className="font-bold text-sm mb-1 text-yellow-400">{title}</div>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-left">{description}</div>
            {/* 矢印 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-600"></div>
        </div>,
        document.body
    );
};

export default PortalTooltip;