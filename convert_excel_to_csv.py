#!/usr/bin/env python3
import pandas as pd
import sys

def convert_excel_to_csv(excel_file, csv_file):
    try:
        # Excelファイルを読み込み
        df = pd.read_excel(excel_file, sheet_name=0)  # 最初のシートを読み込み
        
        # データの基本情報を表示
        print(f"データの形状: {df.shape}")
        print(f"列名: {list(df.columns)}")
        print(f"最初の3行:")
        print(df.head(3).to_string())
        print("\n" + "="*50 + "\n")
        
        # CSVに保存
        df.to_csv(csv_file, index=False, encoding='utf-8')
        print(f"✅ Excel to CSV conversion completed: {csv_file}")
        
        # カテゴリの統計情報
        if '#カテゴリー' in df.columns:
            categories = df['#カテゴリー'].value_counts()
            print(f"\n📊 カテゴリー統計:")
            for category, count in categories.items():
                print(f"  - {category}: {count}項目")
        
        # レベルの統計情報
        if '#レベル' in df.columns:
            levels = df['#レベル'].value_counts()
            print(f"\n📈 レベル統計:")
            for level, count in levels.items():
                print(f"  - {level}: {count}項目")
                
        return True
        
    except Exception as e:
        print(f"❌ Error converting Excel to CSV: {e}")
        return False

if __name__ == "__main__":
    excel_file = "Seed_AI_FAQ_public_FINAL.xlsx"
    csv_file = "Seed_AI_FAQ_public_FINAL.csv"
    
    success = convert_excel_to_csv(excel_file, csv_file)
    if not success:
        sys.exit(1)