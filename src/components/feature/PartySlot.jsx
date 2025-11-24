import React, { useState, useMemo } from 'react';
import { AlertCircle, Trash2, User, ArrowDownWideNarrow, BarChart3, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CHARACTERS } from '../../data';
import CharacterSelectModal from './CharacterSelectModal';
import CorePotentialCard from './CorePotentialCard';
import SubPotentialCard from './SubPotentialCard';
import CharacterIcon from '../ui/CharacterIcon';
import RankStars from '../ui/RankStars';

const PartySlot = ({ 
    slotIndex, 
    charId, 
    potentialsData, 
    potentialOrder, 
    sortMode = 'default',
    hideUnacquired = false, 
    onSelectChar, 
    onUpdatePotential, 
    onClear, 
    onReorderPotentials, 
    onUpdatePotentialOrder, 
    onUpdateSettings, 
    slotTypeLabel 
}) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draggingId, setDraggingId] = useState(null);

    const selectedChar = CHARACTERS.find(c => c.id === charId);
    const ElementIcon = selectedChar?.element?.icon || AlertCircle;

    const isMainSlot = slotIndex === 0;
    const categoryPrefix = isMainSlot ? 'main' : 'support';
    
    // データの安全化: null/undefinedなら空オブジェクト/空配列にする
    const safePotentialsData = (potentialsData && typeof potentialsData === 'object') ? potentialsData : {};
    const safePotentialOrder = Array.isArray(potentialOrder) ? potentialOrder : [];
    
    const corePotentialPool = selectedChar ? (selectedChar.potentialSets[`${categoryPrefix}Core`] || []) : [];
    const subPotentialPool = selectedChar ? (selectedChar.potentialSets[`${categoryPrefix}Sub`] || []) : [];

    // 表示順序に基づいてリストを作成
    let orderedSubPotentials = [];
    if (selectedChar) {
        if (safePotentialOrder.length > 0) {
            const mapped = safePotentialOrder.map(id => subPotentialPool.find(s => s.id === id)).filter(Boolean);
            const existingIds = new Set(mapped.map(s => s.id));
            const remaining = subPotentialPool.filter(s => !existingIds.has(s.id));
            orderedSubPotentials = [...mapped, ...remaining];
        } else {
            orderedSubPotentials = subPotentialPool; 
        }
    }

    // 未取得非表示フィルタリング (サブ)
    const displaySubPotentials = orderedSubPotentials.filter(potential => {
        if (!hideUnacquired) return true;
        const current = safePotentialsData[potential.id] || { level: 0 };
        return current.level > 0;
    });

    // 未取得非表示フィルタリング (コア)
    const displayCorePotentials = corePotentialPool.filter(potential => {
        if (!hideUnacquired) return true;
        const current = safePotentialsData[potential.id] || { level: 0 };
        return current.level > 0; 
    });

    // ソート実行関数
    const handleSort = (mode) => {
        if (!selectedChar) return;

        let currentCoreIds = [];
        if (safePotentialOrder.length > 0) {
             currentCoreIds = safePotentialOrder.filter(id => corePotentialPool.some(core => core.id === id));
             const existingCoreSet = new Set(currentCoreIds);
             corePotentialPool.forEach(core => {
                 if (!existingCoreSet.has(core.id)) currentCoreIds.push(core.id);
             });
        } else {
             currentCoreIds = corePotentialPool.map(c => c.id);
        }

        let sortedSubIds = [];

        if (mode === 'default') {
            sortedSubIds = subPotentialPool.map(s => s.id);
        } else {
            const getPriorityValue = (p) => {
                switch(p) {
                    case 'high': return 3;
                    case 'medium': return 2;
                    case 'low': return 1;
                    default: return 0;
                }
            };

            const sortedList = [...subPotentialPool].sort((a, b) => {
                const aData = safePotentialsData[a.id] || { level: 0, priority: 'medium' };
                const bData = safePotentialsData[b.id] || { level: 0, priority: 'medium' };

                const aAcquired = aData.level > 0;
                const bAcquired = bData.level > 0;
                
                if (aAcquired !== bAcquired) {
                    return aAcquired ? -1 : 1;
                }
                if (!aAcquired && !bAcquired) return 0;

                if (mode === 'priority') {
                    const pDiff = getPriorityValue(bData.priority) - getPriorityValue(aData.priority);
                    if (pDiff !== 0) return pDiff;
                    return bData.level - aData.level;
                }
                if (mode === 'level') {
                    const lDiff = bData.level - aData.level;
                    if (lDiff !== 0) return lDiff;
                    return getPriorityValue(bData.priority) - getPriorityValue(aData.priority);
                }
                return 0;
            });
            sortedSubIds = sortedList.map(s => s.id);
        }

        const newOrder = [...currentCoreIds, ...sortedSubIds];
        onUpdatePotentialOrder(newOrder);
    };

    const handleCoreToggle = (potentialId) => {
        const current = safePotentialsData[potentialId] || { level: 0, priority: 'medium' };
        const isSelected = current.level > 0;

        if (isSelected) {
            onUpdatePotential(potentialId, { level: 0, priority: 'medium' });
        } else {
            const selectedCount = corePotentialPool.filter(s => (safePotentialsData[s.id]?.level || 0) > 0).length;
            if (selectedCount < 2) {
                onUpdatePotential(potentialId, { level: 1, priority: 'medium' });
            }
        }
    };

    const handleSelect = (id) => {
        onSelectChar(id);
        setIsModalOpen(false);
    };

    const handleDragStart = (e, potentialId) => {
        setDraggingId(potentialId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", JSON.stringify({ slotIndex, potentialId }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        setDraggingId(null);
        const dataStr = e.dataTransfer.getData("text/plain");
        if (!dataStr) return;
        try {
            const data = JSON.parse(dataStr);
            if (data.slotIndex !== slotIndex) return;
            if (data.potentialId === targetId) return;
            onReorderPotentials(data.potentialId, targetId);
        } catch (err) {
            console.error("Drop error", err);
        }
    };

    // 素質数（ポイント）計算: 完全防衛
    const totalPoints = useMemo(() => {
        if (!safePotentialsData || typeof safePotentialsData !== 'object') return 0;

        try {
            return Object.entries(safePotentialsData)
                .filter(([key, val]) => {
                    if (!key || !val) return false;
                    const isCore = corePotentialPool.some(s => s.id === key);
                    const isSub = subPotentialPool.some(s => s.id === key);
                    return (isCore || isSub) && typeof val.level === 'number' && val.level > 0;
                })
                .reduce((acc, [_, val]) => acc + val.level, 0);
        } catch (e) {
            console.error("Error calculating points:", e);
            return 0;
        }
    }, [safePotentialsData, corePotentialPool, subPotentialPool]);

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
                    md:w-60 flex-shrink-0 p-4 transition-all duration-300 relative overflow-hidden shadow-md
                    ${selectedChar ? `bg-gradient-to-br ${selectedChar.element.color}` : 'bg-slate-800'}
                `}>
                    <div className="flex flex-row md:flex-col h-full items-center md:items-start justify-between relative z-10 gap-4">
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-2 md:mb-4">
                                <h3 className="font-bold text-white drop-shadow-md text-xs uppercase tracking-widest opacity-80">{t('slot.prefix')} {slotIndex + 1}</h3>
                                <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-white font-bold border border-white/20 whitespace-nowrap">{slotTypeLabel}</span>
                            </div>
                            
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex md:flex-col items-center md:items-start gap-3 group text-left hover:bg-black/20 p-2 rounded-xl transition-colors w-full border border-transparent hover:border-white/10"
                            >
                                <div className="flex-shrink-0">
                                    {selectedChar ? (
                                        <CharacterIcon char={selectedChar} size="2xl" className="group-hover:border-white/50 transition-colors shadow-2xl" />
                                    ) : (
                                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-lg bg-black/30 border border-white/20 flex items-center justify-center">
                                            <User size={48} className="text-white/50" />
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1 w-full z-10">
                                    {selectedChar ? (
                                        <div className="bg-slate-900/60 rounded-lg p-2 backdrop-blur-sm border border-white/10 shadow-lg">
                                            <div className="font-bold text-lg md:text-xl text-white group-hover:text-yellow-200 transition-colors truncate shadow-black drop-shadow-sm mb-0.5">
                                                {selectedChar.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-white/90">
                                                {/* ランクスターのサイズを16から14に変更 */}
                                                <RankStars rank={selectedChar.rank} size={14} />
                                                <span className="opacity-70">|</span>
                                                {/* ロール名をtext-[13px]に変更 */}
                                                <span className="text-[13px]">{selectedChar.role}</span>
                                            </div>
                                            
                                            <div className="mt-2 pt-2 border-t border-white/20 hidden md:block">
                                                <div className="flex justify-between items-baseline">
                                                    {/* 素質数ラベルをtext-[13px]に変更 */}
                                                    <div className="text-[13px] text-white/80">{t('slot.totalPoints')}</div>
                                                    <div className="text-2xl font-bold text-white font-mono">
                                                        {totalPoints}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-white/50 font-bold p-2">{t('modal.selectCharacter')}</div>
                                    )}
                                </div>
                            </button>
                        </div>
                        
                        {selectedChar && (
                            <button 
                                onClick={onClear} 
                                className="text-white/60 hover:text-white p-2 hover:bg-black/20 rounded-full transition-colors md:self-start" 
                                title={t('slot.tooltipRemove')}
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                    {selectedChar && <ElementIcon className="absolute -right-8 -bottom-8 md:-right-12 md:-bottom-12 text-black/10 w-48 h-48 pointer-events-none transform rotate-12 opacity-80" />}
                </div>

                {/* 右側: スキルリストエリア */}
                <div className="flex-1 p-2 md:p-4 bg-slate-950/30 flex flex-col">
                    {selectedChar ? (
                        <>
                            {/* コアスキルエリア */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <div className="w-1 h-4 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('slot.corePotentials')} <span className="text-slate-500 font-normal ml-2 text-[10px]">{t('slot.max2')}</span></h4>
                                </div>
                                <div className="grid grid-cols-4 gap-3 max-w-2xl">
                                    {displayCorePotentials.map(potential => {
                                        const isSelected = (safePotentialsData[potential.id]?.level || 0) > 0;
                                        return (
                                            <CorePotentialCard
                                                key={potential.id}
                                                potential={potential} 
                                                isSelected={isSelected}
                                                element={selectedChar.element}
                                                onToggle={() => handleCoreToggle(potential.id)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* サブスキルエリア */}
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 px-1 gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{t('slot.subPotentials')}</h4>
                                    </div>

                                    {/* ツールバー */}
                                    <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800 screenshot-hide">
                                        {/* 未取得非表示ボタン */}
                                        <button
                                            onClick={() => onUpdateSettings({ hideUnacquired: !hideUnacquired })}
                                            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-colors border ${
                                                hideUnacquired 
                                                ? 'bg-indigo-600 text-white border-indigo-500' 
                                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                                            }`}
                                            title={hideUnacquired ? t('slot.tooltipShowAll') : t('slot.tooltipHideUnacquired')}
                                        >
                                            {hideUnacquired ? <EyeOff size={12} /> : <Eye size={12} />}
                                            <span className="hidden sm:inline">{t('slot.hideUnacquired')}</span>
                                        </button>
                                        
                                        <div className="w-px h-3 bg-slate-700 mx-1"></div>

                                        {/* ソートボタン群 */}
                                        <button
                                            onClick={() => handleSort('default')}
                                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                            title={t('slot.tooltipSortDefault')}
                                        >
                                            <RotateCcw size={10} /> {t('slot.sortDefault')}
                                        </button>
                                        <button
                                            onClick={() => handleSort('priority')}
                                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                            title={t('slot.tooltipSortPriority')}
                                        >
                                            <ArrowDownWideNarrow size={10} /> {t('slot.sortPriority')}
                                        </button>
                                        <button
                                            onClick={() => handleSort('level')}
                                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                            title={t('slot.tooltipSortLevel')}
                                        >
                                            <BarChart3 size={10} /> {t('slot.sortLevel')}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                    {displaySubPotentials.map((potential) => {
                                        const current = safePotentialsData[potential.id] || { level: 0, priority: 'medium' };
                                        return (
                                            <SubPotentialCard 
                                                key={potential.id}
                                                potential={potential} 
                                                value={current.level}
                                                priority={current.priority}
                                                element={selectedChar.element}
                                                onChange={(newVal) => onUpdatePotential(potential.id, newVal)}
                                                isDragging={draggingId === potential.id}
                                                onDragStart={(e) => handleDragStart(e, potential.id)}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, potential.id)}
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
                            <p className="text-sm">{t('modal.selectCharacter')}</p>
                        </div>
                    )}
                    
                    {/* 素質数表示 (モバイル向けフッター) */}
                    {selectedChar && (
                        <div className="md:hidden mt-4 pt-2 border-t border-slate-800 flex justify-between items-center text-[13px] text-slate-400">
                            <span>{t('slot.totalPoints')}</span>
                            <span className="text-white font-bold text-base">{totalPoints}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PartySlot;