// Spreadsheet内にメニューを表示
function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var menuEntries = [
                       {name: "Export CSV", functionName: "exportSheetCsv"}
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