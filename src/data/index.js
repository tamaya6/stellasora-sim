import { ELEMENTS } from './constants';

// 【修正】SKILL_STYLES -> POTENTIAL_STYLES に変更
export { ELEMENTS, POTENTIAL_STYLES } from './constants';

// 画像読み込みロジック
// src/data/index.js から見て ../assets/char_icon/
const iconFiles = import.meta.glob('../assets/char_icon/*.png', { eager: true });

const getIconImage = (charId) => {
    const path = `../assets/char_icon/icon_${charId}.png`;
    return iconFiles[path]?.default;
};

// キャラクターメタデータ定義
// 名前やロールはJSONから取得するため削除
const RAW_METADATA = [
    { id: 'snowish_laru', uid: 158, element: ELEMENTS.FIRE, rank: 5 },
    { id: 'natsuka', uid: 133, element: ELEMENTS.WIND, rank: 5 },
    { id: 'fuyuka', uid: 134, element: ELEMENTS.FIRE, rank: 5 },
    { id: 'shia', uid: 155, element: ELEMENTS.LIGHT, rank: 5 },
    { id: 'chitose', uid: 144, element: ELEMENTS.WATER, rank: 5 },
    { id: 'nazuna', uid: 156, element: ELEMENTS.EARTH, rank: 5 },
    { id: 'gerie', uid: 149, element: ELEMENTS.EARTH, rank: 5 },
    { id: 'chixia', uid: 141, element: ELEMENTS.FIRE, rank: 5 },
    { id: 'nanoha', uid: 119, element: ELEMENTS.WIND, rank: 5 },
    { id: 'freesia', uid: 125, element: ELEMENTS.WATER, rank: 5 },
    { id: 'minova', uid: 132, element: ELEMENTS.LIGHT, rank: 5 },
    { id: 'mistique', uid: 135, element: ELEMENTS.DARK, rank: 5 },
    { id: 'noya', uid: 112, element: ELEMENTS.WIND, rank: 4 },
    { id: 'amber', uid: 103, element: ELEMENTS.FIRE, rank: 4 },
    { id: 'iris', uid: 111, element: ELEMENTS.WATER, rank: 4 },
    { id: 'ann', uid: 123, element: ELEMENTS.WIND, rank: 4 },
    { id: 'jinglin', uid: 117, element: ELEMENTS.LIGHT, rank: 4 },
    { id: 'teresa', uid: 127, element: ELEMENTS.WATER, rank: 4 },
    { id: 'tilia', uid: 107, element: ELEMENTS.LIGHT, rank: 4 },
    { id: 'kasimira', uid: 108, element: ELEMENTS.FIRE, rank: 4 },
    { id: 'shimiao', uid: 113, element: ELEMENTS.WATER, rank: 4 },
    { id: 'ridge', uid: 116, element: ELEMENTS.EARTH, rank: 4 },
    { id: 'coronis', uid: 118, element: ELEMENTS.DARK, rank: 4 },
    { id: 'canace', uid: 120, element: ELEMENTS.WIND, rank: 4 },
    { id: 'cosette', uid: 142, element: ELEMENTS.DARK, rank: 4 },
    { id: 'caramel', uid: 147, element: ELEMENTS.DARK, rank: 4 },
    { id: 'laru', uid: 150, element: ELEMENTS.LIGHT, rank: 4 },
    { id: 'flora', uid: 126, element: ELEMENTS.FIRE, rank: 4 },
];

export const CHARACTER_METADATA = RAW_METADATA.map(char => ({
    ...char,
    imagePath: getIconImage(char.id)
}));