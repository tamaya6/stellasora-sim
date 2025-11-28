import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CHARACTER_METADATA, ELEMENTS } from '../data';
import charaEn from '../locales/en/chara_en.json';
import charaJa from '../locales/ja/chara_ja.json';

// HTMLタグを除去する関数
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
};

// パラメータを埋め込む関数
const interpolateParams = (desc, params) => {
    if (!desc || !params) return desc;
    let result = desc;

    // &Param1&, &Param2& ... を置換
    // params配列は0始まりだが、プレースホルダーは1始まりの場合があるため注意
    // JSONのparamsは配列。&Param1& は params[0] に対応すると仮定（データを見て調整）
    // 実際のデータを見ると &Param1& が params[0] に対応しているように見える

    params.forEach((param, index) => {
        const placeholder = `&Param${index + 1}&`;
        // パラメータがスラッシュ区切りの数値リストの場合（例: "12.9%/14.2%/..."）
        // 最小値～最大値 の形式に変換する
        let value = param;
        if (typeof param === 'string' && param.includes('/')) {
            const parts = param.split('/');
            if (parts.length > 1) {
                const first = parts[0];
                const last = parts[parts.length - 1];
                // 単位(%)がついているか確認
                const unit = first.endsWith('%') ? '%' : '';
                value = `${first.replace('%', '')}～${last}`; // 単位は最後につけるか、そのままか
                // 日本語の範囲表現に合わせるなら "～"
            }
        }

        // グローバル置換
        result = result.split(placeholder).join(value);
    });

    return result;
};

// 画像読み込みロジック
import { ICON_LIST } from '../data/iconList';

// Setにして検索を高速化
const AVAILABLE_ICONS = new Set(ICON_LIST);

const getPotentialIcon = (iconName) => {
    if (!iconName) return null;
    const cleanName = iconName.trim();

    // 1. そのままのファイル名で検索
    if (AVAILABLE_ICONS.has(`${cleanName}.png`)) {
        return `./icon/${cleanName}.png`;
    }

    // 2. _A を付与して検索
    if (AVAILABLE_ICONS.has(`${cleanName}_A.png`)) {
        return `./icon/${cleanName}_A.png`;
    }

    return null;
};

// 特殊なタグや制御文字を整形する関数
const formatDescription = (text) => {
    if (!text) return '';
    let result = text;
    // 垂直タブ(\u000b)を削除
    result = result.replace(/\u000b/g, '');
    // ##Text#Number# の形式を Text に置換
    result = result.replace(/##([^#]+)#[^#]+#/g, '$1');
    return result;
};

// ポテンシャルデータを加工する関数
const processPotential = (p, isCore) => {
    const rawDesc = p.desc || '';
    // パラメータ埋め込み -> HTML除去 -> 特殊整形
    const cleanDesc = formatDescription(stripHtml(interpolateParams(rawDesc, p.params)));

    // rarity から bgType を決定
    let bgType = 'normal';
    if (p.rarity === 'core') bgType = 'core';
    else if (p.rarity === 'rare') bgType = 'special';

    return {
        id: p.id.toString(), // IDを文字列に統一
        name: p.name,
        description: cleanDesc,
        type: isCore ? 'core' : 'passive',
        bgType: bgType,
        isCore: isCore,
        rawParams: p.params, // 必要なら保持
        iconPath: getPotentialIcon(p.icon) // アイコンパスを追加
    };
};

// 属性名のマッピング
const ELEMENT_MAP = {
    // English (Latin)
    "Ignis": ELEMENTS.FIRE,
    "Aqua": ELEMENTS.WATER,
    "Terra": ELEMENTS.EARTH,
    "Ventus": ELEMENTS.WIND,
    "Lux": ELEMENTS.LIGHT,
    "Umbra": ELEMENTS.DARK,
    // Japanese
    "火": ELEMENTS.FIRE,
    "水": ELEMENTS.WATER,
    "土": ELEMENTS.EARTH,
    "風": ELEMENTS.WIND,
    "光": ELEMENTS.LIGHT,
    "闇": ELEMENTS.DARK
};

export const useCharacters = () => {
    const { i18n } = useTranslation();

    const characters = useMemo(() => {
        const lang = i18n.language.startsWith('ja') ? 'ja' : 'en';
        const dataMap = lang === 'ja' ? charaJa : charaEn;

        return CHARACTER_METADATA.map(meta => {
            // UIDを使ってJSONからデータを引く
            // メタデータのuidは数値、JSONのキーは文字列の数値
            const charData = dataMap[meta.uid.toString()];

            if (!charData) {
                console.warn(`Character data not found for UID: ${meta.uid}`);
                return {
                    ...meta,
                    name: meta.id, // フォールバック
                    role: 'Unknown',
                    potentialSets: { mainCore: [], mainSub: [], supportCore: [], supportSub: [] }
                };
            }

            // JSONから属性を取得してマッピング
            const element = ELEMENT_MAP[charData.element] || meta.element;

            const p = charData.potential || {};

            // ポテンシャルデータを加工
            const mainCore = (p.mainCore || []).map(item => processPotential(item, true));
            const supportCore = (p.supportCore || []).map(item => processPotential(item, true));

            // Subは Normal + Common を結合
            const mainNormal = (p.mainNormal || []).map(item => processPotential(item, false));
            const common = (p.common || []).map(item => processPotential(item, false));
            const mainSub = [...mainNormal, ...common];

            const supportNormal = (p.supportNormal || []).map(item => processPotential(item, false));
            // supportSub にも common を入れるべきかはゲームの仕様によるが、
            // 元の amber.js を見ると supportSub にも common 由来のもの（烈火の華など）が含まれている
            // ただし、JSON構造上 common は独立している。
            // 元の実装では common は mainSub にも supportSub にも含まれていたか？
            // amber.js の supportSub には "烈火の華" (common) がある。
            // したがって、common は両方に追加する。
            const supportSub = [...supportNormal, ...common];

            return {
                ...meta,
                name: charData.name,
                element: element, // 属性を上書き
                role: charData.class, // JSONでは class となっている
                potentialSets: {
                    mainCore,
                    mainSub,
                    supportCore,
                    supportSub
                }
            };
        });
    }, [i18n.language]);

    return characters;
};
