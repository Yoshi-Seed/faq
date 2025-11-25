// app.js
(() => {
  const STORAGE_KEY = "wayne_yoshi_memo_v1";

  // ✅ Google Sheets WebApp URL
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwBBYcJpLXbfiooN5M9XnzKrBQa-F07ICZ8xSzXvJmf0j8mz-Wztv0j9i63c1btAubw/exec";

  const entryForm = document.getElementById("entryForm");
  const categoryGroup = document.getElementById("categoryGroup");
  const moodGroup = document.getElementById("moodGroup");
  const categoryHidden = document.getElementById("categoryHidden");
  const moodHidden = document.getElementById("moodHidden");
  const memoText = document.getElementById("memoText");
  const entriesList = document.getElementById("entriesList");
  const exportButton = document.getElementById("exportButton");
  const clearButton = document.getElementById("clearButton");
  const wayneMessage = document.getElementById("wayneMessage");
  const recordButton = document.getElementById("recordButton");
  const nowTimeEl = document.getElementById("nowTime");
  const bubble = document.querySelector(".floating-bubble");
  const celebrateLayer = document.getElementById("celebrateLayer");
  const rippleLayer = document.getElementById("rippleLayer");
  const appShell = document.querySelector(".app-shell");

  if (!entryForm) {
    console.error("entryForm が見つかりません。HTML構造を確認してください。");
    return;
  }

  // ---- メッセージたち ----
  const defaultMessages = [
    "今日のひとこと、ちゃんと受け取ったよ。Yoshi、おつかれさま。",
    "メモしておくって、それだけで未来のYoshiへのプレゼントだと思う。",
    "はい、記録完了。ここはいつでもYoshiの味方チームだからね。",
    "いいね、その気づき。あとで一緒に振り返るのが楽しみだなぁ。",
    "今の気持ち、ちゃんと残せたね。深呼吸して、お茶でもどう？"
  ];

  const moodMessages = {
    楽しみ: [
      "ワクワクが伝わってきたよ。その気持ち、ちゃんと未来に届けておいた！",
      "楽しみがあるって、それだけで今日がちょっと明るくなるね。",
      "その「楽しみ」、カレンダーじゃなくて心のアルバムにも保存完了。"
    ],
    不安: [
      "不安を書き出せたの、すごく大事な一歩だと思う。ここでは何を書いても大丈夫だよ。",
      "不安を1人で抱え込まなくていいからね。文字にした分だけ、少し軽くなりますように。",
      "「不安」ラベルで記録したよ。いつでも一緒に整理していこう。"
    ],
    安心: [
      "ほっとした気持ち、こっちにも伝わってきたよ。よかったね。",
      "安心できた瞬間って、ほんとに尊い。ちゃんとメモに残しておこう。",
      "「大丈夫だった」という記録は、未来の不安へのお守りになると思う。"
    ],
    心配: [
      "心配なこと、ここに預けてくれてありがとう。一人で抱えすぎないでね。",
      "その心配、ちゃんとラベル付きで保存したよ。状況が変わったら一緒に更新しよ。",
      "心配って、優しさの裏返しでもあるよね。その気持ちも含めて大事に扱おう。"
    ],
    怒り: [
      "怒りをちゃんと文字にできるYoshi、すごく健全だと思う。ここでは何色の感情でもOK。",
      "ムカッとした気持ち、ログに残しておいたよ。Yoshiの味方でいるから安心して。",
      "怒りのエネルギー、あとでいい方向に変換できるように一緒に眺めよ。"
    ],
    落胆: [
      "落ち込む日もあるよね。その気持ちを書いてくれてありがとう。一人じゃないよ。",
      "うまくいかなかった日の記録も、いつか成長の証になるはず。ゆっくりで大丈夫。",
      "「今日はしんどかった」が言えるのは、とても強いことだと思う。"
    ],
    希望: [
      "希望のメモ、いいね。小さな一歩でも、ちゃんと未来につながってるよ。",
      "その「こうなったらいいな」、一緒に見守らせてね。",
      "希望の芽、ちゃんとここに植えておいたよ。たまに一緒に水やりしよう。"
    ],
    落ち着き: [
      "落ち着けたって記録、すごく大事。今の静けさ、ちゃんと保存したよ。",
      "その穏やかさ、未来のYoshiの避難所になるね。"
    ],
    反省: [
      "反省を書けるのは前に進む力だと思う。ちゃんと受け取ったよ。",
      "今日の反省は、明日の優しさに変わるやつだね。"
    ],
    前向き: [
      "前向きスイッチ、点いたね。いいぞYoshi、そのままいこう。",
      "その前向きさ、今のYoshiにすごく似合ってる。"
    ],
    冷静: [
      "冷静でいられた自分、ちゃんと誇っていいと思う。",
      "静かに整えた感覚、ログに残しておいたよ。"
    ],
    混乱: [
      "混乱してる時ほど、書いて整理するのが効くんだよね。ここで一緒にほどこ。",
      "その『わからなさ』も含めて大事な記録だよ。"
    ]
  };

  const clearMessages = [
    "ログを一度リセットしたよ。ここからまた、新しいページをゆっくり埋めていこ。",
    "データをきれいにしたよ。スッキリした気分で、また好きなときに使ってね。"
  ];

  const categoryMissingMessages = [
    "どの箱に入れるか、1つだけ選んでみよっか？迷ったら「メモ」でOKだよ。",
    "カテゴリをポチッとしてから記録ボタン、の順番でいこっか。"
  ];

  // ---- データの読み書き ----
  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      console.warn("メモの読み込みに失敗しました。", e);
      return [];
    }
  }

  function saveEntries(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      console.warn("メモの保存に失敗しました。", e);
    }
  }

  let entries = loadEntries();

  // ---- 日時表示 ----
  function formatDisplay(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const wdNames = ["日", "月", "火", "水", "木", "金", "土"];
    const wd = wdNames[date.getDay()];
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${d} (${wd}) ${hh}:${mm}`;
  }

  function updateNowTime() {
    if (!nowTimeEl) return;
    const now = new Date();
    nowTimeEl.textContent = formatDisplay(now);
  }

  // ---- ユーティリティ ----
  function pickRandom(arr) {
    if (!arr || arr.length === 0) return "";
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
  }

  function normalizeMood(moodValue) {
    if (!moodValue) return "";
    const parts = moodValue.split(" ");
    if (parts.length >= 2) {
      return parts.slice(1).join(" ");
    }
    return moodValue;
  }

  function showWayneMessage({ mood, type } = {}) {
    if (!wayneMessage) return;

    let pool;
    if (type === "clear") pool = clearMessages;
    else if (type === "categoryMissing") pool = categoryMissingMessages;
    else if (mood) {
      const simpleMood = normalizeMood(mood);
      pool = moodMessages[simpleMood] || defaultMessages;
    } else pool = defaultMessages;

    const text = pickRandom(pool) ||
      "うまくメッセージが拾えなかった…でもちゃんと記録はできてるから安心してね。";

    wayneMessage.classList.remove("pop");
    void wayneMessage.offsetWidth;
    wayneMessage.textContent = text;
    wayneMessage.classList.add("pop");
  }

  // ---- pillボタンのセットアップ ----
  function setupPills() {
    const categoryButtons = Array.from(
      categoryGroup.querySelectorAll("button[data-value]")
    );
    const moodButtons = Array.from(
      moodGroup.querySelectorAll("button[data-value]")
    );

    function attachPillBehavior(buttons, hiddenInput, groupElement) {
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const value = btn.dataset.value || "";
          if (hiddenInput.value === value) {
            hiddenInput.value = "";
            btn.classList.remove("active");
          } else {
            hiddenInput.value = value;
            buttons.forEach((b) => b.classList.toggle("active", b === btn));
          }
          if (groupElement && groupElement.classList.contains("shake")) {
            groupElement.classList.remove("shake");
          }
        });
      });
    }

    attachPillBehavior(categoryButtons, categoryHidden, categoryGroup);
    attachPillBehavior(moodButtons, moodHidden, moodGroup);
  }

  // ---- エネルギースライダーのセットアップ ----
  function setupEnergySlider() {
    const energySlider = document.getElementById("energySlider");
    const energyValue = document.getElementById("energyValue");
    const energyHidden = document.getElementById("energyHidden");
    
    if (!energySlider || !energyValue || !energyHidden) return;
    
    const energyLabels = ["しんどい", "低め", "普通", "まあまあ", "元気"];
    
    function updateEnergyDisplay() {
      const value = parseInt(energySlider.value);
      const label = energyLabels[value] || "普通";
      energyValue.textContent = label;
      energyHidden.value = label;
    }
    
    energySlider.addEventListener("input", updateEnergyDisplay);
    energySlider.addEventListener("change", updateEnergyDisplay);
    
    // 初期値を設定
    updateEnergyDisplay();
  }

  // ---- メモ一覧の描画 ----
  function renderEntries() {
    if (!entriesList) return;
    entriesList.innerHTML = "";

    if (!entries.length) {
      const p = document.createElement("p");
      p.className = "empty-text";
      p.textContent = "まだメモはありません。最初のひとこと、残してみる？";
      entriesList.appendChild(p);
      return;
    }

    const fragment = document.createDocumentFragment();
    entries.forEach((entry) => {
      const item = document.createElement("article");
      item.className = "entry-item";

      const meta = document.createElement("div");
      meta.className = "entry-meta";
      const moodPart = entry.mood ? ` · ${entry.mood}` : "";
      const energyPart = entry.energy ? ` · ${entry.energy}` : "";
      meta.textContent = `${entry.displayTime} · ${entry.category}${moodPart}${energyPart}`;

      const text = document.createElement("p");
      text.className = "entry-text";
      text.textContent = entry.memo || "(メモは空欄)";

      item.appendChild(meta);
      item.appendChild(text);
      fragment.appendChild(item);
    });
    entriesList.appendChild(fragment);
  }

  function updateExportState() {
    const hasEntries = entries.length > 0;
    if (exportButton) exportButton.disabled = !hasEntries;
    if (clearButton) clearButton.disabled = !hasEntries;
  }

  // ---- フォーム送信 ----
  async function handleSubmit(event) {
    event.preventDefault();

    const category = categoryHidden.value;
    const mood = moodHidden.value;
    const energy = document.getElementById("energyHidden")?.value || "普通";
    const memo = memoText.value.trim();

    if (!category) {
      if (categoryGroup) {
        categoryGroup.classList.remove("shake");
        void categoryGroup.offsetWidth;
        categoryGroup.classList.add("shake");
      }
      showWayneMessage({ type: "categoryMissing" });
      return;
    }

    const now = new Date();
    const entry = {
      id: `e_${now.getTime()}`,
      timestamp: now.toISOString(),
      displayTime: formatDisplay(now),
      category,
      mood,
      energy,
      memo
    };

    // ✅ ローカル保存
    entries.unshift(entry);
    saveEntries(entries);
    renderEntries();
    updateExportState();

    memoText.value = "";

    if (recordButton) {
      recordButton.classList.add("saved");
      setTimeout(() => recordButton.classList.remove("saved"), 300);
    }

    // ✅ Sheetsへ送信
    try {
      console.log("📤 Sending to Google Sheets:", entry);
      console.log("📤 Energy value:", entry.energy);
      await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(entry)
      });
      console.log("✅ Successfully sent to Google Sheets");
    } catch (e) {
      console.warn("Sheets送信に失敗（ローカル保存はOK）:", e);
    }

    // ✅ 祝福＆ウェインツ君ひと言
    celebrate();
    showWayneMessage({ mood });
  }

  // ---- エクスポート ----
  function makeExportContent(list) {
    const header = "iso_timestamp\t日時\tカテゴリ\t気分\t余力\tメモ";
    const lines = list.map((e) => {
      const memo = (e.memo || "")
        .replace(/\t/g, " ")
        .replace(/\r?\n/g, "\\n");
      const mood = e.mood || "";
      const energy = e.energy || "";
      return `${e.timestamp}\t${e.displayTime}\t${e.category}\t${mood}\t${energy}\t${memo}`;
    });
    return [header, ...lines].join("\n");
  }

  function handleExport() {
    if (!entries.length) {
      showWayneMessage();
      return;
    }

    const content = makeExportContent(entries);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    a.download = `yoshi_memo_${y}${m}${d}.txt`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showWayneMessage();
  }

  // ---- 全削除 ----
  function handleClear() {
    if (!entries.length) return;
    const ok = window.confirm(
      "本当にすべてのメモを削除しますか？\n（この操作は元に戻せません）"
    );
    if (!ok) return;

    entries = [];
    saveEntries(entries);
    renderEntries();
    updateExportState();
    showWayneMessage({ type: "clear" });
  }

  // ---- 時間帯で背景テーマを変える ----
  function applyThemeByTime() {
    const now = new Date();
    const h = now.getHours();
    document.body.classList.remove(
      "theme-morning",
      "theme-day",
      "theme-evening",
      "theme-night"
    );

    if (h >= 5 && h < 9) {
      document.body.classList.add("theme-morning");
    } else if (h >= 9 && h < 16) {
      document.body.classList.add("theme-day");
    } else if (h >= 16 && h < 20) {
      document.body.classList.add("theme-evening");
    } else {
      document.body.classList.add("theme-night");
    }
  }

  // ---- 記録した瞬間の小さな祝福 ----
  function celebrate() {
    if (!celebrateLayer) return;
    const icons = ["✨","🌟","💫","🎉","🫧","⭐️"];
    const count = 14; 

    const rect = recordButton.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.textContent = icons[Math.floor(Math.random() * icons.length)];

      const spreadX = (Math.random() - 0.5) * 160;
      const spreadY = Math.random() * 40;
      p.style.left = `${originX + spreadX}px`;
      p.style.top = `${originY - spreadY}px`;
      p.style.animationDelay = `${Math.random() * 120}ms`;

      celebrateLayer.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  }

  // ---- バブル触ったら背景がぱぱぱ〜ん：リップル魔法 ----
  function bubbleMagic(x, y) {
    if (!rippleLayer) return;

    for (let i = 0; i < 3; i++) {
      const r = document.createElement("div");
      r.className = "ripple";
      r.style.left = `${x}px`;
      r.style.top = `${y}px`;
      r.style.animationDelay = `${i * 120}ms`;
      rippleLayer.appendChild(r);
      r.addEventListener("animationend", () => r.remove());
    }

    if (appShell) {
      appShell.classList.remove("wave-animate");
      void appShell.offsetWidth; 
      appShell.classList.add("wave-animate");
      appShell.addEventListener(
        "animationend",
        () => appShell.classList.remove("wave-animate"),
        { once: true }
      );
    }
  }

  if (bubble) {
    bubble.addEventListener("click", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      bubbleMagic(x, y);
    });
  }

  // ---- ☁️ 雲を生成して浮かべる（修正版：JSで強制的に黒を透過） ----
  function initClouds() {
    const layer = document.getElementById("cloudLayer");
    if (!layer) return;

    // 🔥 JSで強制的にレイヤー順序を修正（これでカードの裏に行きます）
    layer.style.zIndex = "0";

    const cloudImages = [
      "images/cloud1.png",
      "images/cloud2.png",
      "images/cloud3.png"
    ];

    const cloudCount = 5;

    for (let i = 0; i < cloudCount; i++) {
      const img = document.createElement("img");
      img.src = pickRandom(cloudImages);
      img.className = "cloud";
      img.alt = ""; 

      // 透明背景画像を使用しているのでmix-blend-modeは不要 
      
      const topPos = Math.random() * 60; 
      const sizeScale = 0.5 + Math.random() * 0.8; 
      const duration = 40 + Math.random() * 40; 
      const delay = Math.random() * -80; 

      img.style.top = `${topPos}%`;
      img.style.width = `${200 * sizeScale}px`; 
      img.style.animation = `cloudFloat ${duration}s linear infinite`;
      img.style.animationDelay = `${delay}s`;

      layer.appendChild(img);
    }
  }

  // ---- 🌠 流れ星を定期的に降らせる ----
  function startShootingStars() {
    const layer = document.getElementById("starLayer");
    if (!layer) return;

    // 星レイヤーも念のためJSでz-index指定
    layer.style.zIndex = "0";

    function spawnStar() {
      if (!document.body.classList.contains("theme-night")) return;

      const star = document.createElement("div");
      star.className = "shooting-star";

      const tail = document.createElement("div");
      tail.className = "star-tail";
      star.appendChild(tail);

      const startX = 50 + Math.random() * 50; 
      const startY = Math.random() * 40;
      
      star.style.left = `${startX}%`;
      star.style.top = `${startY}%`;

      const duration = 1.5 + Math.random() * 1.5;
      star.style.animation = `shootStar ${duration}s ease-out forwards`;

      layer.appendChild(star);
      star.addEventListener("animationend", () => star.remove());
    }

    function loop() {
      const nextDelay = 4000 + Math.random() * 6000;
      setTimeout(() => {
        spawnStar();
        loop();
      }, nextDelay);
    }

    loop();
  }

  // ---- ✨ 左側でゆっくり点滅する星（3つ） ----
  function startTwinklingStars() {
    const layer = document.getElementById("starLayer");
    if (!layer) return;

    console.log("Twinkling stars system initialized");

    // 3つの星の位置を定義（左側エリア）
    const starPositions = [
      { left: "8%", top: "15%" },   // 左上
      { left: "12%", top: "40%" },  // 左中央
      { left: "6%", top: "65%" }    // 左下
    ];

    // 3つの星を作成
    starPositions.forEach((pos, index) => {
      const star = document.createElement("div");
      star.className = `twinkling-star twinkling-star-${index + 1}`;
      star.style.left = pos.left;
      star.style.top = pos.top;
      
      layer.appendChild(star);
      console.log(`Twinkling star ${index + 1} created at ${pos.left}, ${pos.top}`);
    });
  }

  // ---- ☁️⚡ 入道雲イベント（30秒〜1分に1度） ----
  function startEventCloud() {
    const layer = document.getElementById("cloudLayer");
    if (!layer) return;

    let eventCloudElement = null;
    let isEventRunning = false;

    function spawnEventCloud() {
      // 昼または朝のテーマのときのみ表示
      const isDayOrMorning = 
        document.body.classList.contains("theme-day") ||
        document.body.classList.contains("theme-morning");
      
      if (!isDayOrMorning || isEventRunning) return;

      // 既存の入道雲があれば削除
      if (eventCloudElement) {
        eventCloudElement.remove();
      }

      // 新しい入道雲を作成
      eventCloudElement = document.createElement("div");
      eventCloudElement.className = "event-cloud";
      layer.appendChild(eventCloudElement);

      // アニメーション開始
      setTimeout(() => {
        eventCloudElement.classList.add("active");
        isEventRunning = true;
      }, 100);

      // アニメーション終了後にクリーンアップ
      setTimeout(() => {
        if (eventCloudElement) {
          eventCloudElement.remove();
          eventCloudElement = null;
        }
        isEventRunning = false;
      }, 46000); // 45秒のアニメーション + 1秒の余裕
    }

    function scheduleNextEvent() {
      // 30秒〜60秒のランダムな間隔
      const nextDelay = 30000 + Math.random() * 30000;
      setTimeout(() => {
        spawnEventCloud();
        scheduleNextEvent();
      }, nextDelay);
    }

    // 最初のイベントは10秒後に開始
    setTimeout(() => {
      spawnEventCloud();
      scheduleNextEvent();
    }, 10000);
  }

  // ---- 🌆 夕方の雲イベント（画面上部と中央） ----
  function startEveningClouds() {
    const layer = document.getElementById("cloudLayer");
    if (!layer) {
      console.error("cloudLayer not found for evening clouds!");
      return;
    }
    
    console.log("Evening cloud system initialized");

    let cloud1Element = null;
    let cloud2Element = null;
    let isCloud1Running = false;
    let isCloud2Running = false;

    function spawnEveningCloud1() {
      // 夕方のテーマのときのみ表示
      const isEvening = document.body.classList.contains("theme-evening");
      
      console.log("Attempting to spawn evening cloud 1...");
      console.log("Theme check - isEvening:", isEvening);
      
      if (!isEvening) {
        console.log("Not spawning cloud 1: not evening theme");
        return;
      }
      
      if (isCloud1Running) {
        console.log("Not spawning cloud 1: already running");
        return;
      }

      // 既存の雲があれば削除
      if (cloud1Element) {
        cloud1Element.remove();
      }

      console.log("Creating evening cloud 1 element...");
      // 新しい雲を作成
      cloud1Element = document.createElement("div");
      cloud1Element.className = "evening-cloud-1";
      layer.appendChild(cloud1Element);
      console.log("Evening cloud 1 element added to layer");

      // アニメーション開始
      setTimeout(() => {
        cloud1Element.classList.add("active");
        isCloud1Running = true;
        console.log("Evening cloud 1 animation started!");
      }, 100);

      // アニメーション終了後にクリーンアップ
      setTimeout(() => {
        if (cloud1Element) {
          cloud1Element.remove();
          cloud1Element = null;
        }
        isCloud1Running = false;
        console.log("Evening cloud 1 animation completed");
      }, 61000); // 60秒のアニメーション + 1秒の余裕
    }

    function spawnEveningCloud2() {
      // 夕方のテーマのときのみ表示
      const isEvening = document.body.classList.contains("theme-evening");
      
      console.log("Attempting to spawn evening cloud 2...");
      console.log("Theme check - isEvening:", isEvening);
      
      if (!isEvening) {
        console.log("Not spawning cloud 2: not evening theme");
        return;
      }
      
      if (isCloud2Running) {
        console.log("Not spawning cloud 2: already running");
        return;
      }

      // 既存の雲があれば削除
      if (cloud2Element) {
        cloud2Element.remove();
      }

      console.log("Creating evening cloud 2 element...");
      // 新しい雲を作成
      cloud2Element = document.createElement("div");
      cloud2Element.className = "evening-cloud-2";
      layer.appendChild(cloud2Element);
      console.log("Evening cloud 2 element added to layer");

      // アニメーション開始
      setTimeout(() => {
        cloud2Element.classList.add("active");
        isCloud2Running = true;
        console.log("Evening cloud 2 animation started!");
      }, 100);

      // アニメーション終了後にクリーンアップ
      setTimeout(() => {
        if (cloud2Element) {
          cloud2Element.remove();
          cloud2Element = null;
        }
        isCloud2Running = false;
        console.log("Evening cloud 2 animation completed");
      }, 61000); // 60秒のアニメーション + 1秒の余裕
    }

    function scheduleNextCloud1() {
      // 雲1は20秒後に再度スタート（時差を作るため）
      const nextDelay = 20000;
      console.log(`Next evening cloud 1 scheduled in ${nextDelay/1000} seconds`);
      setTimeout(() => {
        spawnEveningCloud1();
        scheduleNextCloud1();
      }, nextDelay);
    }

    function scheduleNextCloud2() {
      // 雲2は40秒後に再度スタート（雲1と重ならないように）
      const nextDelay = 40000;
      console.log(`Next evening cloud 2 scheduled in ${nextDelay/1000} seconds`);
      setTimeout(() => {
        spawnEveningCloud2();
        scheduleNextCloud2();
      }, nextDelay);
    }

    // 最初の雲1は5秒後に開始
    console.log("First evening cloud 1 will spawn in 5 seconds");
    setTimeout(() => {
      spawnEveningCloud1();
      scheduleNextCloud1();
    }, 5000);

    // 最初の雲2は15秒後に開始（雲1より10秒遅らせる）
    console.log("First evening cloud 2 will spawn in 15 seconds");
    setTimeout(() => {
      spawnEveningCloud2();
      scheduleNextCloud2();
    }, 15000);
  }

  // ---- 🌆 夕方の雲イベント（画面上部と中央） ----
  function startEveningClouds() {
    const layer = document.getElementById("cloudLayer");
    if (!layer) {
      console.error("cloudLayer not found for evening clouds!");
      return;
    }
    
    console.log("Evening cloud system initialized");

    let cloud1Element = null;
    let cloud2Element = null;
    let isCloud1Running = false;
    let isCloud2Running = false;

    function spawnEveningCloud1() {
      // 夕方のテーマのときのみ表示
      const isEvening = document.body.classList.contains("theme-evening");
      
      console.log("Attempting to spawn evening cloud 1...");
      console.log("Theme check - isEvening:", isEvening);
      
      if (!isEvening) {
        console.log("Not spawning cloud 1: not evening theme");
        return;
      }
      
      if (isCloud1Running) {
        console.log("Not spawning cloud 1: already running");
        return;
      }

      // 既存の雲があれば削除
      if (cloud1Element) {
        cloud1Element.remove();
      }

      console.log("Creating evening cloud 1 element...");
      // 新しい雲を作成
      cloud1Element = document.createElement("div");
      cloud1Element.className = "evening-cloud-1";
      layer.appendChild(cloud1Element);
      console.log("Evening cloud 1 element added to layer");

      // アニメーション開始
      setTimeout(() => {
        cloud1Element.classList.add("active");
        isCloud1Running = true;
        console.log("Evening cloud 1 animation started!");
      }, 100);

      // アニメーション終了後にクリーンアップ
      setTimeout(() => {
        if (cloud1Element) {
          cloud1Element.remove();
          cloud1Element = null;
        }
        isCloud1Running = false;
        console.log("Evening cloud 1 animation completed");
      }, 61000); // 60秒のアニメーション + 1秒の余裕
    }

    function spawnEveningCloud2() {
      // 夕方のテーマのときのみ表示
      const isEvening = document.body.classList.contains("theme-evening");
      
      console.log("Attempting to spawn evening cloud 2...");
      console.log("Theme check - isEvening:", isEvening);
      
      if (!isEvening) {
        console.log("Not spawning cloud 2: not evening theme");
        return;
      }
      
      if (isCloud2Running) {
        console.log("Not spawning cloud 2: already running");
        return;
      }

      // 既存の雲があれば削除
      if (cloud2Element) {
        cloud2Element.remove();
      }

      console.log("Creating evening cloud 2 element...");
      // 新しい雲を作成
      cloud2Element = document.createElement("div");
      cloud2Element.className = "evening-cloud-2";
      layer.appendChild(cloud2Element);
      console.log("Evening cloud 2 element added to layer");

      // アニメーション開始
      setTimeout(() => {
        cloud2Element.classList.add("active");
        isCloud2Running = true;
        console.log("Evening cloud 2 animation started!");
      }, 100);

      // アニメーション終了後にクリーンアップ
      setTimeout(() => {
        if (cloud2Element) {
          cloud2Element.remove();
          cloud2Element = null;
        }
        isCloud2Running = false;
        console.log("Evening cloud 2 animation completed");
      }, 61000); // 60秒のアニメーション + 1秒の余裕
    }

    function scheduleNextCloud1() {
      // 雲1は20秒後に再度スタート（時差を作るため）
      const nextDelay = 20000;
      console.log(`Next evening cloud 1 scheduled in ${nextDelay/1000} seconds`);
      setTimeout(() => {
        spawnEveningCloud1();
        scheduleNextCloud1();
      }, nextDelay);
    }

    function scheduleNextCloud2() {
      // 雲2は40秒後に再度スタート（雲1と重ならないように）
      const nextDelay = 40000;
      console.log(`Next evening cloud 2 scheduled in ${nextDelay/1000} seconds`);
      setTimeout(() => {
        spawnEveningCloud2();
        scheduleNextCloud2();
      }, nextDelay);
    }

    // 最初の雲1は5秒後に開始
    console.log("First evening cloud 1 will spawn in 5 seconds");
    setTimeout(() => {
      spawnEveningCloud1();
      scheduleNextCloud1();
    }, 5000);

    // 最初の雲2は15秒後に開始（雲1より10秒遅らせる）
    console.log("First evening cloud 2 will spawn in 15 seconds");
    setTimeout(() => {
      spawnEveningCloud2();
      scheduleNextCloud2();
    }, 15000);
  }

  // ---- 初期化 ----

  // 🔥 コンテンツ（カード）を最前面に出すための強制設定
  if (appShell) {
    appShell.style.position = "relative";
    appShell.style.zIndex = "10";
  }

  setupPills();
  setupEnergySlider();
  renderEntries();
  updateExportState();
  updateNowTime();
  applyThemeByTime();

  initClouds();          // ☁️ 雲を開始
  startShootingStars();  // 🌠 流れ星を開始
  startTwinklingStars(); // ✨ 点滅する星を開始
  startEventCloud();     // ☁️⚡ 入道雲イベントを開始
  startEveningClouds();  // 🌆 夕方の雲を開始

  setInterval(updateNowTime, 30000);
  setInterval(applyThemeByTime, 5 * 60 * 1000);

  entryForm.addEventListener("submit", handleSubmit);
  if (exportButton) exportButton.addEventListener("click", handleExport);
  if (clearButton) clearButton.addEventListener("click", handleClear);

})();
