import { CHARACTERS } from '../data';

// --- 定数・変換マップ ---

// バージョン識別子（将来のフォーマット変更に備える）
const VERSION_PREFIX = 'v1';

// 優先度とレベルを1文字に圧縮するためのマップ (0:未取得, 1-18:取得済み)
// 0: Lv0
// 1: Lv1 Low, 2: Lv1 Mid, 3: Lv1 High
// 4: Lv2 Low, ...
// 18: Lv6 High
const SKILL_VAL_CHARS = "0123456789abcdefghi"; 

// 0-11 のインデックスを1文字で表すマップ (順序保存用)
// 12個以上に対応するため文字セットを拡張しておく（念のため）
const ORDER_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

// --- ヘルパー関数 ---

// スキル情報(Level, Priority)を数値(0-18)に変換
const encodeSkillVal = (skill) => {
    if (!skill || skill.level === 0) return 0;
    const pVal = skill.priority === 'high' ? 3 : skill.priority === 'low' ? 1 : 2; // medium=2
    return (skill.level - 1) * 3 + pVal;
};

// 数値(0-18)をスキル情報オブジェクトに復元
const decodeSkillVal = (val) => {
    if (val === 0) return { level: 0, priority: 'medium' };
    const level = Math.ceil(val / 3);
    const rem = val % 3;
    const priority = rem === 0 ? 'high' : rem === 1 ? 'low' : 'medium';
    return { level, priority };
};

// --- 圧縮ロジック ---

const compressSlot = (slot) => {
    // (この関数は使われていませんが、念のため残すなら修正不要)
    return "";
};

// 全体圧縮
const compress = (state) => {
    const compressedSlots = state.map((slot, index) => {
        if (!slot.charId) return "";

        const charIdx = CHARACTERS.findIndex(c => c.id === slot.charId);
        if (charIdx === -1) return "";
        const charData = CHARACTERS[charIdx];

        // スロット位置(0=Main, 1,2=Support) に応じて参照するスキルリストを決定
        const categoryPrefix = index === 0 ? 'main' : 'support';
        const coreSkills = charData.skillSets[`${categoryPrefix}Core`];
        const subSkills = charData.skillSets[`${categoryPrefix}Sub`];

        // 1. コアスキル (4つ, ON/OFFのみ) -> 2進数4桁 -> 16進数1文字
        let coreBits = 0;
        coreSkills.forEach((s, i) => {
            if ((slot.skills[s.id]?.level || 0) > 0) {
                coreBits |= (1 << i);
            }
        });
        const coreStr = coreBits.toString(16);

        // 2. サブスキル (可変長, 0-18) -> カスタム文字N文字
        let subStr = "";
        subSkills.forEach(s => {
            const val = encodeSkillVal(slot.skills[s.id]);
            subStr += SKILL_VAL_CHARS[val];
        });

        // 3. 設定フラグ (SortMode, HideUnacquired)
        // SortMode: default=0, priority=1, level=2
        // Hide: false=0, true=4
        let flagVal = 0;
        if (slot.sortMode === 'priority') flagVal += 1;
        if (slot.sortMode === 'level') flagVal += 2;
        if (slot.hideUnacquired) flagVal += 4;
        const flagStr = flagVal.toString(16); // 0-7

        // 4. 並び順 (Order)
        // デフォルト順（subSkillsのID順）と異なる場合のみ保存
        const defaultOrder = subSkills.map(s => s.id);
        const currentOrder = slot.skillOrder; 
        
        // currentOrderからSubスキルのIDだけを抽出
        const currentSubOrder = currentOrder.filter(id => subSkills.some(s => s.id === id));
        
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
            // 並び順をインデックス列に変換
            const indices = currentSubOrder.map(id => {
                return subSkills.findIndex(s => s.id === id);
            });
            orderStr = indices.map(i => (i >= 0 && i < ORDER_CHARS.length) ? ORDER_CHARS[i] : "0").join("");
        }

        // 結合: CharIdx(Base36) + "_" + Core(1) + Sub(N) + Flag(1) + [ "_" + Order(N) ]
        const baseData = `${charIdx.toString(36)}_${coreStr}${subStr}${flagStr}`;
        return orderStr ? `${baseData}_${orderStr}` : baseData;
    });

    // スロット間は "." で結合
    return `${VERSION_PREFIX}.${compressedSlots.join('.')}`;
};

// --- 復元ロジック ---

const decompress = (hash) => {
    // バージョンチェック
    if (!hash.startsWith(VERSION_PREFIX + '.')) {
        // 新形式でない場合、旧形式（JSON）としてトライ
        try {
            const json = decodeURIComponent(escape(atob(hash)));
            const parsed = JSON.parse(json);
            return Array.isArray(parsed) ? parsed : null;
        } catch {
            return null;
        }
    }

    const content = hash.substring(VERSION_PREFIX.length + 1); // "v1." を除去
    const slotStrings = content.split('.');

    return slotStrings.map((str, index) => {
        if (!str) return { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false };

        const parts = str.split('_');
        const charIdxStr = parts[0];
        const dataStr = parts[1]; // Core(1) + Sub(N) + Flag(1)
        const orderStr = parts[2]; // Optional

        const charIdx = parseInt(charIdxStr, 36);
        const charData = CHARACTERS[charIdx];
        if (!charData) return { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false };

        const categoryPrefix = index === 0 ? 'main' : 'support';
        const coreSkillsDef = charData.skillSets[`${categoryPrefix}Core`];
        const subSkillsDef = charData.skillSets[`${categoryPrefix}Sub`];

        const skills = {};
        let skillOrder = [];

        // 1. Core復元 (1文字目)
        const coreVal = parseInt(dataStr[0], 16);
        coreSkillsDef.forEach((s, i) => {
            const isAcquired = (coreVal & (1 << i)) !== 0;
            skills[s.id] = { level: isAcquired ? 1 : 0, priority: 'medium' };
        });

        // 2. Sub復元 (2文字目からSub数分)
        // 修正: 固定12回ではなく、定義されているサブスキル数分ループする
        subSkillsDef.forEach((s, i) => {
            const charCode = dataStr[i + 1];
            const val = SKILL_VAL_CHARS.indexOf(charCode);
            skills[s.id] = decodeSkillVal(val !== -1 ? val : 0);
        });

        // 3. Flag復元 (Core(1) + Sub(N) の次の文字)
        // 修正: 固定13番目ではなく、動的に位置を特定
        const flagIndex = 1 + subSkillsDef.length;
        const flagChar = dataStr[flagIndex];
        // 古いURLなどでflagが無い場合のガード
        const flagVal = flagChar ? parseInt(flagChar, 16) : 0;
        
        const hideUnacquired = (flagVal & 4) !== 0;
        const sortModeVal = flagVal & 3;
        const sortMode = sortModeVal === 1 ? 'priority' : sortModeVal === 2 ? 'level' : 'default';

        // 4. Order復元
        if (orderStr && orderStr.length === subSkillsDef.length) {
            // インデックス列からID列へ変換
            const subOrder = orderStr.split('').map(c => {
                const idx = ORDER_CHARS.indexOf(c);
                return subSkillsDef[idx]?.id;
            }).filter(Boolean);
            
            // コアスキルのID（順序は定義順）+ サブスキルの順序
            const coreIds = coreSkillsDef.map(s => s.id);
            skillOrder = [...coreIds, ...subOrder];
        } else {
            // デフォルト順
            skillOrder = [
                ...coreSkillsDef.map(s => s.id),
                ...subSkillsDef.map(s => s.id)
            ];
        }

        return {
            charId: charData.id,
            skills,
            skillOrder,
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
        
        let content = hash.substring(1); // #除去
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