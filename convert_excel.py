import pandas as pd
import json

def convert_excel_to_csv():
    # Excelファイルを読み込み
    df = pd.read_excel('Seed_AI_FAQ_public_FINAL_updated.xlsx')
    
    # データフレームの構造を確認
    print("Columns:", df.columns.tolist())
    print("Shape:", df.shape)
    print("\nFirst few rows:")
    print(df.head())
    
    # CSVとして保存
    df.to_csv('Seed_AI_FAQ_public_FINAL_updated.csv', index=False, encoding='utf-8')
    
    # JavaScriptで使用するためのJSONファイルも作成
    faq_data = []
    
    for _, row in df.iterrows():
        faq_item = {}
        for col in df.columns:
            faq_item[col] = str(row[col]) if pd.notna(row[col]) else ""
        faq_data.append(faq_item)
    
    # JSONファイルとして保存
    with open('faq_data.json', 'w', encoding='utf-8') as f:
        json.dump(faq_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nConverted {len(faq_data)} FAQ items")
    return faq_data

if __name__ == "__main__":
    faq_data = convert_excel_to_csv()