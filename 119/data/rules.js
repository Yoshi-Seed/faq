window.EMS_RULES = {
  "version": "2025-11-12",
  "rules": [
    {
      "id": "nitrates_pde5",
      "planned_any_of": [
        "nitroglycerin"
      ],
      "patient_classes_any_of": [
        "PDE5"
      ],
      "severity": "red",
      "title": "PDE‑5内服中のニトログリセリンは禁忌",
      "message": "シルデナ/バルデナは24h、タダラフィルは48hの併用回避（著明な低血圧）。",
      "refs": [
        {
          "label": "ACC/AHA：PDE‑5×硝酸薬 24–48h回避",
          "url": "https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2015/12/02/15/24/treating-erectile-dysfunction-in-patients-with-cvd"
        }
      ]
    },
    {
      "id": "epi_beta_blocker",
      "planned_any_of": [
        "epinephrine"
      ],
      "patient_classes_any_of": [
        "BetaBlocker",
        "BetaBlockerNonSelective"
      ],
      "severity": "orange",
      "title": "β遮断薬内服：アドレナリン反応低下",
      "message": "非選択的β遮断で反応低下・血圧変動あり。反応不十分ならグルカゴンを検討。",
      "refs": [
        {
          "label": "AAAAI：β遮断/アナフィラキシーとグルカゴン",
          "url": "https://www.aaaai.org/Allergist-Resources/Ask-the-Expert/Answers/Old-Ask-the-Experts/beta-blockers-anaphylaxis"
        }
      ]
    },
    {
      "id": "epi_antipsychotic_alpha_blocker",
      "planned_any_of": [
        "epinephrine"
      ],
      "patient_classes_any_of": [
        "Antipsychotic"
      ],
      "severity": "orange",
      "title": "抗精神病薬内服：アドレナリンで血圧変動リスク",
      "message": "一部薬剤で“エピネフリン反転”の記載。添付文書の併用禁忌/注意に留意し医師指示を仰ぐ。",
      "refs": [
        {
          "label": "PMDA：各製品 添付文書（相互作用）",
          "url": "https://www.pmda.go.jp/PmdaSearch/"
        }
      ]
    },
    {
      "id": "aspirin_bleeding_stack",
      "planned_any_of": [
        "aspirin_admin"
      ],
      "patient_classes_any_of": [
        "Anticoagulant",
        "Antiplatelet",
        "DOAC",
        "Bleeding"
      ],
      "severity": "orange",
      "title": "出血リスク増：抗凝固/抗血小板＋アスピリン",
      "message": "併用で出血増。必要性を再確認し観察強化、IMは回避/圧迫など対策。",
      "refs": [
        {
          "label": "SPS：抗凝固中のIM投与（回避/圧迫）",
          "url": "https://www.sps.nhs.uk/articles/using-intramuscular-injections-in-people-on-oral-anticoagulants/"
        }
      ]
    },
    {
      "id": "salbutamol_beta_blocker",
      "planned_any_of": [
        "salbutamol_admin"
      ],
      "patient_classes_any_of": [
        "BetaBlocker",
        "BetaBlockerNonSelective"
      ],
      "severity": "yellow",
      "title": "β遮断薬内服：気管支拡張反応が弱い可能性",
      "message": "反応が乏しい/逆に悪化する場合あり。早めに追加指示（Mgなど）を相談。",
      "refs": [
        {
          "label": "臨床レビュー（β遮断下のβ2反応性）",
          "url": "https://www.aliem.com/clinical-pearl-beta-blockers-and-epinephrine/"
        }
      ]
    },
    {
      "id": "salbutamol_diuretic_hypokalemia",
      "planned_any_of": [
        "salbutamol_admin"
      ],
      "patient_classes_any_of": [
        "Diuretic"
      ],
      "severity": "yellow",
      "title": "利尿薬内服：低K→不整脈に注意",
      "message": "β2刺激薬＋ループ/サイアザイド系で低Kの相加。心電図/症状を観察。",
      "refs": [
        {
          "label": "薬理学的注意（低K）",
          "url": "https://crediblemeds.org/"
        }
      ]
    },
    {
      "id": "dextrose_su_recurrence",
      "planned_any_of": [
        "dextrose_iv"
      ],
      "patient_classes_any_of": [
        "Sulfonylurea",
        "Insulin"
      ],
      "severity": "yellow",
      "title": "低血糖の再燃に注意（SU/インスリン）",
      "message": "ブドウ糖で一時改善しても再低下あり得る。再評価タイミングと共有を。",
      "refs": [
        {
          "label": "EMレビュー（SU性低血糖の遷延）",
          "url": "https://www.emra.org/emresident/article/sulfonylurea"
        }
      ]
    }
  ]
};