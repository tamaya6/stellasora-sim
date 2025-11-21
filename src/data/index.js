import { ELEMENTS } from './constants';
import fuyuka from './skills/fuyuka';
import nanoha from './skills/nanoha';
import freesia from './skills/freesia';

// 他のファイルからも使えるよう再エクスポート
export { ELEMENTS, SKILL_STYLES } from './constants';

// 特定キャラのスキルマップ
const SPECIFIC_SKILLS = {
    fuyuka,
    nanoha,
    freesia,
    // 今後キャラを追加する場合はここにimportしたデータを足すだけでOK
};

// スキル生成ロジック (Factory)
const generateSkills = (charId, elementLabel) => {
    const specific = SPECIFIC_SKILLS[charId];

    if (specific) {
        // 特定データがある場合はそれをマッピング
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

    // データがないキャラ用のモック生成 (プレースホルダー)
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
export const CHARACTERS = [
    { id: 'fuyuka', name: 'フユカ', element: ELEMENTS.FIRE, role: 'アタッカー', rank: 5, imagePath: '/src/assets/char_icon/icon_fuyuka.png' },
    { id: 'shia', name: 'シア', element: ELEMENTS.LIGHT, role: 'アタッカー', rank: 5, imagePath: '/src/assets/char_icon/icon_shia.png' },
    { id: 'chitose', name: 'チトセ', element: ELEMENTS.WATER, role: 'アタッカー', rank: 5, imagePath: '/src/assets/char_icon/icon_chitose.png' },
    { id: 'seina', name: 'セイナ', element: ELEMENTS.WIND, role: 'アタッカー', rank: 4, imagePath: '/src/assets/char_icon/icon_seina.png' },
    { id: 'kohaku', name: 'コハク', element: ELEMENTS.FIRE, role: 'アタッカー', rank: 4, imagePath: '/src/assets/char_icon/icon_kohaku.png' },
    { id: 'ayame', name: 'アヤメ', element: ELEMENTS.WATER, role: 'バランサー', rank: 4, imagePath: '/src/assets/char_icon/icon_ayame.png' },
    { id: 'nazuna', name: 'ナズナ', element: ELEMENTS.EARTH, role: 'サポーター', rank: 5, imagePath: '/src/assets/char_icon/icon_nazuna.png' },
    { id: 'grey', name: 'グレイ', element: ELEMENTS.EARTH, role: 'アタッカー', rank: 5, imagePath: '/src/assets/char_icon/icon_grey.png' },
    { id: 'chisia', name: 'チーシア', element: ELEMENTS.FIRE, role: 'バランサー', rank: 5, imagePath: '/src/assets/char_icon/icon_chisia.png' },
    { id: 'nanoha', name: 'ナノハ', element: ELEMENTS.WIND, role: 'アタッカー', rank: 5, imagePath: '/src/assets/char_icon/icon_nanoha.png' },
    { id: 'freesia', name: 'フリージア', element: ELEMENTS.WATER, role: 'バランサー', rank: 5, imagePath: '/src/assets/char_icon/icon_freesia.png' },
    { id: 'minerva', name: 'ミネルバ', element: ELEMENTS.LIGHT, role: 'バランサー', rank: 5, imagePath: '/src/assets/char_icon/icon_minerva.png' },
    { id: 'misty', name: 'ミスティ', element: ELEMENTS.DARK, role: 'バランサー', rank: 5, imagePath: '/src/assets/char_icon/icon_misty.png' },
    { id: 'anzu', name: 'アンズ', element: ELEMENTS.WIND, role: 'サポーター', rank: 4, imagePath: '/src/assets/char_icon/icon_anzu.png' },
    { id: 'jinglin', name: 'ジンリン', element: ELEMENTS.LIGHT, role: 'バランサー', rank: 4, imagePath: '/src/assets/char_icon/icon_jinglin.png' },
    { id: 'teresa', name: 'テレサ', element: ELEMENTS.WATER, role: 'サポーター', rank: 4, imagePath: '/src/assets/char_icon/icon_teresa.png' },
    { id: 'tilia', name: 'ティリア', element: ELEMENTS.LIGHT, role: 'サポーター', rank: 4, imagePath: '/src/assets/char_icon/icon_tilia.png' },
    { id: 'kasimira', name: 'カシミラ', element: ELEMENTS.FIRE, role: 'バランサー', rank: 4, imagePath: '/src/assets/char_icon/icon_kasimira.png' },
    { id: 'shimiao', name: 'シーミャオ', element: ELEMENTS.WATER, role: 'アタッカー', rank: 4, imagePath: '/src/assets/char_icon/icon_shimiao.png' },
    { id: 'ridge', name: 'レイセン', element: ELEMENTS.EARTH, role: 'バランサー', rank: 4, imagePath: '/src/assets/char_icon/icon_ridge.png' },
    { id: 'coronis', name: 'クルニス', element: ELEMENTS.DARK, role: 'バランサー', rank: 4, imagePath: '/src/assets/char_icon/icon_coronis.png' },
    { id: 'canace', name: 'カナーチェ', element: ELEMENTS.WIND, role: 'バランサー', rank: 4, imagePath: '/src/assets/char_icon/icon_canace.png' },
    { id: 'cosette', name: 'コゼット', element: ELEMENTS.DARK, role: 'サポーター', rank: 4, imagePath: '/src/assets/char_icon/icon_cosette.png' },
    { id: 'caramel', name: 'キャラメル', element: ELEMENTS.DARK, role: 'アタッカー', rank: 4, imagePath: '/src/assets/char_icon/icon_caramel.png' },
    { id: 'laru', name: 'ラール', element: ELEMENTS.LIGHT, role: 'アタッカー', rank: 4, imagePath: '/src/assets/char_icon/icon_laru.png' },
].map(char => ({
    ...char,
    skillSets: generateSkills(char.id, char.element.label)
}));