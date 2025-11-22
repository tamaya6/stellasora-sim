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
const ORDER_CHARS = "0123456789ab";

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
    if (!slot.charId) return ""; // キャラ未選択は空文字

    // 1. キャラクターIDのインデックス化
    const charIdx = CHARACTERS.findIndex(c => c.id === slot.charId);
    if (charIdx === -1) return "";
    // Base36 (0-9, a-z) で短縮
    const charStr = charIdx.toString(36);

    // キャラのスキル定義を取得
    const charData = CHARACTERS[charIdx];
    const isMain = charData.role === 'アタッカー'; // 簡易判定（実際はスロット位置依存だが、復元時に再構築するため問題なし）
    // ※注意: slotIndex情報はここでは持っていないため、復元時に skillSets の main/support どちらを使うかは slotIndex に委ねられる。
    // データ上は CHARACTERS の skillSets は main/support 両方持っている。
    // ここでは単に「保持されているスキルの値」を順番に並べる。
    // ただし、App.jsxのstate構造上、skillsオブジェクトのキーは `charId_prefix_index` となっている。
    
    // スキル定義順に値を抽出
    // Core(4) + Sub(12) の順で固定と仮定
    // Main/Supportの区別が必要。slotオブジェクト自体は区別を持っていないが、
    // App.jsxの構造上、Slot1=Main, Slot2/3=Support と決まっている。
    // しかし compress 関数は配列を受け取るので、index 0 は Main, 1,2 は Support として処理する。
    // ここでは compressSlot を呼び出す側でコンテキストを判断するのは複雑になるため、
    // 「ID文字列」に含まれる "mc"(MainCore) "sc"(SupportCore) などを解析して値を抽出する。

    // より堅牢な方法: CHARACTERS定義からIDを生成し、そのIDの値を look up する
    let skillValStr = "";
    
    // MainかSupportか判定: スキルIDを一つ見て判断
    const sampleKey = Object.keys(slot.skills)[0];
    const isMainSlot = sampleKey && sampleKey.includes('_m'); 
    // もしスキルが一つも習得されていない場合は判断できないが、その場合はLv0埋めで良い。
    // ただし、空の状態でも Core/Sub の枠組みは決まっている。
    // ここでは「このスロットがMainかSupportか」を引数で貰う形にするよう `compress` を修正する。
    
    return ""; // 個別呼び出しはしない設計に変更
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

        // 2. サブスキル (12つ, 0-18) -> カスタム文字12文字
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
        const currentOrder = slot.skillOrder; // ここにはCoreも含まれる可能性があるが、Subだけの順序を抽出する
        
        // currentOrderからSubスキルのIDだけを抽出
        const currentSubOrder = currentOrder.filter(id => subSkills.some(s => s.id === id));
        
        let orderStr = "";
        // デフォルトと長さが違い、かつ中身の順序が違う場合
        // （通常は長さは同じはずだが、全スキルIDが含まれていない場合などを考慮）
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
            // 並び順をインデックス(0-11)の列に変換
            const indices = currentSubOrder.map(id => {
                return subSkills.findIndex(s => s.id === id);
            });
            // -1が含まれる（未知のID）場合はオーダー保存を諦める等のガード
            orderStr = indices.map(i => (i >= 0 && i < 12) ? ORDER_CHARS[i] : "0").join("");
        }

        // 結合: CharIdx(Base36) + "_" + Core(1) + Sub(12) + Flag(1) + [ "_" + Order(12) ]
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
        const dataStr = parts[1]; // Core(1) + Sub(12) + Flag(1) = 14文字
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

        // 2. Sub復元 (2-13文字目)
        subSkillsDef.forEach((s, i) => {
            const charCode = dataStr[i + 1];
            const val = SKILL_VAL_CHARS.indexOf(charCode);
            skills[s.id] = decodeSkillVal(val !== -1 ? val : 0);
        });

        // 3. Flag復元 (14文字目)
        const flagVal = parseInt(dataStr[13], 16);
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
        
        // #build= がついている旧形式か、#v1... の新形式か
        let content = hash.substring(1); // #除去
        if (content.startsWith('build=')) {
            content = content.replace('build=', '');
            // 旧形式デコーダへ（compress関数内のtry-catchで判定される）
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