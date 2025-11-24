import { 
    Flame, Droplets, Mountain, Wind, Sun, Moon 
} from 'lucide-react';

// 画像のインポート
import bgCore from '../assets/potential/potential_bg_core.png';
import bgNormal from '../assets/potential/potential_bg_normal.png';
import bgSpecial from '../assets/potential/potential_bg_special.png';

// 属性定義
export const ELEMENTS = {
    FIRE: { id: 'fire', label: '火', color: 'from-red-500 to-orange-500', bgColor: 'bg-red-900/40', icon: Flame, textColor: 'text-red-400' },
    WATER: { id: 'water', label: '水', color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-900/40', icon: Droplets, textColor: 'text-blue-400' },
    EARTH: { id: 'earth', label: '土', color: 'from-orange-600 to-amber-700', bgColor: 'bg-orange-900/40', icon: Mountain, textColor: 'text-orange-400' },
    WIND: { id: 'wind', label: '風', color: 'from-emerald-400 to-green-500', bgColor: 'bg-emerald-900/40', icon: Wind, textColor: 'text-emerald-400' },
    LIGHT: { id: 'light', label: '光', color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-900/40', icon: Sun, textColor: 'text-yellow-200' },
    DARK: { id: 'dark', label: '闇', color: 'from-purple-500 to-slate-800', bgColor: 'bg-purple-900/40', icon: Moon, textColor: 'text-purple-400' },
};

// ポテンシャル背景スタイルの定義 (旧 SKILL_STYLES)
export const POTENTIAL_STYLES = {
    core: {
        className: "", 
        style: {
            backgroundImage: `url(${bgCore})`,
            // 拡大率を150%に変更して少しズーム
            backgroundSize: '110%', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }
    },
    special: {
        className: "",
        style: {
            backgroundImage: `url(${bgSpecial})`,
            backgroundSize: '110%', // 変更
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }
    },
    normal: {
        className: "",
        style: {
            backgroundImage: `url(${bgNormal})`,
            backgroundSize: '110%', // 変更
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }
    }
};