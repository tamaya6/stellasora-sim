import { useState, useEffect } from 'react';
import { CHARACTERS } from '../data';
import { loadFromUrl, reorder } from '../utils/storage';

const INITIAL_PARTY = [
    { charId: null, potentials: {}, potentialOrder: [], sortMode: 'default', hideUnacquired: false },
    { charId: null, potentials: {}, potentialOrder: [], sortMode: 'default', hideUnacquired: false },
    { charId: null, potentials: {}, potentialOrder: [], sortMode: 'default', hideUnacquired: false }
];

// データの正規化関数（古いデータ構造を新しいものに変換）
const normalizePartyData = (data) => {
    if (!Array.isArray(data)) return INITIAL_PARTY;
    
    return data.map(slot => {
        // スキルデータの移行: potentials がなければ skills を使う
        let potentials = slot.potentials;
        if (!potentials && slot.skills) {
            potentials = slot.skills;
        }
        if (!potentials) potentials = {};

        // スキル順序の移行: potentialOrder がなければ skillOrder を使う
        let potentialOrder = slot.potentialOrder;
        if (!potentialOrder && slot.skillOrder) {
            potentialOrder = slot.skillOrder;
        }
        if (!potentialOrder) potentialOrder = [];

        return {
            ...slot,
            potentials: potentials,
            potentialOrder: potentialOrder,
            sortMode: slot.sortMode || 'default',
            hideUnacquired: slot.hideUnacquired ?? false
        };
    });
};

export const useParty = () => {
    const [party, setParty] = useState(INITIAL_PARTY);
    const [isLoaded, setIsLoaded] = useState(false);

    // 初期化時にURLから復元
    useEffect(() => {
        const loadedFromUrl = loadFromUrl();
        if (loadedFromUrl && Array.isArray(loadedFromUrl) && loadedFromUrl.length === 3) {
            // ロードしたデータを正規化してからセット
            setParty(normalizePartyData(loadedFromUrl));
            
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', cleanUrl);
        }
        setIsLoaded(true);
    }, []);

    // 外部からデータをセットする際も正規化を通す
    const setPartyData = (newData) => {
        setParty(normalizePartyData(newData));
    };

    const updateSlot = (slotIndex, charId) => {
        const newParty = [...party];
        const selectedChar = CHARACTERS.find(c => c.id === charId);
        
        const targetCategory = slotIndex === 0 ? 'main' : 'support';
        const subPotentialPool = selectedChar ? selectedChar.potentialSets[`${targetCategory}Sub`] : [];
        const defaultOrder = subPotentialPool.map(s => s.id);
        
        newParty[slotIndex] = { 
            charId, 
            potentials: {}, 
            potentialOrder: defaultOrder,
            sortMode: 'default',
            hideUnacquired: false 
        };
        setParty(newParty);
    };

    const updatePotential = (slotIndex, potentialId, potentialData) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                potentials: {
                    ...slot.potentials,
                    [potentialId]: potentialData
                }
            };
        });
        setParty(newParty);
    };

    const clearSlot = (slotIndex) => {
        const newParty = [...party];
        newParty[slotIndex] = { 
            charId: null, 
            potentials: {}, 
            potentialOrder: [],
            sortMode: 'default',
            hideUnacquired: false
        };
        setParty(newParty);
    };

    const reorderPotentials = (slotIndex, sourceId, targetId) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;

            const currentOrder = slot.potentialOrder;
            const sourceIndex = currentOrder.indexOf(sourceId);
            const targetIndex = currentOrder.indexOf(targetId);

            if (sourceIndex === -1 || targetIndex === -1) return slot;

            const newOrder = reorder(currentOrder, sourceIndex, targetIndex);
            
            return {
                ...slot,
                potentialOrder: newOrder
            };
        });
        setParty(newParty);
    };

    const updatePotentialOrder = (slotIndex, newOrder) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                potentialOrder: newOrder
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
        setParty: setPartyData, // 正規化付きのセッターを公開
        isLoaded,
        updateSlot,
        updatePotential,
        clearSlot,
        reorderPotentials,
        updatePotentialOrder,
        updateSlotSettings,
        resetAll
    };
};