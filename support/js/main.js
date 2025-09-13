// グローバル変数
let currentQuestionIndex = 0;
let userAnswers = [];
let scores = {
    advanced: 0,
    intermediate: 0,
    beginner: 0,
    resistant: 0
};

// DOM要素の取得
const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const resultPage = document.getElementById('result-page');
const progressFill = document.getElementById('progress-fill');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    totalQuestionsSpan.textContent = quizData.questions.length;
    showPage('start');
});

// ページ表示の管理
function showPage(pageType) {
    // すべてのページを非表示
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 指定されたページを表示
    switch(pageType) {
        case 'start':
            startPage.classList.add('active');
            break;
        case 'quiz':
            quizPage.classList.add('active');
            break;
        case 'result':
            resultPage.classList.add('active');
            break;
    }
}

// クイズ開始
function startQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    scores = {
        advanced: 0,
        intermediate: 0,
        beginner: 0,
        resistant: 0
    };
    showPage('quiz');
    displayQuestion();
}

// 質問表示
function displayQuestion() {
    const question = quizData.questions[currentQuestionIndex];
    
    // プログレスバー更新
    const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
    progressFill.style.width = progress + '%';
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // 質問テキスト表示
    questionText.textContent = question.text;
    
    // オプション表示
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        optionElement.onclick = () => selectOption(index);
        
        // 既に選択された回答がある場合は表示
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    // ナビゲーションボタンの状態更新
    updateNavigationButtons();
}

// オプション選択
function selectOption(optionIndex) {
    // 既存の選択を解除
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 新しい選択を適用
    document.querySelectorAll('.option')[optionIndex].classList.add('selected');
    
    // 回答を保存
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // ナビゲーションボタンの状態更新
    updateNavigationButtons();
    
    // 少し遅らせて自動で次の質問に進む（最後の質問以外）
    if (currentQuestionIndex < quizData.questions.length - 1) {
        setTimeout(() => {
            nextQuestion();
        }, 500);
    }
    // 最後の質問の場合は自動実行せず、ユーザーがボタンクリックするまで待機
}

// 前の質問に戻る
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// 次の質問に進む
function nextQuestion() {
    if (currentQuestionIndex < quizData.questions.length - 1 && userAnswers[currentQuestionIndex] !== undefined) {
        currentQuestionIndex++;
        displayQuestion();
    } else if (currentQuestionIndex === quizData.questions.length - 1 && userAnswers[currentQuestionIndex] !== undefined) {
        calculateResults();
    }
}

// ナビゲーションボタンの状態更新
function updateNavigationButtons() {
    // 前へボタン
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // 次へボタン
    const hasAnswer = userAnswers[currentQuestionIndex] !== undefined;
    nextBtn.disabled = !hasAnswer;
    
    // 最後の質問の場合はボタンテキストを変更
    if (currentQuestionIndex === quizData.questions.length - 1) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> 結果を見る';
    } else {
        nextBtn.innerHTML = '次の質問 <i class="fas fa-arrow-right"></i>';
    }
}

// 結果計算
function calculateResults() {
    // スコアをリセット
    scores = {
        advanced: 0,
        intermediate: 0,
        beginner: 0,
        resistant: 0
    };
    
    // 各回答のスコアを集計
    userAnswers.forEach((answerIndex, questionIndex) => {
        if (answerIndex !== undefined) {
            const question = quizData.questions[questionIndex];
            if (question && question.options && question.options[answerIndex]) {
                const selectedOption = question.options[answerIndex];
                
                // スコアを加算
                Object.keys(selectedOption.scores).forEach(type => {
                    scores[type] += selectedOption.scores[type];
                });
            }
        }
    });
    
    // 最高スコアの学習タイプを決定
    const maxScore = Math.max(...Object.values(scores));
    const dominantType = Object.keys(scores).find(type => scores[type] === maxScore);
    
    // 結果表示
    displayResults(dominantType);
}

// 結果表示
function displayResults(learningType) {
    if (!learningTypes[learningType]) {
        return;
    }
    
    const type = learningTypes[learningType];
    const resources = resourcesData[learningType];
    
    // アイコンと色を設定
    const resultIcon = document.getElementById('result-icon');
    resultIcon.className = type.icon;
    resultIcon.style.color = type.color;
    
    // タイトルと説明を設定
    document.getElementById('result-title').textContent = type.name;
    document.getElementById('result-text').textContent = type.description;
    
    // 特徴を追加
    const resultDescription = document.querySelector('.result-description');
    const characteristicsHTML = `
        <p>${type.description}</p>
        <h4 style="margin-top: 20px; margin-bottom: 12px; color: #1f2937;">
            <i class="fas fa-lightbulb" style="color: ${type.color}; margin-right: 8px;"></i>
            あなたの学習特徴
        </h4>
        <ul style="padding-left: 20px; line-height: 1.8;">
            ${type.characteristics.map(char => `<li>${char}</li>`).join('')}
        </ul>
    `;
    resultDescription.innerHTML = characteristicsHTML;
    
    // おすすめリソースを表示
    const resourcesContainer = document.getElementById('resources-container');
    resourcesContainer.innerHTML = '';
    
    // Check if resources exist
    if (!resources || resources.length === 0) {
        resourcesContainer.innerHTML = '<p style="color: #6b7280;">このカテゴリのリソースは現在準備中です。</p>';
        return;
    }
    
    resources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        resourceCard.innerHTML = `
            <h4>${resource.title}</h4>
            <p>${resource.description}</p>
            ${resource.url === '#' ? 
                '<span class="resource-link-disabled"><i class="fas fa-info-circle"></i> 詳細は別途案内</span>' : 
                `<a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> 詳細を見る
                </a>`
            }
            <div class="resource-tags">
                ${resource.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
            </div>
        `;
        resourcesContainer.appendChild(resourceCard);
    });
    
    // スコアの詳細表示（デバッグ用 - 本番では非表示にしても良い）
    const scoreDetails = document.createElement('div');
    scoreDetails.style.cssText = `
        background: #f3f4f6;
        padding: 16px;
        border-radius: 8px;
        margin-top: 20px;
        font-size: 0.9rem;
        color: #6b7280;
    `;
    scoreDetails.innerHTML = `
        <h4 style="margin-bottom: 8px; color: #374151;">診断スコア詳細</h4>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <div>上級者: ${scores.advanced}点</div>
            <div>中級者: ${scores.intermediate}点</div>
            <div>初心者: ${scores.beginner}点</div>
            <div>慎重派: ${scores.resistant}点</div>
        </div>
    `;
    resultDescription.appendChild(scoreDetails);
    
    // 結果ページを表示
    showPage('result');
}

// クイズを再開
function restartQuiz() {
    startQuiz();
}

// 結果をシェア
function shareResult() {
    const dominantType = Object.keys(scores).find(type => 
        scores[type] === Math.max(...Object.values(scores))
    );
    const type = learningTypes[dominantType];
    
    const shareText = `学習リソース診断の結果: 私は「${type.name}」でした！あなたも診断してみませんか？`;
    
    if (navigator.share) {
        // Web Share API が利用可能な場合
        navigator.share({
            title: '学習リソース診断結果',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // フォールバック: クリップボードにコピー
        navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
            alert('結果がクリップボードにコピーされました！');
        }).catch(() => {
            // さらなるフォールバック
            const textArea = document.createElement('textarea');
            textArea.value = shareText + ' ' + window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('結果がクリップボードにコピーされました！');
        });
    }
}

// キーボードナビゲーション
document.addEventListener('keydown', function(event) {
    if (quizPage.classList.contains('active')) {
        if (event.key === 'ArrowLeft' && !prevBtn.disabled) {
            previousQuestion();
        } else if (event.key === 'ArrowRight' && !nextBtn.disabled) {
            nextQuestion();
        } else if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            const options = document.querySelectorAll('.option');
            if (options[optionIndex]) {
                selectOption(optionIndex);
            }
        }
    }
});

// エンターキーでクイズ開始
document.addEventListener('keydown', function(event) {
    if (startPage.classList.contains('active') && event.key === 'Enter') {
        startQuiz();
    }
});