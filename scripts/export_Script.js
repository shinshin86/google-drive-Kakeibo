// Spreadsheet内にメニューを表示
function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [
                       {name: "Export CSV", functionName: "exportSheetCsv"},
                       {name: "Export JSON", functionName: "exportSheetJson"}
                       ];
    ss.addMenu("Export Menu", menuEntries);
}

// Export CSV
function exportSheetCsv(e) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var cellsData = sheet.getDataRange().getValues();
    
    var csvData = "";
    
    
    for(var i = 0; i < cellsData.length; i++){
        for(var j = 0; j < 4; j++){
            csvData += cellsData[i][j];
            csvData += ","
        }
        csvData += "\n";
    }
    
    // 時間取得
    var objDate=new Date();
    var Year = objDate.getFullYear();
    var Month = objDate.getMonth()+1;
    var Week = objDate.getDay();
    var Day = objDate.getDate();
    var Hour = objDate.getHours();
    var Minute = objDate.getMinutes();
    var Second = objDate.getSeconds();
    
    
    // "google-drive-kakeibo"フォルダ内にCSVファイルを生成
    // もし別のフォルダ名にしている場合は対象フォルダ名に書き換えること
    var folders = DriveApp.getFolders();
    while (folders.hasNext()) {
        var folder = folders.next();
        if(folder.getName() === "google-drive-kakeibo"){
            var file = folder.createFile("PaymentList_CSV_"+Year+Month+Day+"_"+Hour+Minute+Second+ ".csv", csvData);
        }
    }
}

// Export JSON
function exportSheetJson(e) {
    
    // 対象シート取得
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = book.getSheetByName("PaymentList_form");
    
    
    // タイトルが格納されているセル - 1行目に格納されているものとする
    var firstRange = sheet.getRange(1, 1, 1, 4);
    
    // タイトル取得
    var firstRowValues = firstRange.getValues();
    var titleColumns = firstRowValues[0];
    
    // 値の読み取りを開始するセルを選択 - 2行目から値が入っているものとしている
    var valuesRowIndex = 2;
    
    // 値取得処理
    var lastRow = sheet.getLastRow();
    var rowValues = [];
    for(var rowIndex=valuesRowIndex; rowIndex<=lastRow; rowIndex++) {
        var rowNum = 1;
        
        // 取得するのはタイムスタンプから支払金額まで
        var range = sheet.getRange(rowIndex, 1, 1, 4);
        var values = range.getValues();
        rowValues.push(values[0]);
    }
    
    // create json
    var jsonArray = [];
    for(var i=0; i<rowValues.length; i++) {
        var line = rowValues[i];
        var json = new Object();
        for(var j=0; j<titleColumns.length; j++) {
            json[titleColumns[j]] = line[j];
        }
        jsonArray.push(json);
    }
    // json格納
    var json = jsonArray;
    
    // 時間取得
    var objDate=new Date();
    var Year = objDate.getFullYear();
    var Month = objDate.getMonth()+1;
    var Week = objDate.getDay();
    var Day = objDate.getDate();
    var Hour = objDate.getHours();
    var Minute = objDate.getMinutes();
    var Second = objDate.getSeconds();
    
    
    // "google-drive-kakeibo"フォルダ内にjsonファイルを生成
    // もし別のフォルダ名にしている場合は対象フォルダ名に書き換えること
    var folders = DriveApp.getFolders();
    while (folders.hasNext()) {
        var folder = folders.next();
        if(folder.getName() === "google-drive-kakeibo"){
            var file = folder.createFile("PaymentList_JSON_"+Year+Month+Day+"_"+Hour+Minute+Second+ ".json", JSON.stringify(json));
        }
    }
}
