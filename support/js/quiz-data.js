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
            title: "AI上級者向けガイド：実践者から戦略家へ",
            description: "AI コラボレーションの次なるフロンティアを探求し、ツールユーザーから AI ストラテジストへと進化するための戦略的思考フレームワーク",
            url: "../resources/ai-strategy-advanced.pdf",
            tags: ["戦略的思考", "AI協働", "フロンティア探求"]
        },
        {
            title: "AIツールプレイブック：デジタル・コパイロットを使いこなす戦略的ガイド",
            description: "2025年版最新のAI活用戦略。複数のAIアシスタントを連携させ、協働させるための高度で戦略的なアプローチ",
            url: "../resources/ai-strategy-playbook.pdf",
            tags: ["戦略的活用", "ツール連携", "2025年版"]
        },
        {
            title: "考える・アイデア出し・壁打ち用プロンプト集",
            description: "『AIを使って考えるための全技術』から56個の実践的なプロンプト技法。コピペで即座に活用可能",
            url: "../resources/prompt-collection-text.pdf",
            tags: ["プロンプト集", "アイデア発想", "実践技法"]
        },
        {
            title: "AI初級～上級レベルリソース集一覧",
            description: "あなたのAIレベルに応じた最適なリソースを提案。社内リソースへの総合的なナビゲーションガイド",
            url: "../resources/ai-resources-list.pdf",
            tags: ["リソース集", "レベル別", "総合ガイド"]
        }
    ],
    intermediate: [
        {
            title: "AI Co-Pilot プレイブック：中級者のための新しい働き方マスターガイド",
            description: "スマイルカーブ理論に基づく人間とAIの適切な役割分担を理解し、ユーザーからストラテジストへ進化するためのマインドセット",
            url: "../resources/ai-intermediate-manual.pdf",
            tags: ["Co-Pilot理論", "役割分担", "マインドセット"]
        },
        {
            title: "AIプロンプト上達のコツ：優秀なアシスタントを育てるガイド",
            description: "プロンプト作成の4つの必須要素から応用テクニックまで。AIを信頼できるアシスタント、壁打ち相手、ブレストパートナーに変える実践ガイド",
            url: "../resources/prompt-guide-seed-planning.pdf",
            tags: ["プロンプト技術", "実践ガイド", "アシスタント育成"]
        },
        {
            title: "AIツールプレイブック：デジタル・コパイロット戦略ガイド",
            description: "2025年版のAI活用戦略。習熟度のギャップを埋め、複数AIツールの協働を実現するための実践的アプローチ",
            url: "../resources/ai-strategy-playbook.pdf",
            tags: ["戦略的活用", "ツール協働", "実践アプローチ"]
        },
        {
            title: "考える・アイデア出し・壁打ち用プロンプト集",
            description: "『AIを使って考えるための全技術』から厳選された56個のプロンプト技法。コピペですぐに使える実践的なツール集",
            url: "../resources/prompt-collection-text.pdf",
            tags: ["プロンプト集", "アイデア発想", "即戦力ツール"]
        }
    ],
    beginner: [
        {
            title: "AIプロンプト上達のコツ：あなただけの優秀なアシスタントを育てるガイド",
            description: "AIは、もう一人の優秀な同僚です。正しい付き合い方を学び、AIを謎めいたツールから信頼できるアシスタントへと変える具体的で実践的なコツ",
            url: "../resources/prompt-guide-seed-planning.pdf",
            tags: ["基礎知識", "プロンプト入門", "アシスタント育成"]
        },
        {
            title: "AIツールプレイブック：初心者のためのAI導入ガイド",
            description: "2025年9月時点での業務に活用できるAIツールの最新情報と使用のコツ。AI使用ルールの再確認とアイデア集",
            url: "../resources/ai-strategy-playbook.pdf",
            tags: ["基本操作", "ツール入門", "2025年版"]
        },
        {
            title: "考える・アイデア出し・壁打ち用プロンプト集",
            description: "『AIを使って考えるための全技術』から初心者でも使える基本的なプロンプト。コピペですぐに始められるAI活用の第一歩",
            url: "../resources/prompt-collection-text.pdf",
            tags: ["プロンプト集", "初心者向け", "コピペ活用"]
        },
        {
            title: "AI初級～上級レベルリソース集一覧",
            description: "自分のAIレベルを診断し、最適な学習リソースを見つけるためのナビゲーション。段階的なスキルアップをサポート",
            url: "../resources/ai-resources-list.pdf",
            tags: ["レベル診断", "学習ナビ", "段階的成長"]
        }
    ],
    resistant: [
        {
            title: "AIプロンプト上達のコツ：優しいAI入門ガイド",
            description: "「AIは、もう一人の優秀な同僚です」というコンセプトで、AIに対する不安を軽減し、段階的に慣れ親しんでいくための優しい導入ガイド",
            url: "../resources/prompt-guide-seed-planning.pdf",
            tags: ["不安解消", "段階的学習", "優しい導入"]
        },
        {
            title: "AI中級者向けスキルアップマニュアル（基礎理解編）",
            description: "スマイルカーブ理論に基づく人間とAIの適切な役割分担を理解し、AIへの不安を軽減して安心して業務に取り入れる方法",
            url: "../resources/ai-intermediate-manual.pdf",
            tags: ["役割分担理解", "不安軽減", "安心活用"]
        },
        {
            title: "AIツールプレイブック：安全なAI活用の基礎",
            description: "2025年版のAI活用ガイド。習熟度のギャップを理解し、安全で信頼できるAI活用の第一歩を踏み出すための基礎情報",
            url: "../resources/ai-strategy-playbook.pdf",
            tags: ["基礎理解", "安全性重視", "信頼性"]
        },
        {
            title: "AI初級～上級レベルリソース集一覧",
            description: "まずは自分のAIレベルを客観的に把握し、無理のない範囲で段階的にAIと親しむためのリソース案内",
            url: "../resources/ai-resources-list.pdf",
            tags: ["レベル把握", "段階的導入", "無理なく学習"]
        }
    ]
};