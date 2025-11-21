import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { SKILL_STYLES } from '../../data';
import PortalTooltip from '../ui/PortalTooltip';

const CoreSkillCard = ({ 
    skill, 
    isSelected, 
    element,
    onToggle
}) => {
    const ElementIcon = element.icon;
    const designStyle = SKILL_STYLES[skill.bgType] || SKILL_STYLES.core;
    
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPos({
            top: rect.top,
            left: rect.left + (rect.width / 2)
        });
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <>
            <button
                onClick={onToggle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`
                    relative flex flex-col items-center justify-center border rounded-lg overflow-hidden transition-all duration-200 h-24 w-full group
                    ${isSelected 
                        ? `border-${element.textColor.split('-')[1]}-300 shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-[1.02]` 
                        : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}
                `}
                style={isSelected ? designStyle.style : {}}
            >
                <div className={`flex flex-col items-center justify-center w-full h-full ${!isSelected ? 'opacity-60' : ''}`}>
                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider z-20 border shadow-sm
                        ${isSelected 
                            ? `bg-white text-pink-600 border-transparent` 
                            : 'bg-slate-800 text-slate-500 border-slate-700'}
                    `}>
                        CORE
                    </div>

                    {isSelected && (
                        <div className="absolute top-1 right-1 text-white drop-shadow-md z-20 bg-black/20 rounded-full p-0.5">
                            <Check size={14} strokeWidth={3} />
                        </div>
                    )}

                    <div className="relative z-10 mb-1">
                        <ElementIcon className={`w-8 h-8 ${isSelected ? 'text-white drop-shadow-glow' : 'text-slate-600'}`} strokeWidth={1.5} />
                    </div>
                    
                    <div className="w-full px-1 text-center relative z-10">
                        <div className={`text-xs font-bold leading-tight line-clamp-2 py-1 px-1 rounded shadow-sm ${isSelected ? 'text-white bg-black/40' : 'text-slate-400 bg-black/20'}`}>
                            {skill.name}
                        </div>
                    </div>
                </div>
            </button>

            <PortalTooltip 
                title={skill.name}
                description={skill.description}
                visible={showTooltip}
                position={tooltipPos}
            />
        </>
    );
};

export default CoreSkillCard;