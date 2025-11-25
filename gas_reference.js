// Google Apps Script - doPost function
// このコードをGoogle Apps Scriptエディタにコピーしてください

function doPost(e) {
  try {
    // リクエストデータをパース
    const data = JSON.parse(e.postData.contents);
    
    // デバッグログ
    Logger.log("=== Received Data ===");
    Logger.log("Full data: " + JSON.stringify(data));
    Logger.log("Energy: " + data.energy);
    Logger.log("Category: " + data.category);
    Logger.log("Mood: " + data.mood);
    
    // アクティブなスプレッドシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // データを追加（カラム順序を確認してください）
    sheet.appendRow([
      data.timestamp,      // A列: ISO timestamp
      data.displayTime,    // B列: 表示用日時
      data.category,       // C列: カテゴリ
      data.mood,          // D列: 気分
      data.energy,        // E列: エネルギー（余力）★ここが重要
      data.memo           // F列: メモ
    ]);
    
    Logger.log("✅ Data saved successfully");
    
    // CORS対応のレスポンスを返す
    const output = ContentService.createTextOutput(
      JSON.stringify({ 
        result: "success",
        received: {
          category: data.category,
          mood: data.mood,
          energy: data.energy
        }
      })
    );
    
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
    
  } catch (error) {
    Logger.log("❌ Error: " + error.toString());
    Logger.log("Error stack: " + error.stack);
    
    const errorOutput = ContentService.createTextOutput(
      JSON.stringify({ 
        result: "error", 
        message: error.toString() 
      })
    );
    
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    
    return errorOutput;
  }
}

// テスト用関数
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        id: "test_123",
        timestamp: "2025-11-25T08:55:38.717Z",
        displayTime: "2025/11/25 (火) 17:55",
        category: "体調",
        mood: "希望",
        energy: "低め",
        memo: "テスト"
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log("Test result: " + result.getContent());
}
