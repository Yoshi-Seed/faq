// スコア分析ツール
// 各質問の全選択肢のスコア配分を分析

const questions = [
    // Q1: 業務でのAI使用頻度
    {
        id: 1,
        options: [
            { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 }, // 毎日複数回
            { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 }, // 週に数回
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 }, // 月に数回
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // ほとんど使用していない
        ]
    },
    // Q2: プロンプト作成の自信
    {
        id: 2,
        options: [
            { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 }, // 複雑なプロンプト自在
            { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 }, // 基本的なプロンプト
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 0 }, // 簡単な質問のみ
            { advanced: 0, intermediate: 0, beginner: 2, resistant: 2 }  // 書き方がわからない
        ]
    },
    // Q3: AI限界・注意点の理解
    {
        id: 3,
        options: [
            { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 }, // 十分理解して対策
            { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 }, // 基本は知っている
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 }, // なんとなく知っている
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // よくわからない
        ]
    },
    // Q4: AI活用分野
    {
        id: 4,
        options: [
            { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 }, // 幅広く活用
            { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 }, // 基本的作業
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 0 }, // 簡単な質問のみ
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // まだ使用していない
        ]
    },
    // Q5: 期待した結果が得られない時の対処
    {
        id: 5,
        options: [
            { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 }, // 具体的調整・複数アプローチ
            { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 }, // 基本的修正
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 }, // 少し修正
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // 諦める
        ]
    },
    // Q6: チーム・同僚への役割
    {
        id: 6,
        options: [
            { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 }, // 積極的サポート
            { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 }, // 時々相談に乗る
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 }, // あまり積極的でない
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // 相談されない
        ]
    },
    // Q7: 会社AI関連サポートへの意識
    {
        id: 7,
        options: [
            { advanced: 3, intermediate: 2, beginner: 1, resistant: 0 }, // 積極的活用
            { advanced: 1, intermediate: 3, beginner: 2, resistant: 0 }, // 必要に応じて活用
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 }, // 把握していない
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // 関心がない
        ]
    },
    // Q8: AIアップデート・新機能の情報収集
    {
        id: 8,
        options: [
            { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 }, // 積極的情報収集
            { advanced: 2, intermediate: 3, beginner: 1, resistant: 0 }, // 定期的チェック
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 }, // たまに見る
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // 情報収集していない
        ]
    },
    // Q9: AI使用への不安
    {
        id: 9,
        options: [
            { advanced: 3, intermediate: 2, beginner: 1, resistant: 0 }, // 特に不安なし
            { advanced: 1, intermediate: 3, beginner: 2, resistant: 0 }, // 少し不安
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 2 }, // 不安が多い
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // 強い不安・不信
        ]
    },
    // Q10: 今後のAI活用姿勢
    {
        id: 10,
        options: [
            { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 }, // 高度な活用を目指す
            { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 }, // 現レベル維持＋スキルアップ
            { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 }, // 基本的使い方習得
            { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 }  // あまり積極的でない
        ]
    }
];

// スコア範囲を計算
function calculateScoreRanges() {
    const results = {
        advanced: { min: 0, max: 0 },
        intermediate: { min: 0, max: 0 },
        beginner: { min: 0, max: 0 },
        resistant: { min: 0, max: 0 }
    };
    
    // 最大スコア（全て最高点選択肢を選んだ場合）
    questions.forEach(q => {
        const maxScores = q.options.reduce((max, option) => {
            return {
                advanced: Math.max(max.advanced, option.advanced),
                intermediate: Math.max(max.intermediate, option.intermediate),
                beginner: Math.max(max.beginner, option.beginner),
                resistant: Math.max(max.resistant, option.resistant)
            };
        }, { advanced: 0, intermediate: 0, beginner: 0, resistant: 0 });
        
        results.advanced.max += maxScores.advanced;
        results.intermediate.max += maxScores.intermediate;
        results.beginner.max += maxScores.beginner;
        results.resistant.max += maxScores.resistant;
    });
    
    return results;
}

// 極端なケースのスコア計算
function calculateExtremeScores() {
    const cases = {
        // 全て最初の選択肢（最もadvanced寄り）
        allFirst: { advanced: 0, intermediate: 0, beginner: 0, resistant: 0 },
        // 全て最後の選択肢（最もresistant寄り）
        allLast: { advanced: 0, intermediate: 0, beginner: 0, resistant: 0 },
        // 全て2番目の選択肢
        allSecond: { advanced: 0, intermediate: 0, beginner: 0, resistant: 0 },
        // 全て3番目の選択肢
        allThird: { advanced: 0, intermediate: 0, beginner: 0, resistant: 0 }
    };
    
    questions.forEach(q => {
        // 最初の選択肢
        Object.keys(cases.allFirst).forEach(type => {
            cases.allFirst[type] += q.options[0][type];
        });
        
        // 2番目の選択肢
        Object.keys(cases.allSecond).forEach(type => {
            cases.allSecond[type] += q.options[1][type];
        });
        
        // 3番目の選択肢
        Object.keys(cases.allThird).forEach(type => {
            cases.allThird[type] += q.options[2][type];
        });
        
        // 最後の選択肢
        Object.keys(cases.allLast).forEach(type => {
            cases.allLast[type] += q.options[3][type];
        });
    });
    
    return cases;
}

// 同点ケースを特定
function findTiedScores() {
    const extremeScores = calculateExtremeScores();
    const tiedCases = [];
    
    Object.entries(extremeScores).forEach(([caseName, scores]) => {
        const maxScore = Math.max(...Object.values(scores));
        const winningTypes = Object.entries(scores).filter(([type, score]) => score === maxScore);
        
        if (winningTypes.length > 1) {
            tiedCases.push({
                case: caseName,
                scores: scores,
                tied: winningTypes.map(([type]) => type),
                maxScore: maxScore
            });
        }
    });
    
    return tiedCases;
}

console.log("=== スコア範囲分析 ===");
console.log(calculateScoreRanges());

console.log("\n=== 極端ケースのスコア ===");
console.log(calculateExtremeScores());

console.log("\n=== 同点ケース分析 ===");
console.log(findTiedScores());