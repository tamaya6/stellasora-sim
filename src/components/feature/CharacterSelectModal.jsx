import React, { useState } from 'react';
import { User, X, Layers, AlertCircle, Star } from 'lucide-react';
import { ELEMENTS, CHARACTERS } from '../../data';
import CharacterIcon from '../ui/CharacterIcon';
import RankStars from '../ui/RankStars';

const CharacterSelectModal = ({ isOpen, onClose, onSelect }) => {
    const [elementFilter, setElementFilter] = useState('ALL');
    const [rankFilter, setRankFilter] = useState('ALL');

    if (!isOpen) return null;

    const filteredCharacters = CHARACTERS.filter(char => {
        const matchElement = elementFilter === 'ALL' || char.element.id === elementFilter;
        const matchRank = rankFilter === 'ALL' || char.rank === rankFilter;
        return matchElement && matchRank;
    });

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-950/50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <User size={20} /> キャラクターを選択
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded">
                        <X size={20} />
                    </button>
                </div>

                {/* フィルターエリア */}
                <div className="flex flex-col border-b border-slate-800 bg-slate-900/80 flex-shrink-0">
                    
                    {/* 属性フィルター */}
                    <div className="p-3 flex gap-2 overflow-x-auto no-scrollbar items-center border-b border-slate-800/50">
                        <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase tracking-wider">Element</span>
                        <button
                            onClick={() => setElementFilter('ALL')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                                ${elementFilter === 'ALL' 
                                    ? 'bg-white text-slate-900 shadow-lg' 
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                        >
                            <Layers size={14} /> ALL
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
                                    <Icon size={14} fill={isSelected ? "currentColor" : "none"} /> {el.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* ランクフィルター */}
                    <div className="p-3 flex gap-2 overflow-x-auto no-scrollbar items-center">
                        <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase tracking-wider">Rank</span>
                        <button
                            onClick={() => setRankFilter('ALL')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                                ${rankFilter === 'ALL' 
                                    ? 'bg-white text-slate-900 shadow-lg' 
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                }`}
                        >
                            ALL
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredCharacters.map(char => {
                                const ElementIcon = char.element.icon;
                                return (
                                    <button
                                        key={char.id}
                                        onClick={() => onSelect(char.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 ${char.element.bgColor} hover:bg-slate-800 hover:border-slate-500 transition-all group text-left relative overflow-hidden`}
                                    >
                                        <div className={`absolute -right-4 -bottom-4 opacity-10 text-white group-hover:opacity-20 transition-opacity rotate-12`}>
                                            <ElementIcon size={80} />
                                        </div>
                                        <div className="relative z-10 flex-shrink-0">
                                            <CharacterIcon char={char} size="md" />
                                        </div>
                                        <div className="relative z-10 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="font-bold text-white group-hover:text-yellow-400 transition-colors truncate text-lg">{char.name}</span>
                                                <RankStars rank={char.rank} size={12} />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className={`px-1.5 py-0.5 rounded bg-black/30 border border-white/10 ${char.element.textColor}`}>
                                                    {char.element.label}
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
                            <p>該当するキャラクターがいません</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterSelectModal;