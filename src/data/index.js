import { ELEMENTS } from './constants';
import fuyuka from './skills/fuyuka';
import nanoha from './skills/nanoha';
import freesia from './skills/freesia';
import minova from './skills/minova';     // minerva -> minova
import mistique from './skills/mistique'; // misty -> mistique
import chixia from './skills/chixia';     // chisia -> chixia
import gerie from './skills/gerie';       // grey -> gerie
import nazuna from './skills/nazuna';
import chitose from './skills/chitose';
import shia from './skills/shia';
import amber from './skills/amber';       // kohaku -> amber
import tilia from './skills/tilia';
import kasimira from './skills/kasimira';
import iris from './skills/iris';         // ayame -> iris
import noya from './skills/noya';         // seina -> noya
import shimiao from './skills/shimiao';
import ridge from './skills/ridge';
import jinglin from './skills/jinglin';
import coronis from './skills/coronis';
import canace from './skills/canace';
import cosette from './skills/cosette';
import caramel from './skills/caramel';
import laru from './skills/laru';
import ann from './skills/ann';           // anzu -> ann
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
const RAW_CHARACTERS = [
    { id: 'fuyuka', uid: 134, name: 'フユカ', element: ELEMENTS.FIRE, role: 'アタッカー', rank: 5 },
    { id: 'shia', uid: 155, name: 'シア', element: ELEMENTS.LIGHT, role: 'アタッカー', rank: 5 },
    { id: 'chitose', uid: 144, name: 'チトセ', element: ELEMENTS.WATER, role: 'アタッカー', rank: 5 },
    { id: 'nazuna', uid: 156, name: 'ナズナ', element: ELEMENTS.EARTH, role: 'サポーター', rank: 5 },
    { id: 'gerie', uid: 149, name: 'グレイ', element: ELEMENTS.EARTH, role: 'アタッカー', rank: 5 },
    { id: 'chixia', uid: 141, name: 'チーシア', element: ELEMENTS.FIRE, role: 'バランサー', rank: 5 },
    { id: 'nanoha', uid: 119, name: 'ナノハ', element: ELEMENTS.WIND, role: 'アタッカー', rank: 5 },
    { id: 'freesia', uid: 125, name: 'フリージア', element: ELEMENTS.WATER, role: 'バランサー', rank: 5 },
    { id: 'minova', uid: 132, name: 'ミネルバ', element: ELEMENTS.LIGHT, role: 'バランサー', rank: 5 },
    { id: 'mistique', uid: 135, name: 'ミスティ', element: ELEMENTS.DARK, role: 'バランサー', rank: 5 },
    { id: 'noya', uid: 112, name: 'セイナ', element: ELEMENTS.WIND, role: 'アタッカー', rank: 4 },
    { id: 'amber', uid: 103, name: 'コハク', element: ELEMENTS.FIRE, role: 'アタッカー', rank: 4 },
    { id: 'iris', uid: 111, name: 'アヤメ', element: ELEMENTS.WATER, role: 'バランサー', rank: 4 },
    { id: 'ann', uid: 123, name: 'アンズ', element: ELEMENTS.WIND, role: 'サポーター', rank: 4 },
    { id: 'jinglin', uid: 117, name: 'ジンリン', element: ELEMENTS.LIGHT, role: 'バランサー', rank: 4 },
    { id: 'teresa', uid: 127, name: 'テレサ', element: ELEMENTS.WATER, role: 'サポーター', rank: 4 },
    { id: 'tilia', uid: 107, name: 'ティリア', element: ELEMENTS.LIGHT, role: 'サポーター', rank: 4 },
    { id: 'kasimira', uid: 108, name: 'カシミラ', element: ELEMENTS.FIRE, role: 'バランサー', rank: 4 },
    { id: 'shimiao', uid: 113, name: 'シーミャオ', element: ELEMENTS.WATER, role: 'アタッカー', rank: 4 },
    { id: 'ridge', uid: 116, name: 'レイセン', element: ELEMENTS.EARTH, role: 'バランサー', rank: 4 },
    { id: 'coronis', uid: 118, name: 'クルニス', element: ELEMENTS.DARK, role: 'バランサー', rank: 4 },
    { id: 'canace', uid: 120, name: 'カナーチェ', element: ELEMENTS.WIND, role: 'バランサー', rank: 4 },
    { id: 'cosette', uid: 142, name: 'コゼット', element: ELEMENTS.DARK, role: 'サポーター', rank: 4 },
    { id: 'caramel', uid: 147, name: 'キャラメル', element: ELEMENTS.DARK, role: 'アタッカー', rank: 4 },
    { id: 'laru', uid: 150, name: 'ラール', element: ELEMENTS.LIGHT, role: 'アタッカー', rank: 4 },
    { id: 'flora', uid: 126, name: 'フローラ', element: ELEMENTS.FIRE, role: 'バランサー', rank: 4 },
];

// ここで画像を動的に割り当てます
export const CHARACTERS = RAW_CHARACTERS.map(char => ({
    ...char,
    // IDに基づいて画像を自動設定 (例: id='fuyuka' -> icon_fuyuka.png)
    imagePath: getIconImage(char.id),
    skillSets: generateSkills(char.id, char.element.label)
}));