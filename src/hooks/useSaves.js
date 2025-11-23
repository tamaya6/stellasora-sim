import { useState, useEffect } from 'react';

const STORAGE_KEY = 'stellasora_saves';

export const useSaves = () => {
    const [saves, setSaves] = useState(Array(6).fill(null));

    // 初期化時にLocalStorageから復元
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setSaves(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse save data", e);
            }
        }
    }, []);

    // データの永続化ヘルパー
    const persist = (newSaves) => {
        setSaves(newSaves);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaves));
    };

    const saveGame = (index, partyData) => {
        const newSaves = [...saves];
        // 参照を切るためにディープコピーして保存
        newSaves[index] = {
            timestamp: new Date().toLocaleString(),
            party: JSON.parse(JSON.stringify(partyData))
        };
        persist(newSaves);
    };

    const deleteGame = (index) => {
        const newSaves = [...saves];
        newSaves[index] = null;
        persist(newSaves);
    };

    const loadGame = (index) => {
        if (!saves[index]) return null;
        // ロード時もディープコピーして渡す（参照切れを保証）
        return JSON.parse(JSON.stringify(saves[index].party));
    };

    return {
        saves,
        saveGame,
        deleteGame,
        loadGame
    };
};