import React, { useState } from 'react';
import { Clock, Trash2, Download, Save, FilePlus } from 'lucide-react';
import { CHARACTERS } from '../../data';
import { useTranslation } from 'react-i18next';

const SaveSlot = ({ index, data, onSave, onLoad, onDelete, onConfirmDelete }) => {
    const { t } = useTranslation();
    const hasData = !!data;
    const [isSaved, setIsSaved] = useState(false);
    
    const getCharIcon = (charId) => {
        const char = CHARACTERS.find(c => c.id === charId);
        if (!char) return null;
        const Icon = char.element.icon;
        return (
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${char.element.color} flex items-center justify-center border border-white/20`}>
                <Icon size={10} className="text-white" />
            </div>
        );
    };

    const handleSave = () => {
        onSave();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className={`
            relative flex flex-col p-3 rounded-lg border transition-all duration-200 h-32
            ${hasData 
                ? 'bg-slate-800 border-slate-600 hover:border-slate-500 shadow-lg' 
                : 'bg-slate-900/50 border-slate-800 border-dashed hover:border-slate-600 hover:bg-slate-800/50'}
        `}>
            <div className="flex justify-between items-start mb-1">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 leading-none mb-1">DATA {index + 1}</span>
                    {hasData && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock size={9} />
                            <span className="truncate">{data.timestamp}</span>
                        </div>
                    )}
                </div>
                {hasData && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onConfirmDelete(); }}
                        className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-slate-700 -mt-1 -mr-1"
                        title={t('delete')}
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>

            {hasData ? (
                <>
                    <div className="flex-1">
                        <div className="flex gap-1.5 mt-1">
                            {data.party.map((slot, i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center overflow-hidden">
                                    {slot.charId ? getCharIcon(slot.charId) : <span className="text-[8px] text-slate-600">-</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                        <button
                            onClick={onLoad}
                            className="flex items-center justify-center gap-1 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-colors border border-indigo-500/50"
                        >
                            <Download size={10} /> {t('load')}
                        </button>
                        <button
                            onClick={handleSave}
                            className={`flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all border ${isSaved ? 'bg-green-600 text-white border-green-500' : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'}`}
                        >
                            {isSaved ? (
                                <span>{t('saved')}</span>
                            ) : (
                                <><Save size={10} /> {t('overwrite')}</>
                            )}
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-700">
                    <FilePlus size={20} />
                    <button
                        onClick={handleSave}
                        className={`w-full flex items-center justify-center gap-1 py-1.5 rounded border text-xs font-bold transition-all mt-auto ${isSaved ? 'bg-green-600 text-white border-green-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white text-slate-500'}`}
                    >
                        {isSaved ? (
                            <span>{t('saved')}</span>
                        ) : (
                            <><Save size={12} /> {t('save')}</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SaveSlot;