import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    Sword, Shield, Heart, Zap, Star, AlertCircle, Share2, Trash2, RotateCcw, X, GripVertical,
    User, Layers, Check, Sparkles
} from 'lucide-react';

// データ定義ファイルをインポート
// ここでキャラクター情報やスキル定義などを読み込みます
import { ELEMENTS, CHARACTERS, SKILL_STYLES } from './data';

// --- ユーティリティ ---
const saveToUrl = (state) => {
    try {
        const json = JSON.stringify(state);
        const compressed = btoa(unescape(encodeURIComponent(json)));
        window.history.replaceState(null, '', `#build=${compressed}`);
    } catch (e) {
        console.error("Save failed", e);
    }
};

const loadFromUrl = () => {
    try {
        const hash = window.location.hash.substring(1);
        if (hash.startsWith('build=')) {
            const compressed = hash.replace('build=', '');
            const json = decodeURIComponent(escape(atob(compressed)));
            return JSON.parse(json);
        }
    } catch (e) {
        console.error("Load failed", e);
    }
    return null;
};

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

// --- UIコンポーネント ---

// ツールチップコンポーネント（Portal使用）
const PortalTooltip = ({ title, description, visible, position }) => {
    if (!visible) return null;

    return createPortal(
        <div 
            className="fixed z-[9999] w-64 bg-slate-800 text-white text-xs rounded-lg shadow-2xl p-3 border border-slate-600 pointer-events-none"
            style={{ 
                top: position.top - 8, // 要素の上に少し隙間を空けて表示
                left: position.left,
                transform: 'translate(-50%, -100%)' // 中央揃えかつ上に表示
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

const CharacterIcon = ({ char, size = "md", className = "" }) => {
    const [imgError, setImgError] = useState(false);
    const ElementIcon = char.element.icon;

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20" 
    };

    const containerSize = sizeClasses[size] || sizeClasses.md;

    if (!imgError && char.imagePath) {
        return (
            <img 
                src={char.imagePath} 
                alt={char.name} 
                className={`object-cover rounded-lg border-2 border-slate-600 bg-slate-800 ${containerSize} ${className}`}
                onError={() => setImgError(true)}
            />
        );
    }

    return (
        <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br ${char.element.color} shadow-lg ${containerSize} ${className}`}>
            <ElementIcon className="text-white w-[60%] h-[60%]" />
        </div>
    );
};

const RankStars = ({ rank, size = 14 }) => {
    return (
        <div className="flex gap-0.5">
            {[...Array(rank)].map((_, i) => (
                <Star key={i} size={size} className="fill-yellow-400 text-yellow-400" />
            ))}
        </div>
    );
};

const CharacterSelectModal = ({ isOpen, onClose, onSelect }) => {
    const [filter, setFilter] = useState('ALL');

    if (!isOpen) return null;

    const filteredCharacters = CHARACTERS.filter(char => {
        if (filter === 'ALL') return true;
        return char.element.id === filter;
    });

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-950/50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <User size={20} /> キャラクターを選択
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-3 border-b border-slate-800 bg-slate-900/80 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                            ${filter === 'ALL' 
                                ? 'bg-white text-slate-900 shadow-lg' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                    >
                        <Layers size={14} /> ALL
                    </button>
                    {Object.values(ELEMENTS).map(el => {
                        const Icon = el.icon;
                        const isSelected = filter === el.id;
                        return (
                            <button
                                key={el.id}
                                onClick={() => setFilter(el.id)}
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

// --- コアスキルカード ---
const CoreSkillCard = ({ 
    skill, 
    isSelected, 
    element,
    onToggle
}) => {
    const ElementIcon = element.icon;
    const designStyle = SKILL_STYLES[skill.bgType] || SKILL_STYLES.core;
    
    // ツールチップ制御用
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
                {/* 透過させるコンテンツラッパー */}
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
                        {/* テキストサイズを大きくし、背景色を追加 */}
                        <div className={`text-xs font-bold leading-tight line-clamp-2 py-1 px-1 rounded shadow-sm ${isSelected ? 'text-white bg-black/40' : 'text-slate-400 bg-black/20'}`}>
                            {skill.name}
                        </div>
                    </div>
                </div>
            </button>

            {/* Portalで描画するツールチップ */}
            <PortalTooltip 
                title={skill.name}
                description={skill.description}
                visible={showTooltip}
                position={tooltipPos}
            />
        </>
    );
};

// --- サブスキルカード ---
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
    const isAcquired = value > 0;
    const designStyle = SKILL_STYLES[skill.bgType] || SKILL_STYLES.normal;

    // ツールチップ制御用
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
        // ドラッグ中はツールチップを表示しない
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
    
    const priorityLabel = { high: '高', medium: '中', low: '低', none: '-' };
    const ElementIcon = element.icon;

    return (
        <>
            <div 
                className={`
                    relative flex flex-col border rounded-lg overflow-visible transition-all duration-200 h-full group
                    ${isAcquired ? 'border-slate-400 shadow-lg' : 'border-slate-700 bg-slate-900/80'} 
                    ${isDragging ? 'opacity-40 ring-2 ring-indigo-500 scale-95' : 'hover:border-slate-400'}
                `}
                draggable={true}
                onDragStart={(e) => {
                    // ドラッグ開始時にツールチップを消す
                    setShowTooltip(false);
                    onDragStart(e);
                }}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
            >
                {/* カード上部 (画像エリア) */}
                <div 
                    className={`flex-1 w-full flex flex-col items-center justify-center relative transition-all duration-300 py-2 rounded-t-lg ${!isAcquired ? 'bg-slate-900' : ''} cursor-grab active:cursor-grabbing`}
                    style={isAcquired ? designStyle.style : {}}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* 透過ラッパー: 画像とテキストを囲む */}
                    <div className={`flex flex-col items-center justify-center w-full h-full ${!isAcquired ? 'opacity-60' : ''}`}>
                        {/* レアリティ演出 (キラキラ) */}
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
                                <div className="text-slate-400 text-xs font-bold pointer-events-none py-1 px-2 bg-black/40 rounded">未取得</div>
                            )}
                        </div>
                        
                        <div className="w-full px-1 text-center z-10 mt-auto">
                            <div className={`text-xs font-bold leading-tight line-clamp-2 h-9 flex items-center justify-center px-1 rounded ${isAcquired ? 'text-white bg-black/40' : 'text-slate-400 bg-black/20'}`}>
                                {skill.name}
                            </div>
                        </div>
                    </div>
                </div>

                {/* カード下部 (操作エリア) */}
                <div 
                    className={`p-1.5 flex flex-col gap-1.5 cursor-default bg-slate-900 border-t border-slate-700 relative z-20 rounded-b-lg ${!isAcquired ? 'opacity-60' : ''}`}
                    draggable={true}
                    onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <div className="flex items-center justify-between bg-slate-950 rounded px-0.5 border border-slate-800">
                        <button onClick={() => handleLevelChange(-1)} className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-white text-sm font-bold">-</button>
                        <span className={`text-lg font-mono font-bold ${value === 6 ? 'text-yellow-400' : 'text-white'}`}>
                            {value}<span className="text-xs text-slate-500">/6</span>
                        </span>
                        <button onClick={() => handleLevelChange(1)} className={`w-6 h-6 flex items-center justify-center rounded text-white text-sm font-bold ${value >= 6 ? 'bg-slate-900 text-slate-600' : 'bg-slate-800 hover:bg-slate-700'}`} disabled={value >= 6}>+</button>
                    </div>

                    <div className={`grid grid-cols-3 gap-0.5 text-xs transition-opacity duration-200 ${isAcquired ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                        {['high', 'medium', 'low'].map(p => (
                            <button
                                key={p}
                                onClick={() => handlePriorityChange(p)}
                                className={`py-0.5 rounded border transition-colors text-center font-medium ${priority === p ? priorityColors[p] : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'}`}
                            >
                                {priorityLabel[p]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Portalで描画するツールチップ - ドラッグ中は表示しない */}
            <PortalTooltip 
                title={skill.name}
                description={skill.description}
                visible={showTooltip && !isDragging}
                position={tooltipPos}
            />
        </>
    );
};

const PartySlot = ({ 
    slotIndex, 
    charId, 
    skillsData, 
    skillOrder, 
    onSelectChar, 
    onUpdateSkill, 
    onClear, 
    onReorderSkills,
    slotTypeLabel 
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draggingId, setDraggingId] = useState(null);

    const selectedChar = CHARACTERS.find(c => c.id === charId);
    const ElementIcon = selectedChar?.element?.icon || AlertCircle;

    const isMainSlot = slotIndex === 0;
    const categoryPrefix = isMainSlot ? 'main' : 'support';
    
    // スキルデータの取得
    const coreSkillPool = selectedChar ? selectedChar.skillSets[`${categoryPrefix}Core`] : [];
    const subSkillPool = selectedChar ? selectedChar.skillSets[`${categoryPrefix}Sub`] : [];

    // サブスキルの順序管理 (コアスキルは順序変更なしで固定4つ表示)
    let orderedSubSkills = [];
    if (selectedChar) {
        if (skillOrder && skillOrder.length > 0) {
            const mapped = skillOrder.map(id => subSkillPool.find(s => s.id === id)).filter(Boolean);
            const existingIds = new Set(mapped.map(s => s.id));
            const remaining = subSkillPool.filter(s => !existingIds.has(s.id));
            orderedSubSkills = [...mapped, ...remaining];
        } else {
            orderedSubSkills = subSkillPool;
        }
    }

    // コアスキルの選択処理 (Max 2つ)
    const handleCoreToggle = (skillId) => {
        const currentSkill = skillsData[skillId] || { level: 0, priority: 'medium' };
        const isSelected = currentSkill.level > 0;

        if (isSelected) {
            // 解除
            onUpdateSkill(skillId, { level: 0, priority: 'medium' });
        } else {
            // 追加 (2つ制限チェック)
            const selectedCount = coreSkillPool.filter(s => (skillsData[s.id]?.level || 0) > 0).length;
            if (selectedCount < 2) {
                onUpdateSkill(skillId, { level: 1, priority: 'medium' });
            } else {
                alert("コアスキルは2つまでしか選択できません");
            }
        }
    };

    const handleSelect = (id) => {
        onSelectChar(id);
        setIsModalOpen(false);
    };

    const handleDragStart = (e, skillId) => {
        setDraggingId(skillId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", JSON.stringify({ slotIndex, skillId }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetSkillId) => {
        e.preventDefault();
        setDraggingId(null);
        const dataStr = e.dataTransfer.getData("text/plain");
        if (!dataStr) return;
        try {
            const data = JSON.parse(dataStr);
            if (data.slotIndex !== slotIndex) return;
            if (data.skillId === targetSkillId) return;
            onReorderSkills(data.skillId, targetSkillId);
        } catch (err) {
            console.error("Drop error", err);
        }
    };

    // SP計算: サブスキルのレベル合計
    const totalSp = Object.entries(skillsData)
        .filter(([key, val]) => subSkillPool.some(s => s.id === key))
        .reduce((acc, [_, val]) => acc + val.level, 0);

    return (
        <>
            <CharacterSelectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelect}
            />
            <div className="flex flex-col md:flex-row w-full bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden shadow-xl mb-4 min-h-[240px]">
                
                {/* 左側: キャラ情報 */}
                <div className={`
                    md:w-64 flex-shrink-0 p-4 transition-all duration-300 relative overflow-hidden shadow-md
                    ${selectedChar ? `bg-gradient-to-br ${selectedChar.element.color}` : 'bg-slate-800'}
                `}>
                    <div className="flex flex-row md:flex-col h-full items-center md:items-start justify-between relative z-10 gap-4">
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-2 md:mb-4">
                                <h3 className="font-bold text-white drop-shadow-md text-xs uppercase tracking-widest opacity-80">Slot {slotIndex + 1}</h3>
                                <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-white font-bold border border-white/20 whitespace-nowrap">{slotTypeLabel}</span>
                            </div>
                            
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex md:flex-col items-center md:items-start gap-3 group text-left hover:bg-black/20 p-2 -m-2 rounded-lg transition-colors w-full"
                            >
                                <div className="flex-shrink-0">
                                    {selectedChar ? (
                                        <CharacterIcon char={selectedChar} size="xl" className="group-hover:border-white/50 transition-colors shadow-2xl" />
                                    ) : (
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-black/30 border border-white/20 flex items-center justify-center">
                                            <User size={32} className="text-white/50" />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1 w-full">
                                    {selectedChar ? (
                                        <>
                                            <div className="font-bold text-xl md:text-2xl text-white group-hover:text-yellow-200 transition-colors truncate shadow-black drop-shadow-sm mb-1">
                                                {selectedChar.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-white/90">
                                                <RankStars rank={selectedChar.rank} size={12} />
                                                <span className="opacity-70">|</span>
                                                <span>{selectedChar.role}</span>
                                            </div>
                                            
                                            <div className="mt-3 pt-3 border-t border-white/20 hidden md:block">
                                                <div className="text-xs text-white/80 mb-1">SP使用量</div>
                                                <div className="text-2xl font-bold text-white font-mono">
                                                    {totalSp}
                                                    <span className="text-sm text-white/60 font-normal ml-1">/ {orderedSubSkills.length * 6}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-white/50 font-bold">キャラクター未選択</div>
                                    )}
                                </div>
                            </button>
                        </div>
                        
                        {selectedChar && (
                            <button onClick={onClear} className="text-white/60 hover:text-white p-2 hover:bg-black/20 rounded-full transition-colors md:self-start" title="外す">
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                    {selectedChar && <ElementIcon className="absolute -right-8 -bottom-8 md:-right-12 md:-bottom-12 text-black/10 w-48 h-48 pointer-events-none transform rotate-12" />}
                </div>

                {/* 右側: スキルリストエリア */}
                <div className="flex-1 p-2 md:p-4 bg-slate-950/30 flex flex-col">
                    {selectedChar ? (
                        <>
                            {/* コアスキルエリア */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <div className="w-1 h-4 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Core Skills <span className="text-slate-500 font-normal ml-2 text-[10px]">Max 2</span></h4>
                                </div>
                                <div className="grid grid-cols-4 gap-3 max-w-2xl">
                                    {coreSkillPool.map(skill => {
                                        const isSelected = (skillsData[skill.id]?.level || 0) > 0;
                                        return (
                                            <CoreSkillCard
                                                key={skill.id}
                                                skill={skill}
                                                isSelected={isSelected}
                                                element={selectedChar.element}
                                                onToggle={() => handleCoreToggle(skill.id)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* サブスキルエリア */}
                            <div>
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <div className="w-1 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sub Skills</h4>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                    {orderedSubSkills.map((skill) => {
                                        const current = skillsData[skill.id] || { level: 0, priority: 'medium' };
                                        return (
                                            <SubSkillCard 
                                                key={skill.id}
                                                skill={skill}
                                                value={current.level}
                                                priority={current.priority}
                                                element={selectedChar.element}
                                                onChange={(newVal) => onUpdateSkill(skill.id, newVal)}
                                                isDragging={draggingId === skill.id}
                                                onDragStart={(e) => handleDragStart(e, skill.id)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, skill.id)}
                                                onDragEnd={() => setDraggingId(null)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-50 min-h-[200px]">
                             <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-center hover:border-slate-400 hover:text-slate-300 transition-colors group"
                            >
                                <div className="group-hover:scale-110 transition-transform text-2xl">+</div>
                            </button>
                            <p className="text-sm">キャラクターを選択してください</p>
                        </div>
                    )}
                    
                    {/* SP合計 (モバイル向けフッター) */}
                    {selectedChar && (
                        <div className="md:hidden mt-4 pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                            <span>SP使用量</span>
                            <span className="text-white font-bold">{totalSp} / {orderedSubSkills.length * 6}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// --- メインアプリ ---
export default function App() {
    const [party, setParty] = useState([
        { charId: null, skills: {}, skillOrder: [] },
        { charId: null, skills: {}, skillOrder: [] },
        { charId: null, skills: {}, skillOrder: [] }
    ]);
    
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const loaded = loadFromUrl();
        if (loaded && Array.isArray(loaded) && loaded.length === 3) {
            setParty(loaded);
        }
    }, []);

    useEffect(() => {
        saveToUrl(party);
    }, [party]);

    const updateSlot = (slotIndex, charId) => {
        const newParty = [...party];
        const selectedChar = CHARACTERS.find(c => c.id === charId);
        
        const targetCategory = slotIndex === 0 ? 'main' : 'support';
        const subSkillPool = selectedChar ? selectedChar.skillSets[`${targetCategory}Sub`] : [];
        const defaultOrder = subSkillPool.map(s => s.id);
        
        // コアスキルは順序保存不要のためスキルデータのみリセット
        newParty[slotIndex] = { charId, skills: {}, skillOrder: defaultOrder };
        setParty(newParty);
    };

    const updateSkill = (slotIndex, skillId, skillData) => {
        const newParty = [...party];
        newParty[slotIndex].skills = {
            ...newParty[slotIndex].skills,
            [skillId]: skillData
        };
        setParty(newParty);
    };

    const clearSlot = (slotIndex) => {
        const newParty = [...party];
        newParty[slotIndex] = { charId: null, skills: {}, skillOrder: [] };
        setParty(newParty);
    };

    const reorderSkills = (slotIndex, sourceSkillId, targetSkillId) => {
        const newParty = [...party];
        const currentOrder = newParty[slotIndex].skillOrder;
        
        const sourceIndex = currentOrder.indexOf(sourceSkillId);
        const targetIndex = currentOrder.indexOf(targetSkillId);

        if (sourceIndex === -1 || targetIndex === -1) return;

        const newOrder = reorder(currentOrder, sourceIndex, targetIndex);
        newParty[slotIndex].skillOrder = newOrder;
        
        setParty(newParty);
    };

    const resetAll = () => {
        if(window.confirm("全ての構成をリセットしますか？")) {
            setParty([
                { charId: null, skills: {}, skillOrder: [] },
                { charId: null, skills: {}, skillOrder: [] },
                { charId: null, skills: {}, skillOrder: [] }
            ]);
            window.history.replaceState(null, '', ' ');
        }
    }

    const copyUrl = () => {
        const textToCopy = window.location.href;
        
        const fallbackCopyTextToClipboard = (text) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.opacity = "0";
            textArea.style.pointerEvents = "none";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                } else {
                    alert("クリップボードへのコピーに失敗しました。");
                }
            } catch (err) {
                alert("クリップボードへのコピーに失敗しました。");
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                })
                .catch(err => {
                    fallbackCopyTextToClipboard(textToCopy);
                });
        } else {
            fallbackCopyTextToClipboard(textToCopy);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white pb-8 flex flex-col">
            <nav className="bg-slate-900/90 backdrop-blur border-b border-slate-800 z-20 shadow-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                            <Star className="text-yellow-500 w-5 h-5" fill="currentColor" />
                        </div>
                        <h1 className="font-bold text-lg sm:text-xl tracking-wider hidden sm:block">
                            STELLASORA <span className="text-xs font-normal text-slate-400 ml-1">SIMULATOR</span>
                        </h1>
                        <h1 className="font-bold text-lg tracking-wider sm:hidden">
                            STELLASORA
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={resetAll}
                            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm text-red-400 hover:bg-slate-800 rounded transition-colors border border-transparent hover:border-slate-700"
                        >
                            <RotateCcw size={14} className="sm:w-4 sm:h-4" /> 
                            <span className="hidden sm:inline">リセット</span>
                        </button>
                        <button 
                            onClick={copyUrl}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded shadow-lg transition-all border ${isCopied ? 'bg-green-600 border-green-500 text-white' : 'bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white'}`}
                        >
                            {isCopied ? (
                                <span className="flex gap-1 items-center">Copied!</span>
                            ) : (
                                <><Share2 size={14} className="sm:w-4 sm:h-4" /> URL共有</>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 space-y-4 overflow-y-auto">
                {party.map((slot, idx) => (
                    <PartySlot 
                        key={idx}
                        slotIndex={idx}
                        charId={slot.charId}
                        skillsData={slot.skills}
                        skillOrder={slot.skillOrder} 
                        slotTypeLabel={idx === 0 ? 'Main Skill' : 'Support Skill'}
                        onSelectChar={(id) => updateSlot(idx, id)}
                        onUpdateSkill={(skillId, data) => updateSkill(idx, skillId, data)}
                        onClear={() => clearSlot(idx)}
                        onReorderSkills={(src, dst) => reorderSkills(idx, src, dst)}
                    />
                ))}
            </main>

            <footer className="py-4 text-center text-slate-500 text-xs">
                Stella Sora is a property of Yostar. All rights reserved.
            </footer>
        </div>
    );
}