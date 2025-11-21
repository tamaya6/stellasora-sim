// URL圧縮保存・ロード、配列操作などのユーティリティ関数

export const saveToUrl = (state) => {
    try {
        const json = JSON.stringify(state);
        const compressed = btoa(unescape(encodeURIComponent(json)));
        window.history.replaceState(null, '', `#build=${compressed}`);
    } catch (e) {
        console.error("Save failed", e);
    }
};

export const loadFromUrl = () => {
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

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};