import { 
    Flame, Droplets, Mountain, Wind, Sun, Moon 
} from 'lucide-react';

// 属性定義
export const ELEMENTS = {
    FIRE: { id: 'fire', label: '火', color: 'from-red-500 to-orange-500', bgColor: 'bg-red-900/40', icon: Flame, textColor: 'text-red-400' },
    WATER: { id: 'water', label: '水', color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-900/40', icon: Droplets, textColor: 'text-blue-400' },
    EARTH: { id: 'earth', label: '土', color: 'from-orange-600 to-amber-700', bgColor: 'bg-orange-900/40', icon: Mountain, textColor: 'text-orange-400' },
    WIND: { id: 'wind', label: '風', color: 'from-emerald-400 to-green-500', bgColor: 'bg-emerald-900/40', icon: Wind, textColor: 'text-emerald-400' },
    LIGHT: { id: 'light', label: '光', color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-900/40', icon: Sun, textColor: 'text-yellow-200' },
    DARK: { id: 'dark', label: '闇', color: 'from-purple-500 to-slate-800', bgColor: 'bg-purple-900/40', icon: Moon, textColor: 'text-purple-400' },
};

// スキル背景スタイルの定義
export const SKILL_STYLES = {
    core: {
        className: "bg-pink-400",
        style: {
            // 中央(アイコンエリア)を大きく空けつつ、四隅と少し内側に大小の星を散りばめてリズム感を出す
            backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 60%),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpath id='star' d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' /%3E%3C/defs%3E%3C!-- 左上(大): 存在感を出す --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.5)' transform='translate(5, 5) scale(0.6)'/%3E%3C!-- 右上(中): 端に寄せる --%3E%3Cuse href='%23star' fill='rgba(255,240,245,0.4)' transform='translate(80, 8) scale(0.45)'/%3E%3C!-- 左下(中): テキスト枠と被りすぎない位置 --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.4)' transform='translate(8, 75) scale(0.45)'/%3E%3C!-- 右下(大): 対角線上のバランス --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.5)' transform='translate(75, 70) scale(0.6)'/%3E%3C!-- 上中央寄り(小): アクセント --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.3)' transform='translate(45, 2) scale(0.3)'/%3E%3C!-- 左端中央(小): 隙間埋め --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.3)' transform='translate(-5, 40) scale(0.3)'/%3E%3C!-- 右端中央(小): 隙間埋め --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.3)' transform='translate(90, 45) scale(0.3)'/%3E%3C!-- 左上内側(極小): 奥行き用 --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.25)' transform='translate(25, 20) scale(0.2)'/%3E%3C!-- 右下内側(極小): 奥行き用 --%3E%3Cuse href='%23star' fill='rgba(255,255,255,0.25)' transform='translate(65, 60) scale(0.2)'/%3E%3C/svg%3E"),
                linear-gradient(135deg, #f472b6 0%, #ec4899 100%)
            `,
            backgroundSize: '100% 100%, 100px 100px, 100% 100%',
            backgroundBlendMode: 'overlay, normal, normal'
        }
    },
    special: {
        className: "",
        style: {
            background: `conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #d8b4fe 20%, #60a5fa 40%, #f9a8d4 60%, #a855f7 80%, #9333ea 100%)`
        }
    },
    normal: {
        className: "",
        style: {
            background: `conic-gradient(from 0deg at 50% 50%, #ea580c 0%, #fb923c 30%, #facc15 50%, #fb923c 70%, #ea580c 100%)`
        }
    }
};