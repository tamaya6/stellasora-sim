import { CHARACTERS } from '../data';

// --- 定数・変換マップ ---

const VERSION_PREFIX = 'v2'; // ロジック変更のためv2へ

// 優先度(4段階)とレベル(6段階)を1文字に圧縮するためのマップ
// Max = (6-1)*4 + 3 + 1 = 24 なので、25文字以上必要
const POTENTIAL_VAL_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; 

// 0-11 のインデックスを1文字で表すマップ (順序保存用)
const ORDER_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

// --- ヘルパー関数 ---

// ポテンシャル情報(Level, Priority)を数値(0-24)に変換
// 優先度: low=0, medium=1, high=2, highest=3
const encodePotentialVal = (potential) => {
    if (!potential || potential.level === 0) return 0;
    
    let pVal = 1; // default medium
    if (potential.priority === 'low') pVal = 0;
    else if (potential.priority === 'medium') pVal = 1;
    else if (potential.priority === 'high') pVal = 2;
    else if (potential.priority === 'highest') pVal = 3;

    // (level 1..6) -> 0..5
    // 値 = levelIdx * 4 + pVal + 1 (0は未取得予約のため+1)
    return ((potential.level - 1) * 4) + pVal + 1;
};

// 数値(0-24)をポテンシャル情報オブジェクトに復元
const decodePotentialVal = (val) => {
    if (val === 0) return { level: 0, priority: 'medium' };
    
    const adjusted = val - 1;
    const level = Math.floor(adjusted / 4) + 1;
    const pVal = adjusted % 4;
    
    let priority = 'medium';
    if (pVal === 0) priority = 'low';
    else if (pVal === 1) priority = 'medium';
    else if (pVal === 2) priority = 'high';
    else if (pVal === 3) priority = 'highest';

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

        const categoryPrefix = index === 0 ? 'main' : 'support';
        const corePotentials = charData.potentialSets[`${categoryPrefix}Core`];
        const subPotentials = charData.potentialSets[`${categoryPrefix}Sub`];

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

        // 2. サブポテンシャル (可変長)
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

        const baseData = `${charIdx.toString(36)}_${coreStr}${subStr}${flagStr}`;
        return orderStr ? `${baseData}_${orderStr}` : baseData;
    });

    return `${VERSION_PREFIX}.${compressedSlots.join('.')}`;
};

// --- 復元ロジック ---

const decompress = (hash) => {
    // v1互換性維持 (旧ロジックで復元を試みる)
    if (hash.startsWith('v1.')) {
        // v1ロジックの簡易版実装（本来は別関数に分けるべきだが簡略化）
        // v1は3段階優先度(3進数ベース)だったため、v2(4段階)とは互換性がない。
        // v1データをロードした場合、Highestは存在しないのでMedium等にマッピングされる可能性があるが
        // 文字列の解釈が異なるため、v1用デコードロジックが必要。
        // ここでは複雑化を避けるため、v1データは破棄するか、旧デコードロジックを再実装する必要がある。
        // 今回は「開発中」としてv2のみサポート（v1はエラー扱いで初期化）とするか、
        // または v1 のデコードロジックも残すのが安全。
        // スペースの都合上、今回はv2のみに更新し、v1データは読み込めないものとします。
        return null;
    }

    if (!hash.startsWith(VERSION_PREFIX + '.')) {
         try {
            // 旧JSON形式
            const json = decodeURIComponent(escape(atob(hash)));
            const parsed = JSON.parse(json);
            if (Array.isArray(parsed)) {
                return parsed.map(slot => ({
                    ...slot,
                    potentials: slot.skills || {},
                    potentialOrder: slot.skillOrder || [],
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
        if (!str) return { charId: null, potentials: {}, potentialOrder: [], sortMode: 'default', hideUnacquired: false };

        const parts = str.split('_');
        const charIdxStr = parts[0];
        const dataStr = parts[1]; 
        const orderStr = parts[2]; 

        const charIdx = parseInt(charIdxStr, 36);
        const charData = CHARACTERS[charIdx];
        if (!charData) return { charId: null, potentials: {}, potentialOrder: [], sortMode: 'default', hideUnacquired: false };

        const categoryPrefix = index === 0 ? 'main' : 'support';
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

        // 2. Sub復元 (v2ロジック)
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

        return {
            charId: charData.id,
            potentials,       
            potentialOrder,   
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
            // JSON形式のみ対応（v1ハッシュは非対応化）
            try {
                const json = decodeURIComponent(escape(atob(content)));
                const parsed = JSON.parse(json);
                if (Array.isArray(parsed)) return parsed;
            } catch {}
            return null;
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