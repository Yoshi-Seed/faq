/*
 * script.js
 *
 * このファイルでは、DCFコードの研修用クイズアプリのロジックを実装しています。
 * 質問データを定義し、ユーザーの選択を検証してフィードバックを表示します。
 */

// クイズの問題プール
// 必ず suggestion プロパティを含めることで、誤答時の学習アドバイスに利用します。
const questionPool = [
  {
    question: 'DCFコードとは何ですか？',
    options: [
      'アルトマーク社が提供する医師・施設識別コード',
      '医師の医師名の暗号化文字列',
      'シード・プランニング内部の社員コード',
      '日本政府が発行する医師ライセンス番号'
    ],
    correct: [0],
    explanation: 'DCFコードは、アルトマーク社が提供する医師や医療施設を識別するためのコードです。個人情報を直接扱わずターゲティングができるため、市場調査で利用されています。',
    suggestion: 'DCFコードの基本概要を復習しましょう'
  },
  {
    question: 'DCFコードを使う理由として適切なものをすべて選んでください（複数選択）。',
    options: [
      '医師や薬剤師の個人情報を秘匿しながらターゲットを識別できる',
      '競合他社から情報を隠すため',
      'シード・プランニング内部の社員コードに紐づけるため',
      '個人情報保護の観点から医師名を直接使わずにターゲティングするため'
    ],
    correct: [0, 3],
    explanation: 'DCFコードは個人情報を開示せずに特定の医師や施設を対象にできる仕組みです。直接氏名を使わないことで個人情報保護に配慮しています。競合他社から隠す目的や社内コードとしての利用ではありません。',
    suggestion: 'なぜDCFコードを使うのか、その目的を理解しましょう'
  },
  {
    question: 'DCFコードを利用する際の注意点として正しいものはどれですか？',
    options: [
      'コード自体は個人情報ではないが、医師名や施設名を紐づけた時点で個人情報となる',
      'コードは誰でも自由に入手して利用できる',
      '医師名や施設名を紐づけても個人情報にはならない',
      'DCFコードはリサーチエージェンシーが無償で提供している'
    ],
    correct: [0],
    explanation: 'DCFコード単体は個人情報ではありませんが、対象者の氏名や施設名を結び付けると個人情報として扱われます。利用にはアルトマークや日経BPなどの正式な手続きを経る必要があります。',
    suggestion: '個人情報保護とDCFコードの関係について理解を深めましょう'
  },
  {
    question: '製薬会社がDCFコードを使ったリクルートを行う場合、まず行うべきことはどれですか？',
    options: [
      '製薬会社はアルトマーク社に代わってリサーチエージェンシーが対象者を抽出する',
      '製薬会社はDCFコードを抽出してリサーチエージェンシーに渡す',
      '製薬会社は医師名とコードをエージェンシーに渡し、エージェンシーが直接リクルートする',
      '製薬会社は対象者を特定せずリサーチエージェンシーに一任する'
    ],
    correct: [1],
    explanation: '製薬会社は自社の顧客リストなどから対象となるDCFコードを抽出し、そのリストをリサーチエージェンシーに渡します。エージェンシーはそのコードを基に日経BPへパネルマッチを依頼し、有効リストを抽出します。',
    suggestion: 'リクルートを開始するための基本フローを押さえましょう'
  },
  {
    question: 'DCFコードを利用したリクルートで注意すべきことはどれですか？',
    options: [
      'コードにリストされた医師が必ずしもパネルに登録されているわけではない',
      'コードの精度はリクルート結果に影響しない',
      '古いリストや精度が悪いリストでも問題なくリクルートできる',
      'Off-Listへの配信はクライアントの許可なく実施できる'
    ],
    correct: [0],
    explanation: 'DCFコードで指定された医師が日経BPのパネルに登録されているとは限りません。また、リストが古かったり精度が低い場合、対象者を十分にリクルートできないことがあります。必要に応じてクライアントの許可を得てOff-List配信を行う場合もあります。',
    suggestion: 'リスト精度やパネル登録有無に対する注意点を再確認しましょう'
  },
  {
    question: 'DCFコードを使った配信やリクルートが正式に許可されているのはどの会社ですか？',
    options: [
      '日経BP',
      'キャンドゥ',
      'シード・プランニング',
      'どの会社でも自由に行える'
    ],
    correct: [0],
    explanation: '基本原則として、DCFコードを用いた配信やリクルートは日経BPのみが行うことができます。他社が行う場合は非公式であり、必ず日経BPのパネルマッチを経由する必要があります。',
    suggestion: 'DCFコードを正式に扱える企業を覚えておきましょう'
  },
  {
    question: 'クライアントが医師の名前、施設コード、専門コードのファイルを送ってきました。この情報でリクルートは開始できますか？',
    options: [
      'はい、DCFコードがなくても正式にリクルートを開始できる',
      '正式にはリクルートできないが、キャンドゥが医師名でパネル登録者と照合することで実施する方法はある',
      'いいえ、この情報ではリクルートを一切実施できない',
      '専門コードだけあればリクルートできる'
    ],
    correct: [1],
    explanation: '医師名や施設コード、専門コードだけではアルトマーク社のDCFコードに紐づかないため、正式にはリクルートを開始できません。ただし、信頼関係のあるキャンドゥに医師名リストを照合してもらうことで非公式にリクルートを進める方法は存在します。',
    suggestion: '対象者リストにDCFコードが含まれているかどうかを確認しましょう'
  },
  {
    question: 'クライアントから、ターゲットリストでのリクルートは可能か？と問い合わせがあった場合、どのような条件で対応できますか？',
    options: [
      '医師の名前や勤務先の個人情報リストからでもリクルートできる',
      'DCFコードで構成されたターゲットリストがあればリクルート可能',
      '医師の専門コードがあれば十分',
      'いずれの条件でもリクルートできない'
    ],
    correct: [1],
    explanation: 'ターゲットリストにDCFコードが含まれていれば、日経BPのパネルと照合してリクルートを実施できます。医師名や勤務先だけの個人情報リストからは個人情報保護の観点から対応できません。',
    suggestion: 'ターゲットリストに必要な情報（DCFコード）を理解しましょう'
  },
  {
    question: 'エージェンシーから「DCFコードでリクルートをしたいが製薬会社とのTPA契約がない」と問い合わせがあった場合、どのように対応すべきですか？',
    options: [
      'シード・プランニングが独自にDCFコードを提供してリクルートする',
      'クライアントにエンドの製薬会社からDCFコードを提供してもらうよう依頼し、使用者をシード・プランニング（日経BP）と指定してもらう',
      'TPA契約は不要なのでそのままリクルートを開始する',
      'キャンドゥに依頼してTPA契約を代行させる'
    ],
    correct: [1],
    explanation: 'TPA契約がない場合は、クライアントを通じて製薬会社からDCFコードリストを提供してもらい、その使用者をシード・プランニング（日経BP）として指定してもらうのが適切です。',
    suggestion: 'TPA契約の役割とクライアント・製薬会社への依頼方法を復習しましょう'
  },
  {
    question: 'TPA（アルトマーク社とのDCFコード取り扱いに関する契約）を新たに締結するには、申請からどれくらいの期間が必要ですか？',
    options: [
      '申請後すぐに利用できる',
      '約1週間',
      '約2週間',
      '約1ヶ月'
    ],
    correct: [2],
    explanation: 'TPA契約を新たに締結する場合、申請から約2週間程度かかります。余裕を持ったスケジュールが重要です。',
    suggestion: 'TPA締結までの期間を覚えておきましょう'
  },
  {
    question: 'DCFコードを提供している会社はどこですか？',
    options: [
      'アルトマーク社',
      '日経BP',
      'シード・プランニング',
      'キャンドゥ'
    ],
    correct: [0],
    explanation: 'DCFコードはアルトマーク社が提供しています。日経BPはそのコードを使用してパネルマッチを行いますが、提供元ではありません。',
    suggestion: 'DCFコードの提供元を覚えておきましょう'
  },
  {
    question: 'Off-List配信とは何ですか？適切な説明を選んでください。',
    options: [
      'パネル外の医師にもアンケート案内を送ること。精度の低いリストや登録者が少ないときにクライアント許可の上で実施する。',
      '医師の資格を確認せずに無作為にリクルートする方法',
      'キャンドゥが独自に実施するキャンペーンの名称',
      '倫理審査に通さずに実施するリクルート方式'
    ],
    correct: [0],
    explanation: 'Off-List配信は、パネルマッチで対象者が少ない場合やリスト精度が低い場合に、クライアントの許可を得てパネル外の医師に案内を送る方法です。',
    suggestion: 'Off-List配信の定義と実施条件を確認しましょう'
  },
  {
    question: 'パネルマッチとは何ですか？',
    options: [
      'DCFコードリストを日経BPのパネルデータベースと照合し、パネル登録者を特定すること',
      '医師の専門コードと勤務先を組み合わせてターゲットを割り当てること',
      'アンケートパネルのメンバーが友達を紹介する仕組み',
      'リクルート対象を完全に無作為抽出すること'
    ],
    correct: [0],
    explanation: 'パネルマッチとは、DCFコードを日経BPのパネルデータベースと突合し、パネルに登録されている医師を特定するプロセスです。',
    suggestion: 'パネルマッチの役割を理解しましょう'
  },
  {
    question: 'DCFコードは個人情報に該当しますか？',
    options: [
      'コード単体では個人情報ではないが、医師名や施設名と紐づけると個人情報となる',
      '常に個人情報として扱われる',
      '個人情報ではないため自由に利用できる',
      '企業が契約していれば個人情報扱いを免除できる'
    ],
    correct: [0],
    explanation: 'DCFコード単体では個人情報に該当しませんが、医師名や施設名を紐づけた時点で個人情報となるため慎重な取り扱いが必要です。',
    suggestion: '個人情報保護とDCFの扱いを再確認しましょう'
  },
  {
    question: 'キャンドゥはDCFコードを使ってターゲットリストでリクルートを行うことができますか？',
    options: [
      '正式に認められているわけではないが、信頼関係の中で対応してもらえる場合がある',
      '日経BPと同じように正式な権限を持っている',
      '一切利用できない',
      'キャンドゥはパネルを持たないため関係ない'
    ],
    correct: [0],
    explanation: 'キャンドゥは公式な権限は持ちませんが、信頼関係がある場合に限り医師名で照合してリクルートを手助けしてもらえることがあります。',
    suggestion: 'キャンドゥとの協力関係や限界を理解しましょう'
  },
  {
    question: 'DCFコードとMDB（Master Data Bank）の違いとして正しいものはどれですか？',
    options: [
      'DCFコードは医師・施設を識別するコード、MDBは製薬企業や他企業が保有する医療関連データベースのこと',
      '両者は全く同じ意味で使われる',
      'MDBは個人情報保護の制限がない',
      'DCFは企業独自で作成されるコードでMDBは公的機関が提供する'
    ],
    correct: [0],
    explanation: 'DCFコードは個々の医師や施設を識別するためのコードであるのに対し、MDBは多様な医療関連情報が集められたデータベースを指します。',
    suggestion: 'DCFコードとMDBの役割の違いを整理しましょう'
  },
  {
    question: 'ターゲットリストの精度がリクルートの結果に影響する理由として当てはまるものを選んでください（複数選択）。',
    options: [
      '正しいコードや情報がないと対象者にアンケートが届かない',
      '登録済みのパネル数が減ってしまう',
      'リストの精度は結果に影響しない',
      '古いリストや誤ったコードではリクルートが完了できない場合がある'
    ],
    correct: [0, 3],
    explanation: 'ターゲットリストが正確でないと、対象者にアンケートが届かないだけでなく、古いデータや誤ったコードではリクルートが完了できない場合があります。',
    suggestion: 'リスト精度とリクルート成功率の関係を学びましょう'
  },
  {
    question: 'Off-List配信を実施するタイミングとして正しいものはどれですか？',
    options: [
      'パネルマッチで対象者が少ない場合やリスト精度が低い場合、クライアントの許可を得て実施する',
      '対象者が多すぎる場合',
      'クライアントの許可がなくても自由に実施できる',
      'Off-List配信はNGであり、常に避けるべき'
    ],
    correct: [0],
    explanation: 'Off-List配信は、パネルマッチの結果対象者が少ない場合やリストの精度が低い場合に、クライアントの許可を得た上でパネル外の医師へ案内する方法です。',
    suggestion: 'Off-List配信の実施条件を確認しましょう'
  },
  {
    question: 'パネルマッチの結果、有効な対象者がほとんどいない場合の対応として適切なものを選んでください（複数選択）。',
    options: [
      'クライアントにリストの更新・精査を依頼する',
      '古いままのリストで進める',
      'Off-List配信を検討する（クライアント許可の上）',
      'リクルートを中止するのみ'
    ],
    correct: [0, 2],
    explanation: '有効な対象者が少ない場合は、クライアントにリストの更新や精査を依頼し、必要に応じてOff-List配信を検討します。',
    suggestion: 'リストが不足している場合の対処法を学びましょう'
  },
  {
    question: 'TPA（Tri-Party Agreement）は何を指しますか？',
    options: [
      'アルトマーク社が提供するDCFコードの取り扱いに関する契約で、製薬会社・リサーチエージェンシー・データ提供元の三者間で結ぶ',
      '医療機関と患者の間で結ぶ治療契約',
      'キャンドゥとシード・プランニングのパートナー契約',
      'クライアントがアンケート回答者に支払う謝礼契約'
    ],
    correct: [0],
    explanation: 'TPA（Tri-Party Agreement）は、アルトマーク社のDCFコードを適切に取り扱うために製薬会社・リサーチエージェンシー・日経BPなどの三者間で締結する契約です。',
    suggestion: 'TPAの定義と目的を理解しましょう'
  },
  {
    question: 'DCFコードの利用料を支払っているのは誰ですか？（複数選択）',
    options: [
      '製薬企業や医療関連企業',
      '日経BP',
      'シード・プランニング',
      '一般の消費者'
    ],
    correct: [0, 1],
    explanation: 'DCFコードの利用料は製薬企業や医療関連企業、日経BPなどが支払っており、一般消費者は利用しません。',
    suggestion: 'DCFコード利用料の負担者を覚えておきましょう'
  },
  {
    question: 'DCFコードを取り扱うことができるのは誰ですか？（当てはまるものをすべて選択）',
    options: [
      'アルトマーク社',
      '日経BP',
      'TPA契約を結んだリサーチエージェンシー',
      'どの会社でも自由に扱える'
    ],
    correct: [0, 1, 2],
    explanation: 'DCFコードの取り扱いはアルトマーク社、日経BP、およびTPA契約を締結したリサーチエージェンシーに限られます。',
    suggestion: 'DCFコードを扱う権限がある主体を理解しましょう'
  },
  {
    question: '医師名や施設名が紐づいたDCFコードリストを受け取った場合、取り扱いの際に必要な配慮として適切なものを選んでください。',
    options: [
      '対象者の個人情報が含まれるため、暗号化や安全な保管など厳重な管理を行う',
      'リストを自由にコピーして社内で共有する',
      '個人情報でないので特に配慮は不要',
      '必要に応じて不要な情報はマスキングする'
    ],
    correct: [0, 3],
    explanation: '氏名や施設名が紐づいたリストは個人情報に該当するため、暗号化や安全な保管、不要情報のマスキングなど厳重な管理が必要です。',
    suggestion: '個人情報の取り扱い方法を再確認しましょう'
  },
  {
    question: 'DCFコードを用いてリクルートメールを送る際に注意すべき点は？（複数選択）',
    options: [
      '対象者の個人情報（氏名等）を本文に記載しない',
      'メールの件名に製薬会社名や製品名を明記する',
      'コードが本人以外に漏れないよう送信先を慎重に確認する',
      'オファーの報酬額を自由に変更してよい'
    ],
    correct: [0, 2],
    explanation: 'リクルートメールでは個人情報を明記せず、送信先が正しいかを慎重に確認することが重要です。件名に製薬会社名や製品名を明記することは通常避け、報酬額はクライアントの指示に従います。',
    suggestion: 'リクルートメールの作成時の注意点を学びましょう'
  },
  {
    question: '複数のリストからDCFコードを取り寄せたところ、同じ医師に対して異なるコードが含まれていました。どう対処すべきですか？',
    options: [
      'アルトマーク社へ確認し、最新かつ正しいコードに統一する',
      'すべてのコードを併用してリクルートする',
      '重複分は削除し、残りのコードでリクルートする',
      'どれが正しいかわからないのでリクルートを中止する'
    ],
    correct: [0],
    explanation: '複数のコードに矛盾がある場合は、アルトマーク社に確認して最新かつ正しいコードに統一する必要があります。',
    suggestion: 'コードが重複した際の適切な対処法を覚えましょう'
  }
];

// 出題数（ランダムに選択）
const NUM_QUESTIONS = 12;

// シャッフル関数（Fisher-Yates）
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 選択された質問セットと進捗
let quizData = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let topicsToReview = [];

// クイズカードのコンテナを取得
const container = document.getElementById('quiz-container');

/**
 * 現在の質問を描画します。
 */
function renderQuestion() {
  const q = quizData[currentQuestionIndex];
  // 進捗を表示
  let html = `<div class="progress">質問 ${currentQuestionIndex + 1} / ${quizData.length}</div>`;
  html += `<div class="question-text">${q.question}</div>`;
  html += '<div class="options">';
  const multiple = q.correct.length > 1;
  const inputType = multiple ? 'checkbox' : 'radio';
  q.options.forEach((opt, i) => {
    html += `<label><input type="${inputType}" name="option${currentQuestionIndex}" value="${i}"> ${opt}</label>`;
  });
  html += '</div>';
  html += `<button id="submitBtn">回答する</button>`;
  container.innerHTML = html;
  document.getElementById('submitBtn').addEventListener('click', checkAnswer);
}

/**
 * ユーザーの回答を検証し、フィードバックを表示します。
 */
function checkAnswer() {
  const q = quizData[currentQuestionIndex];
  // 選択された値を取得
  const selected = Array.from(container.querySelectorAll('.options input:checked')).map(input => parseInt(input.value));
  if (selected.length === 0) {
    // 何も選択していない場合は注意メッセージを表示
    alert('少なくとも1つ選択してください。');
    return;
  }
  // 配列をソートして比較（順序が異なってもOK）
  const selectedSorted = [...selected].sort((a, b) => a - b);
  const correctSorted = [...q.correct].sort((a, b) => a - b);
  const isCorrect = selectedSorted.length === correctSorted.length && selectedSorted.every((v, i) => v === correctSorted[i]);

  // すでに回答したらボタンを無効化
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;

  // オプションも無効化
  container.querySelectorAll('.options input').forEach(el => {
    el.disabled = true;
  });

  // フィードバック領域を生成
  const feedbackDiv = document.createElement('div');
  feedbackDiv.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
  if (isCorrect) {
    correctCount++;
    feedbackDiv.innerHTML = `<strong>正解です！</strong><br>${q.explanation}`;
  } else {
    // 誤答の場合は復習すべきトピックを記録
    if (q.suggestion && !topicsToReview.includes(q.suggestion)) {
      topicsToReview.push(q.suggestion);
    }
    feedbackDiv.innerHTML = `<strong>残念、不正解です。</strong><br>${q.explanation}`;
  }
  container.appendChild(feedbackDiv);

  // 次へボタンを追加
  const nextBtn = document.createElement('button');
  nextBtn.textContent = currentQuestionIndex + 1 < quizData.length ? '次の質問へ' : '結果を見る';
  nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      renderQuestion();
    } else {
      showResults();
    }
  });
  container.appendChild(nextBtn);
}

/**
 * クイズ終了後、最終結果を表示します。
 */
function showResults() {
  const total = quizData.length;
  // 全問正解かどうかで表示内容を分岐
  if (topicsToReview.length === 0) {
    // 証書と盛大なお祝い
    const html = `
      <div class="certificate">
        <h2>全問正解！🎉🎊 おめでとうございます！</h2>
        <p>素晴らしい！あなたはDCFコードの取り扱いに関するクイズをすべてクリアしました。</p>
        <p>この証書は、あなたがDCFコードの理解と運用に関する知識をしっかりと身につけた証です。</p>
        <p>これからも自信を持ってプロジェクトに取り組みましょう！</p>
      </div>
      <button id="restartBtn">もう一度挑戦する</button>
    `;
    container.innerHTML = html;
  } else {
    // 復習ポイントを表示
    const suggestionItems = topicsToReview.map(t => `<li>${t}</li>`).join('');
    const html = `
      <div class="progress">結果</div>
      <div class="question-text">全${total}問中${correctCount}問正解でした。</div>
      <div class="feedback incorrect">
        <strong>復習が必要なポイント:</strong>
        <ul>${suggestionItems}</ul>
      </div>
      <button id="restartBtn">もう一度挑戦する</button>
    `;
    container.innerHTML = html;
  }
  // 再挑戦ボタン
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      // ランダムに新しいクイズセットを生成
      const shuffled = shuffleArray([...questionPool]);
      quizData = shuffled.slice(0, NUM_QUESTIONS);
      currentQuestionIndex = 0;
      correctCount = 0;
      topicsToReview = [];
      renderQuestion();
    });
  }
}

/**
 * 正解数に応じたメッセージを生成します。
 *
 * @param {number} score 得点
 * @param {number} total 全問題数
 * @returns {string} メッセージ
 */
function resultMessage(score, total) {
  const ratio = score / total;
  if (ratio === 1) {
    return '完璧です！DCFコードの取り扱いに非常に詳しいですね。';
  } else if (ratio >= 0.7) {
    return 'なかなか優秀です！あと少しで満点です。';
  } else if (ratio >= 0.4) {
    return '半分程度の理解が出来ています。解説を参考に復習しましょう。';
  } else {
    return '理解が不足しています。解説をよく読み、改めて学習してみてください。';
  }
}

// 初期化：ページ読み込み完了後に最初の質問を表示
document.addEventListener('DOMContentLoaded', () => {
  // 初回読み込み時に問題プールからランダムで出題を選択
  const shuffled = shuffleArray([...questionPool]);
  quizData = shuffled.slice(0, NUM_QUESTIONS);
  renderQuestion();
});