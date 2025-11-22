import { ELEMENTS } from './constants';
import fuyuka from './skills/fuyuka';
import nanoha from './skills/nanoha';
import freesia from './skills/freesia';
import minova from './skills/minova';
import mistique from './skills/mistique';
import chixia from './skills/chixia';
import gerie from './skills/gerie';
import nazuna from './skills/nazuna';
import chitose from './skills/chitose';
import shia from './skills/shia';
import amber from './skills/amber';
import tilia from './skills/tilia';
import kasimira from './skills/kasimira';
import iris from './skills/iris';
import noya from './skills/noya';
import shimiao from './skills/shimiao';
import ridge from './skills/ridge';
import jinglin from './skills/jinglin';
import coronis from './skills/coronis';
import canace from './skills/canace';
import cosette from './skills/cosette';
import caramel from './skills/caramel';
import laru from './skills/laru';
import ann from './skills/ann';
import flora from './skills/flora';
import teresa from './skills/teresa';

// 他のファイルからも使えるよう再エクスポート
export { ELEMENTS, SKILL_STYLES } from './constants';

// --- 画像読み込みロジック (追加) ---
// src/assets/char_icon/ フォルダ内の全pngファイルを一括インポートします
// ※ eager: true にすることで、非同期ではなく即座にパスを取得します
const iconFiles = import.meta.glob('../assets/char_icon/*.png', { eager: true });

// キャラクターIDから画像パスを取得する関数
const getIconImage = (charId) => {
    // このファイル(src/data/index.js)から見た画像の相対パス
    // フォルダ構成が src/assets/char_icon/ であることを前提としています
    const path = `../assets/char_icon/icon_${charId}.png`;
    return iconFiles[path]?.default;
};
// ----------------------------------

// 特定キャラのスキルマップ
const SPECIFIC_SKILLS = {
    fuyuka,
    nanoha,
    freesia,
    minova,
    mistique,
    chixia, 
    gerie,   
    nazuna,
    chitose,
    shia,
    amber,
    tilia,
    kasimira,
    iris,
    noya,
    shimiao,
    ridge,
    jinglin,
    coronis,
    canace,
    cosette,
    caramel,
    laru,
    ann,
    flora,
    teresa,
};

// スキル生成ロジック (Factory)
const generateSkills = (charId, elementLabel) => {
    const specific = SPECIFIC_SKILLS[charId];

    if (specific) {
        const mapSkills = (list, typePrefix, isCore) => list.map((s, i) => ({
            id: `${charId}_${typePrefix}_${i + 1}`,
            name: s.name,
            description: s.description || '詳細情報はありません',
            type: isCore ? 'core' : 'passive',
            bgType: isCore ? 'core' : s.bgType,
            isCore: isCore
        }));

        return {
            mainCore: mapSkills(specific.mainCore, 'mc', true),
            mainSub: mapSkills(specific.mainSub, 'ms', false),
            supportCore: mapSkills(specific.supportCore, 'sc', true),
            supportSub: mapSkills(specific.supportSub, 'ss', false),
        };
    }

    // データがないキャラ用のモック生成
    const createCore = (prefix) => 
        Array.from({ length: 4 }, (_, i) => ({
            id: `${charId}_${prefix}_c_${i + 1}`,
            name: `${elementLabel}コア${i + 1}`,
            description: `未実装キャラクターのため、スキル${i + 1}の仮テキストが表示されています。`,
            type: 'core',
            bgType: 'core',
            isCore: true
        }));

    const createSub = (prefix) => {
        const configs = [
            { label: '特化1(色)', bgType: 'special' },
            { label: '特化1', bgType: 'normal' },
            { label: '特化1', bgType: 'normal' },
            { label: '特化2(色)', bgType: 'special' },
            { label: '特化2', bgType: 'normal' },
            { label: '特化2', bgType: 'normal' },
            { label: '汎用(色)', bgType: 'special' },
            { label: '汎用', bgType: 'normal' },
            { label: '汎用', bgType: 'normal' },
            { label: '汎用', bgType: 'normal' },
            { label: '汎用', bgType: 'normal' },
            { label: '汎用', bgType: 'normal' },
        ];

        return configs.map((conf, i) => ({
            id: `${charId}_${prefix}_s_${i + 1}`,
            name: `${elementLabel}${conf.label}`,
            description: `未実装キャラクターのため、スキル${i + 1}の仮テキストが表示されています。`,
            type: 'passive',
            bgType: conf.bgType,
            isCore: false
        }));
    };

    return {
        mainCore: createCore('m'),
        mainSub: createSub('m'),
        supportCore: createCore('s'),
        supportSub: createSub('s'),
    };
};

// キャラクターリスト定義
// imagePathの指定は削除しても構いませんが、残っていても下部のmapで上書きされるので問題ありません
const RAW_CHARACTERS = [
    { id: 'fuyuka', name: 'フユカ', element: ELEMENTS.FIRE, role: 'アタッカー', rank: 5 },
    { id: 'shia', name: 'シア', element: ELEMENTS.LIGHT, role: 'アタッカー', rank: 5 },
    { id: 'chitose', name: 'チトセ', element: ELEMENTS.WATER, role: 'アタッカー', rank: 5 },
    { id: 'nazuna', name: 'ナズナ', element: ELEMENTS.EARTH, role: 'サポーター', rank: 5 },
    { id: 'gerie', name: 'グレイ', element: ELEMENTS.EARTH, role: 'アタッカー', rank: 5 },
    { id: 'chixia', name: 'チーシア', element: ELEMENTS.FIRE, role: 'バランサー', rank: 5 },
    { id: 'nanoha', name: 'ナノハ', element: ELEMENTS.WIND, role: 'アタッカー', rank: 5 },
    { id: 'freesia', name: 'フリージア', element: ELEMENTS.WATER, role: 'バランサー', rank: 5 },
    { id: 'minova', name: 'ミネルバ', element: ELEMENTS.LIGHT, role: 'バランサー', rank: 5 },
    { id: 'mistique', name: 'ミスティ', element: ELEMENTS.DARK, role: 'バランサー', rank: 5 },
    { id: 'noya', name: 'セイナ', element: ELEMENTS.WIND, role: 'アタッカー', rank: 4 },
    { id: 'amber', name: 'コハク', element: ELEMENTS.FIRE, role: 'アタッカー', rank: 4 },
    { id: 'iris', name: 'アヤメ', element: ELEMENTS.WATER, role: 'バランサー', rank: 4 },
    { id: 'ann', name: 'アンズ', element: ELEMENTS.WIND, role: 'サポーター', rank: 4 },
    { id: 'jinglin', name: 'ジンリン', element: ELEMENTS.LIGHT, role: 'バランサー', rank: 4 },
    { id: 'teresa', name: 'テレサ', element: ELEMENTS.WATER, role: 'サポーター', rank: 4 },
    { id: 'tilia', name: 'ティリア', element: ELEMENTS.LIGHT, role: 'サポーター', rank: 4 },
    { id: 'kasimira', name: 'カシミラ', element: ELEMENTS.FIRE, role: 'バランサー', rank: 4 },
    { id: 'shimiao', name: 'シーミャオ', element: ELEMENTS.WATER, role: 'アタッカー', rank: 4 },
    { id: 'ridge', name: 'レイセン', element: ELEMENTS.EARTH, role: 'バランサー', rank: 4 },
    { id: 'coronis', name: 'クルニス', element: ELEMENTS.DARK, role: 'バランサー', rank: 4 },
    { id: 'canace', name: 'カナーチェ', element: ELEMENTS.WIND, role: 'バランサー', rank: 4 },
    { id: 'cosette', name: 'コゼット', element: ELEMENTS.DARK, role: 'サポーター', rank: 4 },
    { id: 'caramel', name: 'キャラメル', element: ELEMENTS.DARK, role: 'アタッカー', rank: 4 },
    { id: 'laru', name: 'ラール', element: ELEMENTS.LIGHT, role: 'アタッカー', rank: 4 },
    { id: 'flora', name: 'フローラ', element: ELEMENTS.FIRE, role: 'バランサー', rank: 4 },
];

// ここで画像を動的に割り当てます
export const CHARACTERS = RAW_CHARACTERS.map(char => ({
    ...char,
    // IDに基づいて画像を自動設定 (例: id='fuyuka' -> icon_fuyuka.png)
    imagePath: getIconImage(char.id),
    skillSets: generateSkills(char.id, char.element.label)
}));