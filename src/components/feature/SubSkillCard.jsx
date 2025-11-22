import React, { useState } from 'react';
import { Sparkles, GripVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SKILL_STYLES } from '../../data';
import PortalTooltip from '../ui/PortalTooltip';

const SubSkillCard = ({ 
    skill, 
    value, 
    priority, 
    element,
    onChange, 
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    isDragging 
}) => {
    const { t } = useTranslation();
    const isAcquired = value > 0;
    const designStyle = SKILL_STYLES[skill.bgType] || SKILL_STYLES.normal;

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    const handleLevelChange = (delta) => {
        const next = Math.min(6, Math.max(0, value + delta));
        onChange({ level: next, priority });
    };

    const handlePriorityChange = (newPriority) => {
        onChange({ level: value, priority: newPriority });
    };

    const handleMouseEnter = (e) => {
        if (isDragging) return;
        
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

    const priorityColors = {
        high: 'bg-red-500 text-white border-red-400',
        medium: 'bg-amber-500 text-black border-amber-400',
        low: 'bg-blue-500 text-white border-blue-400',
        none: 'bg-gray-700 text-gray-400 border-gray-600'
    };
    
    // priorityLabel定数を削除し、直接翻訳キーを使用します
    const ElementIcon = element.icon;

    return (
        <>
            <div 
                className={`
                    relative flex flex-col border rounded-lg overflow-visible transition-all duration-200 h-40 group
                    ${isAcquired ? 'border-slate-400 shadow-lg' : 'border-slate-700 bg-slate-900/80'} 
                    ${isDragging ? 'opacity-40 ring-2 ring-indigo-500 scale-95' : 'hover:border-slate-400'}
                `}
                draggable={true}
                onDragStart={(e) => {
                    setShowTooltip(false);
                    onDragStart(e);
                }}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
            >
                <div 
                    className={`flex-1 w-full flex flex-col items-center justify-center relative transition-all duration-300 py-2 rounded-t-lg ${!isAcquired ? 'bg-slate-900' : ''} cursor-grab active:cursor-grabbing`}
                    style={isAcquired ? designStyle.style : {}}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className={`flex flex-col items-center justify-center w-full h-full ${!isAcquired ? 'opacity-60' : ''}`}>
                        {isAcquired && skill.bgType === 'special' && (
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-overlay">
                                <Sparkles className="absolute top-1 left-1 w-3 h-3 text-white animate-pulse" />
                                <Sparkles className="absolute bottom-2 right-2 w-2 h-2 text-white animate-pulse delay-75" />
                            </div>
                        )}

                        <div className="absolute top-1 right-1 p-0.5 text-white/70 bg-black/20 rounded pointer-events-none z-20">
                            <GripVertical size={12} />
                        </div>

                        <div className="mb-1">
                            {isAcquired ? (
                                <div className="relative z-10">
                                    <ElementIcon className="w-8 h-8 text-white drop-shadow-glow" strokeWidth={2} />
                                </div>
                            ) : (
                                <div className="text-slate-400 text-xs font-bold pointer-events-none py-1 px-2 bg-black/40 rounded">{t('card.unacquired')}</div>
                            )}
                        </div>
                        
                        <div className="w-full px-1 text-center z-10 mt-auto">
                            <div className={`text-sm font-bold leading-tight line-clamp-2 py-1 px-0.5 rounded ${isAcquired ? 'text-white bg-black/40' : 'text-slate-400 bg-black/20'}`}>
                                {skill.name}
                            </div>
                        </div>
                    </div>
                </div>

                <div 
                    className={`h-[4.5rem] p-1.5 flex flex-col gap-1.5 cursor-default bg-slate-900 border-t border-slate-700 relative z-20 rounded-b-lg ${!isAcquired ? 'opacity-60' : ''}`}
                    draggable={true}
                    onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <div className="flex items-center justify-between bg-slate-950 rounded px-0.5 border border-slate-800 h-6">
                        <button onClick={() => handleLevelChange(-1)} className="w-6 h-full flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-white text-sm font-bold">-</button>
                        <span className={`text-lg font-mono font-bold leading-none flex items-baseline ${value === 6 ? 'text-yellow-400' : 'text-white'}`}>
                            {value}<span className="text-xs text-slate-500 ml-0.5">/6</span>
                        </span>
                        <button onClick={() => handleLevelChange(1)} className={`w-6 h-full flex items-center justify-center rounded text-white text-sm font-bold ${value >= 6 ? 'bg-slate-900 text-slate-600' : 'bg-slate-800 hover:bg-slate-700'}`} disabled={value >= 6}>+</button>
                    </div>

                    <div className={`grid grid-cols-3 gap-0.5 text-xs transition-opacity duration-200 ${isAcquired ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                        {['high', 'medium', 'low'].map(p => (
                            <button
                                key={p}
                                onClick={() => handlePriorityChange(p)}
                                className={`py-0.5 rounded border transition-colors text-center font-medium ${priority === p ? priorityColors[p] : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}
                            >
                                {t(`priority.${p}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <PortalTooltip 
                title={skill.name}
                description={skill.description}
                visible={showTooltip && !isDragging}
                position={tooltipPos}
            />
        </>
    );
};

export default SubSkillCard;