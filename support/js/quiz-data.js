// 質問データ
const quizData = {
    questions: [
        {
            id: 1,
            text: "現在の業務でAIツール（ChatGPT、Copilot、Geminiなど）をどの程度使用していますか？",
            options: [
                { text: "毎日複数回、様々な業務で積極的に活用している", scores: { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 } },
                { text: "週に数回、特定の業務で使用している", scores: { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "月に数回、試しに使ってみる程度", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 } },
                { text: "ほとんど使用していない、または全く使用していない", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 2,
            text: "AIツールでプロンプト（指示文）を作成する際の自信レベルは？",
            options: [
                { text: "複雑で具体的なプロンプトを自在に作成でき、期待通りの結果を得られる", scores: { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 } },
                { text: "基本的なプロンプトは作れるが、時々思った結果が得られない", scores: { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "簡単な質問はできるが、複雑な指示は苦手", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 0 } },
                { text: "プロンプトの書き方がよくわからない、または不安", scores: { advanced: 0, intermediate: 0, beginner: 2, resistant: 2 } }
            ]
        },
        {
            id: 3,
            text: "AIツールの限界や注意点についてどの程度理解していますか？",
            options: [
                { text: "ハルシネーション、バイアス、セキュリティリスクなどを十分理解し、対策している", scores: { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 } },
                { text: "基本的な注意点は知っているが、詳細な対策はこれから", scores: { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "なんとなく注意が必要だとは聞いているが、詳しくない", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 } },
                { text: "よくわからない、または信頼できるか不安", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 4,
            text: "業務でのAI活用について、どのような分野で使用していますか？",
            options: [
                { text: "文書作成、データ分析、コード生成、企画立案など幅広く活用", scores: { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 } },
                { text: "主に文書作成や翻訳などの基本的な作業で使用", scores: { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "簡単な質問や調べ物程度でしか使用していない", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 0 } },
                { text: "まだ業務では使用していない、または使用する場面が思い浮かばない", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 5,
            text: "AIツールで期待した結果が得られない場合、どのように対処しますか？",
            options: [
                { text: "プロンプトを具体的に調整し、複数のアプローチを試す", scores: { advanced: 3, intermediate: 1, beginner: 0, resistant: 0 } },
                { text: "基本的な修正は試すが、うまくいかないと諦めることもある", scores: { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "少し修正してみるが、あまり粘り強くは取り組まない", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 } },
                { text: "諦めるか、AIを使わない方法で対処する", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 6,
            text: "チームや同僚のAI活用に関して、あなたの役割は？",
            options: [
                { text: "積極的にサポートし、コツやノアハウを共有している", scores: { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 } },
                { text: "時々相談に乗ったり、簡単な情報共有をしている", scores: { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "相談されることはあるが、あまり積極的ではない", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 } },
                { text: "相談されることはない、または他の人に聞かれると困る", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 7,
            text: "会社のAI関連サポート（モデルケース提供、研修資料、書籍購入支援、外部セミナー参加など）に対する意識は？",
            options: [
                { text: "積極的に活用し、新しい情報やリソースを常に収集している", scores: { advanced: 3, intermediate: 2, beginner: 1, resistant: 0 } },
                { text: "必要に応じて活用し、学んだことを業務に活かそうとしている", scores: { advanced: 1, intermediate: 3, beginner: 2, resistant: 0 } },
                { text: "社内にリソースがあることを把握していない、または活用できていない", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 } },
                { text: "研修サポートへの関心がない、または活用したくない", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 8,
            text: "AIツールのアップデートや新機能について、どの程度情報収集していますか？",
            options: [
                { text: "積極的に情報収集し、新機能をいち早く試している", scores: { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 } },
                { text: "定期的に情報をチェックし、気になる機能は試してみる", scores: { advanced: 2, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "たまに情報を見るが、あまり積極的ではない", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 } },
                { text: "ほとんど情報収集していない、または関心がない", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 9,
            text: "AIツールの使用に関して、不安や心配はありますか？",
            options: [
                { text: "特に不安はない。メリットを十分理解して活用している", scores: { advanced: 3, intermediate: 2, beginner: 1, resistant: 0 } },
                { text: "少し不安はあるが、便利さを感じて使用している", scores: { advanced: 1, intermediate: 3, beginner: 2, resistant: 0 } },
                { text: "不安を感じることが多く、慎重に使用している", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 2 } },
                { text: "強い不安や不信を感じており、あまり使いたくない", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        },
        {
            id: 10,
            text: "今後のAI活用に関して、どのような姿勢ですか？",
            options: [
                { text: "更に高度な活用を目指し、新しい可能性を探求したい", scores: { advanced: 3, intermediate: 2, beginner: 0, resistant: 0 } },
                { text: "現在のレベルを維持しつつ、必要に応じてスキルアップしたい", scores: { advanced: 1, intermediate: 3, beginner: 1, resistant: 0 } },
                { text: "基本的な使い方を習得し、安心して使えるようになりたい", scores: { advanced: 0, intermediate: 1, beginner: 3, resistant: 1 } },
                { text: "あまり積極的に使いたくない、または必要性を感じていない", scores: { advanced: 0, intermediate: 0, beginner: 1, resistant: 3 } }
            ]
        }
    ]
};

// AI活用レベルタイプの定義
const learningTypes = {
    advanced: {
        name: "AI上級者（エキスパート）",
        icon: "fas fa-crown",
        color: "#059669",
        description: "十分に使いこなしています。AIツールを業務に最大限活用し、その限界も理解した上で適切に使い分けができています。現時点で必要な追加ラーニングはなさそうです。ぜひご自身のモデルケースを社内で共有してください。",
        characteristics: [
            "複雑なプロンプトを自在に作成できる",
            "AIの限界とリスクを十分理解している",
            "業務の幅広い分野でAIを効果的に活用",
            "チームメンバーをサポートできるレベル"
        ],
        recommendations: [
            "社内でのAI活用事例の共有",
            "後輩や同僚への指導・メンタリング",
            "新しいAIツールの評価・検証",
            "AI活用のベストプラクティス策定への参画"
        ]
    },
    intermediate: {
        name: "AI中級者（伸び盛り）",
        icon: "fas fa-rocket",
        color: "#3b82f6",
        description: "基本的な使い方は習得しており、追加の慣れで一気に上級者へステップアップできる段階です。ディープリサーチ機能やより高度な機能を使いこなすとさらに業務の幅が広がります。",
        characteristics: [
            "基本的なAI活用は問題なくできる",
            "特定の分野では効果的に活用できている",
            "AI機能の更新情報に関心がある",
            "時々同僚にアドバイスを求められる"
        ],
        recommendations: [
            "高度なプロンプト技術の習得",
            "ディープリサーチ機能の活用練習",
            "新機能の積極的な試用",
            "AI活用の幅を広げる実践練習"
        ]
    },
    beginner: {
        name: "AI初心者（成長期）",
        icon: "fas fa-seedling",
        color: "#f59e0b",
        description: "基本的な使い方から学び始めましょう。プロンプトスキルを高める練習を重ねることで、AIを安心して業務に活用できるようになります。焦らず段階的にスキルアップしていきましょう。",
        characteristics: [
            "AIツールに興味があるが使いこなせていない",
            "プロンプト作成に不安を感じる",
            "簡単な質問程度の使用にとどまっている",
            "AI活用の可能性を探っている段階"
        ],
        recommendations: [
            "基本的なプロンプト作成の練習",
            "AI活用の基礎研修への参加",
            "簡単な業務からAI活用を開始",
            "上級者からのアドバイスを積極的に受ける"
        ]
    },
    resistant: {
        name: "AI慎重派（理解促進期）",
        icon: "fas fa-shield-alt",
        color: "#dc2626",
        description: "AIに対して不安や不信感をお持ちですが、それは自然な反応です。まずはAIの基本的な仕組みと安全な使い方を理解することから始めましょう。会社として段階的なサポートを提供いたします。",
        characteristics: [
            "AI使用に不安や抵抗感を持っている",
            "AIの信頼性や安全性に疑問を感じる",
            "従来の方法を好む傾向がある",
            "AI導入に慎重なアプローチを取る"
        ],
        recommendations: [
            "AI基礎知識の学習（安全性・倫理観含む）",
            "小さな成功体験から始める段階的導入",
            "専任サポーターによる個別指導",
            "AI不安解消のための相談窓口活用"
        ]
    }
};

// 会社リソース・サポートデータ
const resourcesData = {
    advanced: [
        {
            title: "B3チーム成功事例レポート",
            description: "AI活用で翻訳費20万円削減、作業時間2時間短縮を実現したB3チームの具体的な成功事例を参考にしてください",
            url: "resources/b3-team-case-study.pdf",
            tags: ["成功事例", "コスト削減", "業務効率化"]
        },
        {
            title: "AIシナジー・プレイブック（戦略編）",
            description: "複数AIツールの戦略的連携と協働のための上級者向け実践ガイド。AIストラテジストを目指す方へ",
            url: "resources/ai-strategy-playbook.pdf",
            tags: ["戦略的活用", "ツール連携", "上級テクニック"]
        },
        {
            title: "AI活用中上級者向けトレーニングマニュアル",
            description: "各ツールの特徴と使い分けを詳しく解説した2025年版の最新研修資料",
            url: "resources/ai-training-manual-advanced.pdf",
            tags: ["研修資料", "ツール比較", "使い分け"]
        },
        {
            title: "社内AI活用モデルケース作成プロジェクト",
            description: "あなたの知見を活かし、他の社員が参考にできるAI活用モデルケースの作成にご協力ください",
            url: "#",
            tags: ["モデルケース作成", "事例共有", "リーダーシップ"]
        }
    ],
    intermediate: [
        {
            title: "AIプロンプト上達ガイド（実践編）",
            description: "プロンプト作成の4つの必須要素から応用テクニックまで、業務に直結する実践的なガイド",
            url: "resources/prompt-engineering-guide.pdf",
            tags: ["プロンプト技術", "実践ガイド", "業務活用"]
        },
        {
            title: "スマイルカーブ理論とAI活用",
            description: "人間とAIの適切な役割分担を理解し、メモリ機能を活用してAIをカスタマイズする方法を学習",
            url: "resources/smile-curve-theory.pdf",
            tags: ["役割分担", "メモリ機能", "カスタマイズ"]
        },
        {
            title: "B3チーム成功事例レポート",
            description: "実際の業務でAIをどう活用したかの具体例。翻訳・分析・レポート作成での成功パターンを参考に",
            url: "resources/b3-team-case-study.pdf",
            tags: ["成功事例", "具体的手法", "参考モデル"]
        },
        {
            title: "AI関連書籍購入支援プログラム",
            description: "スキルアップに必要なAI関連書籍の購入費用を会社がサポートします",
            url: "#",
            tags: ["書籍購入支援", "スキルアップ", "費用サポート"]
        }
    ],
    beginner: [
        {
            title: "AIプロンプト上達ガイド（基礎編）",
            description: "AIとの付き合い方から4つの必須要素まで、初心者でもすぐに実践できる基本的なプロンプト作成術",
            url: "resources/prompt-engineering-guide.pdf",
            tags: ["基礎知識", "プロンプト入門", "実践的"]
        },
        {
            title: "スマイルカーブ理論入門",
            description: "AIとの適切な役割分担を理解することで、安心してAIを業務に取り入れる方法を学習",
            url: "resources/smile-curve-theory.pdf",
            tags: ["基本理論", "役割分担", "安心活用"]
        },
        {
            title: "生成AIツール基本ガイド",
            description: "各AIツールの基本的な特徴と簡単な使い分けを分かりやすく解説。最初の一歩におすすめ",
            url: "resources/ai-tools-comparison-guide.pdf",
            tags: ["基本操作", "ツール入門", "分かりやすい"]
        },
        {
            title: "AI入門書籍購入支援",
            description: "初心者向けAI関連書籍の購入費用をサポートし、基礎知識の習得を支援します",
            url: "#",
            tags: ["入門書籍", "購入支援", "基礎知識"]
        }
    ],
    resistant: [
        {
            title: "スマイルカーブ理論入門",
            description: "AIとの適切な役割分担を理解することで、AIへの不安を軽減し、安心して業務に取り入れる方法を学習できます",
            url: "resources/smile-curve-theory.pdf",
            tags: ["不安解消", "役割分担", "安心活用"]
        },
        {
            title: "B3チーム成功事例レポート",
            description: "実際の社内チームがどのようにAIを安全かつ効果的に活用し、具体的な成果を上げたかの実例を参考にできます",
            url: "resources/b3-team-case-study.pdf",
            tags: ["成功事例", "実績紹介", "安全活用"]
        },
        {
            title: "AIプロンプト上達ガイド（基礎編）",
            description: "AIとの基本的な付き合い方から学び、段階的に慣れ親しんでいくための優しい入門ガイド",
            url: "resources/prompt-engineering-guide.pdf",
            tags: ["入門ガイド", "段階的学習", "基礎理解"]
        },
        {
            title: "生成AIツール基本ガイド",
            description: "各AIツールの基本的な特徴と安全な使い方を分かりやすく説明。AIへの理解を深めるための信頼できる情報源",
            url: "resources/ai-tools-comparison-guide.pdf",
            tags: ["基礎理解", "安全性", "信頼できる情報"]
        }
    ]
};