import { CHARACTERS } from '../data';

// --- 定数・変換マップ ---

const VERSION_PREFIX = 'v1';

// 優先度とレベルを1文字に圧縮するためのマップ (0:未取得, 1-18:取得済み)
const POTENTIAL_VAL_CHARS = "0123456789abcdefghi"; 

// 0-11 のインデックスを1文字で表すマップ (順序保存用)
const ORDER_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

// --- ヘルパー関数 ---

// ポテンシャル情報(Level, Priority)を数値(0-18)に変換
const encodePotentialVal = (potential) => {
    if (!potential || potential.level === 0) return 0;
    const pVal = potential.priority === 'high' ? 3 : potential.priority === 'low' ? 1 : 2; // medium=2
    return (potential.level - 1) * 3 + pVal;
};

// 数値(0-18)をポテンシャル情報オブジェクトに復元
const decodePotentialVal = (val) => {
    if (val === 0) return { level: 0, priority: 'medium' };
    const level = Math.ceil(val / 3);
    const rem = val % 3;
    const priority = rem === 0 ? 'high' : rem === 1 ? 'low' : 'medium';
    return { level, priority };
};

// --- 圧縮ロジック ---

const compressSlot = (slot) => {
    return "";
};

// 全体圧縮
const compress = (state) => {
    const compressedSlots = state.map((slot, index) => {
        if (!slot.charId) return "";

        const charIdx = CHARACTERS.findIndex(c => c.id === slot.charId);
        if (charIdx === -1) return "";
        const charData = CHARACTERS[charIdx];

        // スロット位置(0=Main, 1,2=Support) に応じて参照するポテンシャルリストを決定
        const categoryPrefix = index === 0 ? 'main' : 'support';
        // data/index.js で potentialSets にリネーム済みであることを前提
        const corePotentials = charData.potentialSets[`${categoryPrefix}Core`];
        const subPotentials = charData.potentialSets[`${categoryPrefix}Sub`];

        // ★互換性対応: 新旧どちらのプロパティ名でも動くようにする
        const currentPotentials = slot.potentials || slot.skills || {};
        const currentOrder = slot.potentialOrder || slot.skillOrder || [];

        // 1. コアポテンシャル (4つ, ON/OFFのみ)
        let coreBits = 0;
        corePotentials.forEach((s, i) => {
            if ((currentPotentials[s.id]?.level || 0) > 0) {
                coreBits |= (1 << i);
            }
        });
        const coreStr = coreBits.toString(16);

        // 2. サブポテンシャル (可変長, 0-18)
        let subStr = "";
        subPotentials.forEach(s => {
            const val = encodePotentialVal(currentPotentials[s.id]);
            subStr += POTENTIAL_VAL_CHARS[val];
        });

        // 3. 設定フラグ
        let flagVal = 0;
        if (slot.sortMode === 'priority') flagVal += 1;
        if (slot.sortMode === 'level') flagVal += 2;
        if (slot.hideUnacquired) flagVal += 4;
        const flagStr = flagVal.toString(16); 

        // 4. 並び順 (Order)
        const defaultOrder = subPotentials.map(s => s.id);
        
        // currentOrderからSubポテンシャルのIDだけを抽出
        const currentSubOrder = currentOrder.filter(id => subPotentials.some(s => s.id === id));
        
        let orderStr = "";
        let isDefault = true;
        if (currentSubOrder.length !== defaultOrder.length) {
            isDefault = false;
        } else {
            for (let i = 0; i < defaultOrder.length; i++) {
                if (currentSubOrder[i] !== defaultOrder[i]) {
                    isDefault = false;
                    break;
                }
            }
        }

        if (!isDefault) {
            const indices = currentSubOrder.map(id => {
                return subPotentials.findIndex(s => s.id === id);
            });
            orderStr = indices.map(i => (i >= 0 && i < ORDER_CHARS.length) ? ORDER_CHARS[i] : "0").join("");
        }

        // 結合
        const baseData = `${charIdx.toString(36)}_${coreStr}${subStr}${flagStr}`;
        return orderStr ? `${baseData}_${orderStr}` : baseData;
    });

    return `${VERSION_PREFIX}.${compressedSlots.join('.')}`;
};

// --- 復元ロジック ---

const decompress = (hash) => {
    // バージョンチェック & 旧形式フォールバック
    if (!hash.startsWith(VERSION_PREFIX + '.')) {
        try {
            const json = decodeURIComponent(escape(atob(hash)));
            const parsed = JSON.parse(json);
            // 旧JSON形式(skillsプロパティを持つ)の場合、
            // 呼び出し元で変換してもらうか、ここで変換して返す
            if (Array.isArray(parsed)) {
                return parsed.map(slot => ({
                    ...slot,
                    // 旧データ(skills)を新データ(potentials)にマッピング
                    potentials: slot.skills || {},
                    potentialOrder: slot.skillOrder || [],
                    // 旧プロパティは削除しても良いが、念のため残しても害はない
                    // skills: undefined, 
                    // skillOrder: undefined
                }));
            }
            return null;
        } catch {
            return null;
        }
    }

    const content = hash.substring(VERSION_PREFIX.length + 1);
    const slotStrings = content.split('.');

    return slotStrings.map((str, index) => {
        // 空スロットのデフォルト値も新プロパティ名にする
        if (!str) return { charId: null, potentials: {}, potentialOrder: [], sortMode: 'default', hideUnacquired: false };

        const parts = str.split('_');
        const charIdxStr = parts[0];
        const dataStr = parts[1]; 
        const orderStr = parts[2]; 

        const charIdx = parseInt(charIdxStr, 36);
        const charData = CHARACTERS[charIdx];
        if (!charData) return { charId: null, potentials: {}, potentialOrder: [], sortMode: 'default', hideUnacquired: false };

        const categoryPrefix = index === 0 ? 'main' : 'support';
        // potentialSets を参照
        const corePotentialsDef = charData.potentialSets[`${categoryPrefix}Core`];
        const subPotentialsDef = charData.potentialSets[`${categoryPrefix}Sub`];

        const potentials = {};
        let potentialOrder = [];

        // 1. Core復元
        const coreVal = parseInt(dataStr[0], 16);
        corePotentialsDef.forEach((s, i) => {
            const isAcquired = (coreVal & (1 << i)) !== 0;
            potentials[s.id] = { level: isAcquired ? 1 : 0, priority: 'medium' };
        });

        // 2. Sub復元
        subPotentialsDef.forEach((s, i) => {
            const charCode = dataStr[i + 1];
            const val = POTENTIAL_VAL_CHARS.indexOf(charCode);
            potentials[s.id] = decodePotentialVal(val !== -1 ? val : 0);
        });

        // 3. Flag復元
        const flagIndex = 1 + subPotentialsDef.length;
        const flagChar = dataStr[flagIndex];
        const flagVal = flagChar ? parseInt(flagChar, 16) : 0;
        
        const hideUnacquired = (flagVal & 4) !== 0;
        const sortModeVal = flagVal & 3;
        const sortMode = sortModeVal === 1 ? 'priority' : sortModeVal === 2 ? 'level' : 'default';

        // 4. Order復元
        if (orderStr && orderStr.length === subPotentialsDef.length) {
            const subOrder = orderStr.split('').map(c => {
                const idx = ORDER_CHARS.indexOf(c);
                return subPotentialsDef[idx]?.id;
            }).filter(Boolean);
            
            const coreIds = corePotentialsDef.map(s => s.id);
            potentialOrder = [...coreIds, ...subOrder];
        } else {
            potentialOrder = [
                ...corePotentialsDef.map(s => s.id),
                ...subPotentialsDef.map(s => s.id)
            ];
        }

        // 新しいプロパティ名で返す
        return {
            charId: charData.id,
            potentials,       // skills -> potentials
            potentialOrder,   // skillOrder -> potentialOrder
            sortMode,
            hideUnacquired
        };
    });
};

// --- エクスポート ---

export const generateShareHash = (state) => {
    return `#${compress(state)}`;
};

export const loadFromUrl = () => {
    try {
        const hash = window.location.hash;
        if (!hash) return null;
        
        let content = hash.substring(1); 
        if (content.startsWith('build=')) {
            content = content.replace('build=', '');
            return decompress(content); 
        } else if (content.startsWith(VERSION_PREFIX)) {
            return decompress(content);
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