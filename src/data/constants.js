import { 
    Flame, Droplets, Mountain, Wind, Sun, Moon 
} from 'lucide-react';

// 属性定義
export const ELEMENTS = {
    // 背景色(bgColor)を950→900へ、グラデーション(color)を少し明るめに調整
    FIRE: { id: 'fire', label: '火', color: 'from-red-500 to-orange-500', bgColor: 'bg-red-900/40', icon: Flame, textColor: 'text-red-400' },
    WATER: { id: 'water', label: '水', color: 'from-blue-400 to-cyan-500', bgColor: 'bg-blue-900/40', icon: Droplets, textColor: 'text-blue-400' },
    // 土: オレンジ〜アンバー系で明るさを確保
    EARTH: { id: 'earth', label: '土', color: 'from-orange-600 to-amber-700', bgColor: 'bg-orange-900/40', icon: Mountain, textColor: 'text-orange-400' },
    WIND: { id: 'wind', label: '風', color: 'from-emerald-400 to-green-500', bgColor: 'bg-emerald-900/40', icon: Wind, textColor: 'text-emerald-400' },
    // 光: 暗すぎた黄色を明るめのゴールドに戻しつつ、文字が見えるバランスに
    LIGHT: { id: 'light', label: '光', color: 'from-yellow-500 to-amber-500', bgColor: 'bg-yellow-900/40', icon: Sun, textColor: 'text-yellow-200' },
    DARK: { id: 'dark', label: '闇', color: 'from-purple-500 to-slate-800', bgColor: 'bg-purple-900/40', icon: Moon, textColor: 'text-purple-400' },
};

// スキル背景スタイルの定義
export const SKILL_STYLES = {
    core: {
        className: "bg-pink-400",
        style: {
            backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 60%),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,255,255,0.4)' transform='translate(5, 5) scale(0.6)'/%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,230,240,0.3)' transform='translate(60, 10) scale(1.0)'/%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,255,255,0.5)' transform='translate(20, 60) scale(0.8)'/%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,255,255,0.4)' transform='translate(70, 70) scale(0.5)'/%3E%3C/svg%3E"),
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