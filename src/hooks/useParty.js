import { useState, useEffect } from 'react';
import { CHARACTERS } from '../data';
import { loadFromUrl, reorder } from '../utils/storage';

const INITIAL_PARTY = [
    { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false },
    { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false },
    { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false }
];

export const useParty = () => {
    const [party, setParty] = useState(INITIAL_PARTY);
    const [isLoaded, setIsLoaded] = useState(false);

    // 初期化時にURLから復元
    useEffect(() => {
        const loadedFromUrl = loadFromUrl();
        if (loadedFromUrl && Array.isArray(loadedFromUrl) && loadedFromUrl.length === 3) {
            setParty(loadedFromUrl);
            // ロード成功後、URLをクリーンにする
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', cleanUrl);
        }
        setIsLoaded(true);
    }, []);

    const updateSlot = (slotIndex, charId) => {
        const newParty = [...party];
        const selectedChar = CHARACTERS.find(c => c.id === charId);
        
        // キャラクター変更時は初期設定に戻す
        const targetCategory = slotIndex === 0 ? 'main' : 'support';
        const subSkillPool = selectedChar ? selectedChar.skillSets[`${targetCategory}Sub`] : [];
        const defaultOrder = subSkillPool.map(s => s.id);
        
        newParty[slotIndex] = { 
            charId, 
            skills: {}, 
            skillOrder: defaultOrder,
            sortMode: 'default',
            hideUnacquired: false 
        };
        setParty(newParty);
    };

    const updateSkill = (slotIndex, skillId, skillData) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                skills: {
                    ...slot.skills,
                    [skillId]: skillData
                }
            };
        });
        setParty(newParty);
    };

    const clearSlot = (slotIndex) => {
        const newParty = [...party];
        newParty[slotIndex] = { 
            charId: null, 
            skills: {}, 
            skillOrder: [],
            sortMode: 'default',
            hideUnacquired: false
        };
        setParty(newParty);
    };

    const reorderSkills = (slotIndex, sourceSkillId, targetSkillId) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;

            const currentOrder = slot.skillOrder;
            const sourceIndex = currentOrder.indexOf(sourceSkillId);
            const targetIndex = currentOrder.indexOf(targetSkillId);

            if (sourceIndex === -1 || targetIndex === -1) return slot;

            const newOrder = reorder(currentOrder, sourceIndex, targetIndex);
            
            return {
                ...slot,
                skillOrder: newOrder
            };
        });
        setParty(newParty);
    };

    const updateSkillOrder = (slotIndex, newOrder) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                skillOrder: newOrder
            };
        });
        setParty(newParty);
    };

    const updateSlotSettings = (slotIndex, settings) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                ...settings
            };
        });
        setParty(newParty);
    };

    const resetAll = () => {
        setParty(INITIAL_PARTY);
        window.history.replaceState(null, '', window.location.pathname);
    };

    return {
        party,
        setParty,
        isLoaded,
        updateSlot,
        updateSkill,
        clearSlot,
        reorderSkills,
        updateSkillOrder,
        updateSlotSettings,
        resetAll
    };
};