import React, { useState } from 'react';
import { AlertCircle, Trash2, User } from 'lucide-react';
import { CHARACTERS } from '../../data';
import CharacterSelectModal from './CharacterSelectModal';
import CoreSkillCard from './CoreSkillCard';
import SubSkillCard from './SubSkillCard';
import CharacterIcon from '../ui/CharacterIcon';
import RankStars from '../ui/RankStars';

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
    
    const coreSkillPool = selectedChar ? selectedChar.skillSets[`${categoryPrefix}Core`] : [];
    const subSkillPool = selectedChar ? selectedChar.skillSets[`${categoryPrefix}Sub`] : [];

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

    const handleCoreToggle = (skillId) => {
        const currentSkill = skillsData[skillId] || { level: 0, priority: 'medium' };
        const isSelected = currentSkill.level > 0;

        if (isSelected) {
            onUpdateSkill(skillId, { level: 0, priority: 'medium' });
        } else {
            const selectedCount = coreSkillPool.filter(s => (skillsData[s.id]?.level || 0) > 0).length;
            if (selectedCount < 2) {
                onUpdateSkill(skillId, { level: 1, priority: 'medium' });
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

                                <div className="min-w-0 flex-1 w-full z-10">
                                    {selectedChar ? (
                                        <div className="bg-slate-900/60 rounded-lg p-3 backdrop-blur-sm border border-white/10 shadow-lg">
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
                                        </div>
                                    ) : (
                                        <div className="text-white/50 font-bold p-2">キャラクター未選択</div>
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

export default PartySlot;