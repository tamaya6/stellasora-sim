import { 
    Flame, Droplets, Mountain, Wind, Sun, Moon 
} from 'lucide-react';

// --- 定数・モックデータ定義 ---

// 属性定義
export const ELEMENTS = {
    FIRE: { id: 'fire', label: '火', color: 'from-red-500 to-orange-600', bgColor: 'bg-red-950/40', icon: Flame, textColor: 'text-red-400' },
    WATER: { id: 'water', label: '水', color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-950/40', icon: Droplets, textColor: 'text-blue-400' },
    EARTH: { id: 'earth', label: '土', color: 'from-amber-600 to-yellow-800', bgColor: 'bg-amber-950/40', icon: Mountain, textColor: 'text-amber-500' },
    WIND: { id: 'wind', label: '風', color: 'from-emerald-400 to-green-600', bgColor: 'bg-emerald-950/40', icon: Wind, textColor: 'text-emerald-400' },
    LIGHT: { id: 'light', label: '光', color: 'from-yellow-300 to-amber-500', bgColor: 'bg-yellow-950/40', icon: Sun, textColor: 'text-yellow-300' },
    DARK: { id: 'dark', label: '闇', color: 'from-purple-600 to-slate-900', bgColor: 'bg-purple-950/40', icon: Moon, textColor: 'text-purple-400' },
};

// スキル背景スタイルの定義
export const SKILL_STYLES = {
    core: {
        className: "bg-pink-400",
        style: {
            backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.6) 0%, transparent 60%),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,255,255,0.4)' transform='translate(5, 5) scale(0.6)'/%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,230,240,0.3)' transform='translate(60, 10) scale(1.0)'/%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,255,255,0.5)' transform='translate(20, 60) scale(0.8)'/%3E%3Cpath d='M20 0 L23 17 L40 20 L23 23 L20 40 L17 23 L0 20 L17 17 Z' fill='rgba(255,230,240,0.4)' transform='translate(70, 70) scale(0.5)'/%3E%3C/svg%3E"),
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

// 特定キャラクターのスキル定義
const SPECIFIC_SKILLS = {
    fuyuka: {
        mainCore: [
            { name: '連撃よーい！', description: 'スキル説明文がここに入ります。' },
            { name: '延焼パンチ', description: 'スキル説明文がここに入ります。' },
            { name: 'ネコパンチ', description: 'スキル説明文がここに入ります。' },
            { name: '焔の構え', description: 'スキル説明文がここに入ります。' }
        ],
        mainSub: [
            { name: 'ブレイズナックル', bgType: 'special', description: 'スキル説明文がここに入ります。' },
            { name: 'ヒートサイン', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '烈火の覚悟', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '追撃ファイヤー', bgType: 'special', description: 'スキル説明文がここに入ります。' },
            { name: 'フレアラッシュ', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: 'ラヴァチャージ', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '紅蓮のトドメ', bgType: 'special', description: 'スキル説明文がここに入ります。' },
            { name: 'イグニッション', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '勇猛火敢', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '灼熱ハート', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '業火の鉄拳', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: 'レイジングソウル', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
        ],
        supportCore: [
            { name: 'ヘビーアタック', description: 'スキル説明文がここに入ります。' },
            { name: '爆裂花火', description: 'スキル説明文がここに入ります。' },
            { name: 'バーストフレア', description: 'スキル説明文がここに入ります。' },
            { name: '閃火の心', description: 'スキル説明文がここに入ります。' }
        ],
        supportSub: [
            { name: 'アサルトフレイム', bgType: 'special', description: 'スキル説明文がここに入ります。' },
            { name: '熱烈エール', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: 'スキルウォーマー', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: 'サポートコンボ', bgType: 'special', description: 'スキル説明文がここに入ります。' },
            { name: 'ヒートアップ', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: 'ナックルラッシュ', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '仲間の力', bgType: 'special', description: 'スキル説明文がここに入ります。' },
            { name: '勇者の闘志', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '才焔の証', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '灼熱ハート', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: '業火の鉄拳', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
            { name: 'レイジングソウル', bgType: 'normal', description: 'スキル説明文がここに入ります。' },
        ]
    },
    nanoha: {
        mainCore: [
            { name: '成長の喜び', description: 'ナノハの通常攻撃で敵に3回ダメージを与えた後、範囲内に攻撃力の26.2%の風属性ダメージを追加で与えるようになる。' },
            { name: '扇の散歌', description: '主力スキル発動後の10秒間、通常攻撃は、敵を貫通する向日葵手裏剣を追加で3枚投げ、それぞれ攻撃力の9.8%の風属性の通常攻撃ダメージを与えるようになる。' },
            { name: '飛旋の刃', description: '向日葵手裏剣は複数回ダメージを与えるようになり、0.15秒ごとに1回ダメージを与える。' },
            { name: '満開の舞', description: '向日葵手裏剣のダメージ範囲が50%拡大し、スキルダメージが66.7%増加する。' }
        ],
        mainSub: [
            { name: '疾風怒濤', bgType: 'special', description: '向日葵手裏剣を投げるたびに、5秒間、攻撃速度が2.7%～7.2％上昇し、通常攻撃ダメージが6%～24％増加する。この効果は3回重複できる。' },
            { name: '花影の従者', bgType: 'normal', description: '分身1体ごとに、ナノハの通常攻撃ダメージが12%～46％増加する。' },
            { name: '研鑽の日々', bgType: 'normal', description: 'ナノハのダメージを与えた時、30%の確率で5秒間、攻撃速度が20%～33％上昇し、攻撃力が10%～39％上昇する。' },
            { name: '百花繚乱', bgType: 'special', description: '主力スキル発動時、分身が、戻ってこない向日葵手裏剣を投げるようになる。それぞれナノハの攻撃力の316%～1264％の風属性のスキルダメージを与える。' },
            { name: '日輪草への祈り', bgType: 'normal', description: '向日葵手裏剣はナノハから離れるほどダメージが増加する。最小で16%～65％増加する。' },
            { name: '花の導き', bgType: 'normal', description: '主力スキルで風属性の印を発動させた時から3秒間、スキルダメージが33%～130％増加する。この効果は3回重複できる。' },
            { name: '忍びの心得', bgType: 'special', description: '主力スキル発動時から10秒間、攻撃力が15%～60％上昇する。' },
            { name: '韋駄天', bgType: 'normal', description: 'ナノハが風属性の印を発動させた時から2秒間、攻撃力が2%～8％上昇する。この効果は6回重複できる。' },
            { name: '早足', bgType: 'normal', description: 'ナノハの回避の発動可能回数が1回増加する。回避発動時から4秒間、攻撃力が9.3%～37.3％上昇する。' },
            { name: '花影の詩', bgType: 'normal', description: '分身が主力巡遊者に追従して戦うようになる。分身のダメージが10%～39％増加する。' },
            { name: '分身忍術', bgType: 'normal', description: 'ナノハの必殺技ダメージが34%～136％上昇する。ナノハの必殺技で召喚できる分身の数が1体増加し、最大で3体まで存在できる。' },
            { name: '忍びの矜持', bgType: 'normal', description: 'ナノハの攻撃力が7%～29％上昇する。分身の持続時間が1～6秒延長される。' },
        ],
        supportCore: [
            { name: '追撃用暗器', description: '3体以上の敵にナノハの支援スキルの手裏剣のダメージを与えた時、追加でスキルを1回発動できるようになる。\nこの効果は1回のスキルごとに1回まで発動する。' },
            { name: '風の如く', description: 'ナノハの支援スキルで風属性の印を発動させた時、爆発が発生し攻撃力の39.7%の風属性のスキルダメージを与え、クールタイムが3秒短縮される。\nこの効果は1回のスキルごとに1回まで発動する。' },
            { name: '草花の眼', description: 'ナノハの支援スキルの手裏剣が敵を追尾するようになり、ダメージが27.3%増加する。' },
            { name: '対象観察', description: 'ナノハの支援スキルの手裏剣が命中した敵にマークをつけるようになる。マークは12個まで重複できる。\n爆散向日葵消滅時、マークを爆発させ、攻撃力の156.7%の風属性のスキルダメージを与える。このダメージはマーク1個につき15%増加する。' }
        ],
        supportSub: [
            { name: '監視交代', bgType: 'special', description: '爆散向日葵生成時、分身が周囲に多数の手裏剣を投げるようになる。それぞれナノハの攻撃力の21.1%～84.5％の風属性のスキルダメージを与える。' },
            { name: '急成長', bgType: 'normal', description: 'ナノハの支援スキルの、HPが90%～50％を超えている敵へのダメージが22%～87％増加する。' },
            { name: '失敗回避', bgType: 'normal', description: 'ナノハの支援スキルが敵に最初のダメージを与えた時から5秒間、ナノハのスキルダメージが3.7%～14.7％増加する。この効果は5回重複できる。' },
            { name: '支援忍術', bgType: 'special', description: '爆散向日葵消滅時、分身が前方に手裏剣を投げ、それぞれ攻撃力の22.2%～88.7％の風属性のスキルダメージを与えるようになる。' },
            { name: '念には念を', bgType: 'normal', description: 'ナノハの支援スキルの、エリート以上の敵へのダメージが20%～81％増加する。' },
            { name: '定期剪定', bgType: 'normal', description: 'ナノハの支援スキルのブレイク値貫通効率が追加で51%～136％上昇する。' },
            { name: 'メイドサービス', bgType: 'special', description: 'ナノハの支援スキルで風属性の印を発動させた時から5秒間、チーム全体の攻撃力が19%～75％上昇する。' },
            { name: '精神統一', bgType: 'normal', description: '主力巡遊者の主力スキル発動時から6秒間、ナノハの攻撃力が10%～40％上昇する。' },
            { name: '花風共鳴', bgType: 'normal', description: 'チーム内の巡遊者のSPが最大時、ナノハの支援スキルのダメージが22%～87％増加する。' },
            { name: '花影の詩', bgType: 'normal', description: '分身が主力巡遊者に追従して戦うようになる。分身のダメージが10%～39％増加する。' },
            { name: '分身忍術', bgType: 'normal', description: 'ナノハの必殺技ダメージが34%～136％上昇する。ナノハの必殺技で召喚できる分身の数が1体増加し、最大で3体まで存在できる。' },
            { name: '忍びの矜持', bgType: 'normal', description: 'ナノハの攻撃力が7%～29％上昇する。分身の持続時間が1～6秒延長される。' },
        ]
    },
    // フリージアのデータを追加
    freesia: {
        mainCore: [
            { name: '氷霧の守護', description: '主力スキル終了時、10秒間持続する氷霧を生成するようになる。氷霧内の敵は移動速度が35%低下し味方の通常攻撃ダメージが13%増加する。' },
            { name: '即断即決', description: '主力スキルはチャージできなくなるが、スキル終了時、範囲内に攻撃力の179%の水属性のスキルダメージを与えるようになる。この攻撃が敵1体に命中するごとに、主力スキルのクールタイムが2秒短縮される。この効果は6秒まで短縮できる。' },
            { name: '旋風狂雹', description: '主力スキルのダメージが120%増加し、攻撃回数が2回増加する。さらに、0.5秒チャージするごとに、攻撃回数が追加で2回増加する。' },
            { name: '風雪不動', description: '主力スキル持続中、フリージアは行動阻害を無効にし、攻撃範囲が50%拡大する。\nダメージを与えた時、スキルダメージが4.6%増加する。この効果は24回重複できる。' }
        ],
        mainSub: [
            { name: '氷の昇華', bgType: 'special', description: '主力スキルを発動すると、次に発動する必殺技のダメージが50%～200％増加し、狂化状態中の通常攻撃ダメージが11%～45％増加する。この効果は3回重複できる。' },
            { name: '名残雪の祝福', bgType: 'normal', description: '主力スキル終了後の9秒間、攻撃力が27%～109％上昇する。' },
            { name: '衝動強化', bgType: 'normal', description: '狂化状態中に主力スキル発動時から7秒間、攻撃力が35%～141％上昇する。' },
            { name: '雪の忘れ物', bgType: 'special', description: '主力スキル持続中、1.5秒ごとに氷の斧が降り注ぎ、範囲内に攻撃力の38%～154％の水属性のスキルダメージを与えるようになる。' },
            { name: '砕氷の配達人', bgType: 'normal', description: '凍結が付与されているノーマル敵に主力スキルのダメージを与えた時、50%の確率で砕氷を発動する。\n寒冷か凍結が付与されているエリート以上の敵にダメージを与えた時、50%の確率でそのダメージが19%～77％増加する。' },
            { name: '氷晶結界', bgType: 'normal', description: '狂化状態中に主力スキルで攻撃時、1秒ごとにダメージが9%～37％増加し、狂化時間が減少しなくなる。' },
            { name: '理性爆発', bgType: 'special', description: 'フリージアが水属性の印を発動させた時、狂化状態中の場合、狂化時間が1～4秒延長される。この効果は1～3回まで発動する。' },
            { name: '寒波襲来', bgType: 'normal', description: 'フリージアの必殺技は水属性の印を発動させることができるようになる。発動させると、範囲内に攻撃力の175%の水属性の印ダメージを与え、寒冷を付与する。さらに、8秒間、攻撃力が2%～8％上昇する。この効果は5回重複できる。' },
            { name: '形勢逆転', bgType: 'normal', description: 'フリージアの回避の発動可能回数が1回増加する。\n水属性の印を発動させた時、SPを5～11獲得する。この効果は5秒ごとに1回まで発動する。' },
            { name: '氷渦', bgType: 'normal', description: 'フリージアの必殺技が敵に命中するたびに、今回の狂化状態中の会心ダメージが18%～73％増加する。この効果は20回重複できる。' },
            { name: '唸る寒流', bgType: 'normal', description: 'フリージアが狂化状態中にスキル発動後から15秒間、通常攻撃ダメージが26%～103％増加する。この効果は3回重複できる。' },
            { name: '反証論破', bgType: 'normal', description: 'フリージアが狂化状態になった時、周囲の敵に3秒間の凍結を付与するようになる。\n必殺技発動後の10秒間、寒冷か凍結が付与されているエリート以上の敵に通常攻撃時、50%の確率でそのダメージが62%～249％増加する。凍結が付与されているノーマル敵に通常攻撃時、50%の確率で砕氷を発動する。' },
        ],
        supportCore: [
            { name: '氷床展開', description: 'フリージアの支援スキルのダメージが10%増加し、氷華のダメージ範囲が60%拡大される。' },
            { name: '極寒予報', description: 'フリージアの支援スキルのダメージが10%増加し、氷華の生成数が増加する。' },
            { name: '極地降雪', description: '狂化状態中にフリージアの支援スキル発動後の6秒間、通常攻撃は30%の確率で氷華を1つ生成するようになる。' },
            { name: '霜害警告', description: 'フリージアの攻撃が寒冷か凍結が付与されている敵に命中時、追加で範囲内に攻撃力224%の水属性のスキルダメージを与えるようになる。' }
        ],
        supportSub: [
            { name: '絶対零度', bgType: 'special', description: '同一の敵にフリージアの支援スキルのダメージを与えた時、スキルダメージが4%～15％増加する。この効果は12回重複できる。' },
            { name: '厳冬の牙', bgType: 'normal', description: 'フリージアの支援スキル命中時から7秒間、その敵の水属性被ダメージを2.1%～8.6％増加させる。この効果は4～8回重複できる。' },
            { name: '氷塊爆砕', bgType: 'normal', description: 'フリージアの支援スキルで生成した氷華が消滅時、氷の種を発生させ、2秒後に、範囲内に攻撃力の36%～145％の水属性のスキルダメージを与えるようになる。' },
            { name: '法律の氷原', bgType: 'special', description: 'フリージアが狂化状態中、寒冷か凍結が付与されている敵に通常攻撃命中時から3秒間、攻撃力が3.4%～13.4％上昇する。この効果は10回重複できる。' },
            { name: '自己弁護', bgType: 'normal', description: 'フリージアがフィールドにいる時、1秒ごとに攻撃力2%～7％が上昇する。この効果は25回重複でき、フィールドから離れるとリセットされる。' },
            { name: '家門の力', bgType: 'normal', description: '狂化状態中、フリージアの支援スキルを発動すると、狂化時間が3秒延長される。さらに、15秒間、スキルダメージが9%～37％増加する。この効果は3回重複できる。' },
            { name: '前進的論証', bgType: 'special', description: 'フリージアの支援スキル発動後、25%～50％の確率で15秒間、チーム全体の通常攻撃ダメージが30%～120％増加する。この効果は2回重複できる。' },
            { name: '弁護士の心', bgType: 'normal', description: '自身以外の巡遊者が水属性の時、チーム全体の会心率が5%～14％上昇する。' },
            { name: '密かな信念', bgType: 'normal', description: 'フリージアの必殺技のダメージが100%～400％増加し、水属性の印：水流を付与するようになる。' },
            { name: '氷渦', bgType: 'normal', description: 'フリージアの必殺技が敵に命中するたびに、今回の狂化状態中の会心ダメージが18%～73％増加する。この効果は20回重複できる。' },
            { name: '唸る寒流', bgType: 'normal', description: 'フリージアが狂化状態中にスキル発動後から15秒間、通常攻撃ダメージが26%～103％増加する。この効果は3回重複できる。' },
            { name: '反証論破', bgType: 'normal', description: 'フリージアが狂化状態になった時、周囲の敵に3秒間の凍結を付与するようになる。必殺技発動後の10秒間、寒冷か凍結が付与されているエリート以上の敵に通常攻撃時、50%の確率でそのダメージが62%～249％増加する。凍結が付与されているノーマル敵に通常攻撃時、50%の確率で砕氷を発動する。' },
        ]
    }
};

// スキル生成ヘルパー (特定データがある場合はそれを優先)
const generateSkills = (charId, elementLabel) => {
    const specific = SPECIFIC_SKILLS[charId];

    if (specific) {
        // 特定データからの生成
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

    // 以下、デフォルトのモック生成ロジック
    const createCore = (prefix) => 
        Array.from({ length: 4 }, (_, i) => ({
            id: `${charId}_${prefix}_c_${i + 1}`,
            name: `${elementLabel}コア${i + 1}`,
            description: `スキル${i + 1}の詳細説明文が入ります。このスキルは強力な効果を持っています。`,
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
            description: `スキル${i + 1}の詳細説明文が入ります。レベルを上げると効果が上昇します。`,
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

// キャラクターデータ
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