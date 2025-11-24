import { ELEMENTS } from './constants';
import fuyuka from './potentials/fuyuka';
import nanoha from './potentials/nanoha';
import freesia from './potentials/freesia';
import minova from './potentials/minova';
import mistique from './potentials/mistique';
import chixia from './potentials/chixia';
import gerie from './potentials/gerie';
import nazuna from './potentials/nazuna';
import chitose from './potentials/chitose';
import shia from './potentials/shia';
import amber from './potentials/amber';
import tilia from './potentials/tilia';
import kasimira from './potentials/kasimira';
import iris from './potentials/iris';
import noya from './potentials/noya';
import shimiao from './potentials/shimiao';
import ridge from './potentials/ridge';
import jinglin from './potentials/jinglin';
import coronis from './potentials/coronis';
import canace from './potentials/canace';
import cosette from './potentials/cosette';
import caramel from './potentials/caramel';
import laru from './potentials/laru';
import ann from './potentials/ann';
import flora from './potentials/flora';
import teresa from './potentials/teresa';

// 【修正】SKILL_STYLES -> POTENTIAL_STYLES に変更
export { ELEMENTS, POTENTIAL_STYLES } from './constants';

// 画像読み込みロジック
// src/data/index.js から見て ../assets/char_icon/
const iconFiles = import.meta.glob('../assets/char_icon/*.png', { eager: true });

const getIconImage = (charId) => {
    const path = `../assets/char_icon/icon_${charId}.png`;
    return iconFiles[path]?.default;
};

// 特定キャラのポテンシャルマップ
const SPECIFIC_POTENTIALS = {
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

// ポテンシャル生成ロジック (Factory)
const generatePotentials = (charId, elementLabel) => {
    const specific = SPECIFIC_POTENTIALS[charId];

    if (specific) {
        const mapPotentials = (list, typePrefix, isCore) => list.map((s, i) => ({
            id: `${charId}_${typePrefix}_${i + 1}`,
            name: s.name,
            description: s.description || '詳細情報はありません',
            type: isCore ? 'core' : 'passive',
            bgType: isCore ? 'core' : s.bgType,
            isCore: isCore
        }));

        return {
            mainCore: mapPotentials(specific.mainCore, 'mc', true),
            mainSub: mapPotentials(specific.mainSub, 'ms', false),
            supportCore: mapPotentials(specific.supportCore, 'sc', true),
            supportSub: mapPotentials(specific.supportSub, 'ss', false),
        };
    }

    // データがないキャラ用のモック生成
    const createCore = (prefix) => 
        Array.from({ length: 4 }, (_, i) => ({
            id: `${charId}_${prefix}_c_${i + 1}`,
            name: `${elementLabel}コア${i + 1}`,
            description: `未実装キャラクターのため、ポテンシャル${i + 1}の仮テキストが表示されています。`,
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
            description: `未実装キャラクターのため、ポテンシャル${i + 1}の仮テキストが表示されています。`,
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

export const CHARACTERS = RAW_CHARACTERS.map(char => ({
    ...char,
    imagePath: getIconImage(char.id),
    potentialSets: generatePotentials(char.id, char.element.label)
}));