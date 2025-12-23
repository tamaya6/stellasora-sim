import React, { useState } from 'react';
import { User, X, Layers, AlertCircle, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ELEMENTS } from '../../data';
import { useCharacters } from '../../hooks/useCharacters';
import CharacterIcon from '../ui/CharacterIcon';
import RankStars from '../ui/RankStars';

const CharacterSelectModal = ({ isOpen, onClose, onSelect }) => {
    const { t } = useTranslation();
    const characters = useCharacters();
    const [elementFilter, setElementFilter] = useState('ALL');
    const [rankFilter, setRankFilter] = useState('ALL');

    if (!isOpen) return null;

    const filteredCharacters = characters.filter(char => {
        const matchElement = elementFilter === 'ALL' || char.element.id === elementFilter;
        const matchRank = rankFilter === 'ALL' || char.rank === rankFilter;
        return matchElement && matchRank;
    });

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* 幅を max-w-4xl から max-w-6xl に変更して広くしました */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-950/50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <User size={20} /> {t('modal.selectCharacter')}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded">
                        <X size={20} />
                    </button>
                </div>

                {/* フィルターエリア */}
                <div className="flex flex-col border-b border-slate-800 bg-slate-900/80 flex-shrink-0">

                    {/* 属性フィルター */}
                    <div className="p-3 flex gap-2 overflow-x-auto no-scrollbar items-center border-b border-slate-800/50">
                        <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase tracking-wider">{t('filter.element')}</span>
                        <button
                            onClick={() => setElementFilter('ALL')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                                ${elementFilter === 'ALL'
                                    ? 'bg-white text-slate-900 shadow-lg'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                        >
                            <Layers size={14} /> {t('filter.all')}
                        </button>
                        {Object.values(ELEMENTS).map(el => {
                            const Icon = el.icon;
                            const isSelected = elementFilter === el.id;
                            return (
                                <button
                                    key={el.id}
                                    onClick={() => setElementFilter(el.id)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border
                                        ${isSelected
                                            ? `bg-gradient-to-r ${el.color} text-white border-transparent shadow-lg`
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                                        }`}
                                >
                                    <Icon size={14} fill={isSelected ? "currentColor" : "none"} /> {t(`element.${el.id}`)}
                                </button>
                            );
                        })}
                    </div>

                    {/* ランクフィルター */}
                    <div className="p-3 flex gap-2 overflow-x-auto no-scrollbar items-center">
                        <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase tracking-wider">{t('filter.rank')}</span>
                        <button
                            onClick={() => setRankFilter('ALL')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                                ${rankFilter === 'ALL'
                                    ? 'bg-white text-slate-900 shadow-lg'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                        >
                            {t('filter.all')}
                        </button>
                        {[5, 4].map(rank => {
                            const isSelected = rankFilter === rank;
                            return (
                                <button
                                    key={rank}
                                    onClick={() => setRankFilter(rank)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border
                                        ${isSelected
                                            ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg'
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                                        }`}
                                >
                                    <span>{rank}</span>
                                    <Star size={12} className={isSelected ? "fill-black text-black" : "fill-slate-400 text-slate-400"} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* キャラクターリスト */}
                <div className="p-4 overflow-y-auto bg-slate-950/30 flex-1">
                    {filteredCharacters.length > 0 ? (
                        /* 4列表示に対応: mdで3列、lg以上で4列 */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {filteredCharacters.map(char => {
                                const ElementIcon = char.element.icon;
                                return (
                                    <button
                                        key={char.id}
                                        onClick={() => onSelect(char.id)}
                                        /* パディングを p-2 に、gapを gap-2 に縮小 */
                                        className={`flex items-center gap-2 p-2 rounded-lg border border-slate-700/50 ${char.element.bgColor} hover:bg-slate-800 hover:border-slate-500 transition-all group text-left relative overflow-hidden`}
                                    >
                                        <div className={`absolute -right-4 -bottom-4 opacity-10 text-white group-hover:opacity-20 transition-opacity rotate-12`}>
                                            <ElementIcon size={100} />
                                        </div>
                                        <div className="relative z-10 flex-shrink-0">
                                            <CharacterIcon char={char} size="lg" />
                                        </div>
                                        <div className="relative z-10 min-w-0">
                                            <div className="flex flex-col items-start gap-1 mb-1">
                                                <span className="font-bold text-white group-hover:text-yellow-400 transition-colors truncate text-xl w-full">{char.name}</span>
                                                <RankStars rank={char.rank} size={14} />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className={`px-2 py-0.5 rounded bg-black/30 border border-white/10 ${char.element.textColor} font-bold`}>
                                                    {t(`element.${char.element.id}`)}
                                                </span>
                                                <span className="text-slate-300">{char.role}</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                            <AlertCircle size={48} className="mb-2 opacity-20" />
                            <p>{t('modal.noCharacter')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterSelectModal;