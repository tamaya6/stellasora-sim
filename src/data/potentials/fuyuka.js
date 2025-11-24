export default {
    mainCore: [
        { name: '連撃よーい！', description: 'フユカの弾丸の装填上限が9発になる。\n主力スキル発動時、追加で攻撃力の275%x3の火属性のスキルダメージを与えるようになる。' },
        { name: '延焼パンチ', description: '爆炎拳が追加のダメージを与えるようになる。\n1撃目：攻撃力の200%の火属性の通常攻撃ダメージを与える。\n2撃目：攻撃力の200%の火属性の通常攻撃ダメージを与える。\n3撃目：攻撃力の400%の火属性の通常攻撃ダメージを与える。' },
        { name: 'ネコパンチ', description: '主力スキル命中時、15秒間持続する爪研ぎマークを付与するようになる。\nフユカが、爪研ぎマークが付与されている敵に通常攻撃ダメージを与えた時、追加で攻撃力の128%の火属性のスキルダメージを与える。\nこのダメージは火属性の印を発動させることができる。' },
        { name: '焔の構え', description: '主力スキル発動後、次に発動する爆炎拳は溶炎破に変化する。一度に3発の弾丸を消費し、範囲内に攻撃力の1207%、1568%の火属性の通常攻撃ダメージを与える。\nフユカの弾倉が空の時、攻撃速度が50%増加する。' }
    ],
    mainSub: [
        { name: 'ブレイズナックル', bgType: 'special', description: '爆炎拳の3撃目は、追加で範囲内に攻撃力の108%~432%の火属性の通常攻撃ダメージを与えるようになる。' },
        { name: 'ヒートサイン', bgType: 'normal', description: '爆炎拳と溶炎破の通常攻撃ダメージが12%~48%増加し、火属性の印を発動させることができるようになる。' },
        { name: '烈火の覚悟', bgType: 'normal', description: '爆炎拳発動後から3秒間、爆炎拳の通常攻撃ダメージが10%~41%増加する。' },
        { name: '追撃ファイヤー', bgType: 'special', description: 'フユカが敵に4回ダメージを与えた後、追加で1回、攻撃力の189%~756%の火属性のスキルダメージを与えるようになる。\nこの効果は発動後から1.5秒経過すると再びカウントされる。' },
        { name: 'フレアラッシュ', bgType: 'normal', description: '主力スキル発動後の8秒間、フユカの攻撃速度が20%上昇し、スキルダメージが39%~157%増加する。' },
        { name: 'ラヴァチャージ', bgType: 'normal', description: '8秒ごとに、次に発動する爆炎拳と溶炎破の通常攻撃ダメージが50%~201%増加する。' },
        { name: '紅蓮のトドメ', bgType: 'special', description: 'フユカの、HPが70%未満の敵への火属性ダメージが21%~85%増加する。' },
        { name: 'イグニッション', bgType: 'normal', description: 'チーム内に火属性巡遊者が3体いる時、フユカの攻撃力が12%~48%上昇する。' },
        { name: '勇猛火敢', bgType: 'normal', description: 'フユカがエリート以上の敵に会心発生時から8秒間、攻撃力が3%~11%増加する。この効果は5回重複できる。' },
        { name: '灼熱ハート', bgType: 'normal', description: 'フユカの必殺技で火属性の印を発動させた時、その必殺技のダメージが5%~19%増加する。この効果は5回重複できる。' },
        { name: '業火の鉄拳', bgType: 'normal', description: 'フユカの必殺技の打撃回数が4回増加し、フユカの必殺技ダメージが70%~279%増加する。' },
        { name: 'レイジングソウル', bgType: 'normal', description: 'フユカの必殺技発動時、フユカは必殺技ダメージが50%~200%増加するバフを6獲得する。このバフは1秒ごとに1減少する。' },
    ],
    supportCore: [
        { name: 'ヘビーアタック', description: '支援スキルが重撃に変化し、近距離にいる敵に攻撃力の878%の火属性のスキルダメージを与え、3秒間スタンさせるようになる。さらに、広範囲の敵に攻撃力の679%の火属性のスキルダメージを与える。' },
        { name: '爆裂花火', description: 'フユカの支援スキル終了時、追加でフユカの周囲の敵に、攻撃力の618%の火属性のスキルダメージを与えるようになる。' },
        { name: 'バーストフレア', description: 'フユカの支援スキルのダメージが5%増加し、ダメージ範囲が20%拡大する。さらに、拳風の持続時間が50%延長される。' },
        { name: '閃火の心', description: 'フユカの支援スキルの持続中、火属性ダメージが0.5秒ごとに4%増加する。' }
    ],
    supportSub: [
        { name: 'アサルトフレイム', bgType: 'special', description: '' },
        { name: '熱烈エール', bgType: 'normal', description: '' },
        { name: 'スキルウォーマー', bgType: 'normal', description: '' },
        { name: 'サポートコンボ', bgType: 'special', description: '' },
        { name: 'ヒートアップ', bgType: 'normal', description: '' },
        { name: 'ナックルラッシュ', bgType: 'normal', description: '' },
        { name: '仲間の力', bgType: 'special', description: '' },
        { name: '勇者の闘志', bgType: 'normal', description: '' },
        { name: '才焔の証', bgType: 'normal', description: '' },
        { name: '灼熱ハート', bgType: 'normal', description: '' },
        { name: '業火の鉄拳', bgType: 'normal', description: '' },
        { name: 'レイジングソウル', bgType: 'normal', description: '' },
    ]
};