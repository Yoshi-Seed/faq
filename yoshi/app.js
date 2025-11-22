// app.js
(() => {
  const STORAGE_KEY = "wayne_yoshi_memo_v1";

  // ✅ Google Sheets WebApp URL（ここだけ自分のに）
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
      meta.textContent = `${entry.displayTime} · ${entry.category}${moodPart}`;

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
        try {
      await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(entry)
      });
    } catch (e) {
      console.warn("Sheets送信に失敗（ローカル保存はOK）:", e);
    }

    celebrate();                 // ← これ追加
    showWayneMessage({ mood });


    const category = categoryHidden.value;
    const mood = moodHidden.value;
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

    // ✅ Google Sheetsへ送信（ここが正しい場所）
    try {
      await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(entry)
      });
    } catch (e) {
      console.warn("Sheets送信に失敗（ローカル保存はOK）:", e);
    }

    showWayneMessage({ mood });
  }

  // ---- エクスポート ----

  function makeExportContent(list) {
    const header = "iso_timestamp\t日時\tカテゴリ\t気分\tメモ";
    const lines = list.map((e) => {
      const memo = (e.memo || "")
        .replace(/\t/g, " ")
        .replace(/\r?\n/g, "\\n");
      const mood = e.mood || "";
      return `${e.timestamp}\t${e.displayTime}\t${e.category}\t${mood}\t${memo}`;
    });
    return [header, ...lines].join("\n");
  }

  function handleExport() {
    if (!entries.length) {
      showWayneMessage();
      return;
    }

    const content = makeExportContent(entries);
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

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
    const count = 14; // ほどよい量

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

      // 🫧 バブルタップで魔法発動
  if (bubble) {
    bubble.addEventListener("click", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      bubbleMagic(x, y);
    });
  }
    
    // 既存のリップル
    for (let i = 0; i < 3; i++) {
      const r = document.createElement("div");
      r.className = "ripple";
      r.style.left = `${x}px`;
      r.style.top = `${y}px`;
      r.style.animationDelay = `${i * 120}ms`;
      rippleLayer.appendChild(r);
      r.addEventListener("animationend", () => r.remove());
    }

    // 🌊 画面全体をブォーンと波うたせる
    if (appShell) {
      appShell.classList.remove("wave-animate");
      // 連打でも毎回発火するようにリセット
      void appShell.offsetWidth;
      appShell.classList.add("wave-animate");
      appShell.addEventListener("animationend", () => {
        appShell.classList.remove("wave-animate");
      }, { once: true });
    }
  }

 
  // ---- 初期化 ----

  setupPills();
  renderEntries();
  updateExportState();
  updateNowTime();
  applyThemeByTime();

  setInterval(updateNowTime, 30000);
  setInterval(applyThemeByTime, 5 * 60 * 1000); // 5分ごとに雰囲気チェック


  entryForm.addEventListener("submit", handleSubmit);
  if (exportButton) exportButton.addEventListener("click", handleExport);
  if (clearButton) clearButton.addEventListener("click", handleClear);
})();
