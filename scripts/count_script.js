function getCount(processTypeId, tDate){
    // 定数
    FIRST_DAY = "01"; // 月初めの日付として使用

    // 使用するSpreadsheetのIDを入力
    var KSS_ID = "[INSERT YOUR SPREADSHEET ID]";
    
    // 集計データを送るアドレスを下記に入力(複数のアドレスに送ることが可能 - その際は下記のSEND_MAIL_ADDRESSのコメントを外して、" "内にメールアドレスを入力すること)
    var SEND_MAIL_ADDRESS = "[INSERT YOUR MAIL ADDRESS]";
    // var SEND_MAIL_ADDRESS_02 = "[INSERT YOUR MAIL ADDRESS_02]";
    
    var message;
    
    // data
    var kDate;
    var kYear; // 対象年とマッチさせるため
    var kMonth;// 対象月とマッチさせるため
    var kItem;
    var kPay = 0;
    var kPayer;
    
    
    // 各項目事の値段
    var foodCharges = 0; // 食費
    var groceriesCharges = 0; // 日用品
    var householdCharges = 0; // 家財道具
    var waterCharges = 0; // 水道代
    var gasCharges = 0; // ガス料金
    var electricityCharges = 0; // 電気料金
    var houseRent = 0; // 家賃
    var gasolineCharges = 0; // 車のガソリン料金
    var otherCharges = 0; // その他の出費
    
    // 支払者（支払者を２人にする場合は、Payment_02の行のコメントを外すこと。また、それ以上の人数の支払者を設定する場合は、下記の連番を増やしていくこと）
    var Payment = 0;
    // var Payment_02 = 0;
    
    // 支払者の名前（支払者を２人にする場合は、Payment_02_nameの行のコメントを外すこと。また、それ以上の人数の支払者を設定する場合は、下記の連番を増やしていくこと）
    var Payment_name = "[INSERT YOUR NAME(Synchronize name with address and payment)]"
    // var Payment_02_name = "[INSERT YOUR NAME(Synchronize name with address and payment)]"
    
    // コピー元のセル
    var kSpreadsheet = SpreadsheetApp.openById(KSS_ID);
    var kSheet = kSpreadsheet.getSheets()[0];
    var kData = kSheet.getDataRange().getValues();
    
    // 対象月を取得
    var targetDate,
        targetYear,
        targetMonth;
    if(typeof processTypeId === "undefined") {
        // 現在月の集計データ取得パターン
        targetDate  = new Date(kSheet.getRange("F3").getValues());
        targetYear  = targetDate.getFullYear();
        targetMonth = targetDate.getMonth() + 1; // 対象月は"1"を足している(1月分低い数値が取れるため)
    } else if (processTypeId == 1) {
        // データ集計後に翌月の値に更新
        targetDate  = new Date(kSheet.getRange("F3").getValues());
        targetYear  = targetDate.getFullYear();
        targetMonth = targetDate.getMonth() + 1; // 対象月は"1"を足している(1月分低い数値が取れるため)
        
        //  翌月の値に更新
        //  現在月が12月の場合は、来年の１月に設定する
        if(targetMonth === 12) {
            targetDate.setFullYear(targetDate.getFullYear() + 1);
            targetDate.setMonth(0);
        }
        kSheet.getRange("F3").setValue(targetDate);
        
        // 項目【対象シート】も更新
        kSheet.getRange("F3").setValue(targetDate.getFullYear() + "/" + ("00" + (targetDate.getMonth() + 2)).slice(-2) + "/" + FIRST_DAY);
        // 文字列で挿入する場合は、月への変換処理で１低い値で計算されることを想定して、2を足す
        kSheet.getRange("G3").setValue(targetDate.getFullYear() + ("00" + (targetDate.getMonth() + 2)).slice(-2));
    } else if (processTypeId == 2 &&
               typeof tDate !== "undefined"){
        // 指定月のデータを取得
        targetDate = new Date(tDate);
        targetYear  = targetDate.getFullYear();
        targetMonth = targetDate.getMonth();
    } else {
        // エラーパターンのため、何もせずに終了
        Logger.log("エラーが発生しました。処理を行わずに終了します");
        return;
    }
    
    // コピー先のセルを取得
    if(kSpreadsheet.getSheetByName(kSheet.getRange("G3").getValues()) === null) {
        Logger.log("コピー先のセルが存在しません : " + kSheet.getRange("G3").getValues());
        return;
    }
    var kSpreadsheet_copyTo = kSpreadsheet.getSheetByName(kSheet.getRange("G3").getValues());

    // 集計ループ
    for(var i = 1; i < kData.length; i++){
        // 集計データから日付のみを取得、年と月に振り分ける
        kDate = kData[i][0];
        kYear = kDate.getFullYear();
        kMonth = kDate.getMonth() + 1;
        
        // 対象の年月とマッチしている項目のみを集計する
        if(targetYear == kYear){
            if(targetMonth == kMonth){
                
                kItem = kData[i][1];
                
                switch(kItem){
                    case "食料品":
                        foodCharges += parseInt(kData[i][2]);
                        break;
                        
                    case "日用品":
                        groceriesCharges += parseInt(kData[i][2]);
                        break;
                        
                    case "家財道具":
                        householdCharges += parseInt(kData[i][2]);
                        break;
                        
                    case "水道代":
                        waterCharges += parseInt(kData[i][2]);
                        break;
                        
                    case "ガス代":
                        gasCharges += parseInt(kData[i][2]);
                        break;
                        
                    case "電気代":
                        electricityCharges += parseInt(kData[i][2]);
                        break;
                        
                    case "家賃":
                        houseRent += parseInt(kData[i][2]);
                        break;
                        
                    case "ガソリン代":
                        gasolineCharges += parseInt(kData[i][2]);
                        break;
                        
                    default:
                        otherCharges += parseInt(kData[i][2]);
                        break;
                }
                
                kPayer = kData[i][3];
                
                // Googleフォーム上での指定した支払者の名前
                switch(kPayer){
                    case "[INSERT YOUR NAME(Synchronize name with Google form name)]":
                        Payment += parseInt(kData[i][2]);
                        break;
                        
                        // 支払者を２人にする場合は、このコメントを外し、使用すること。また、それ以上の人数の支払者を設定する場合は、case文を拡張していくこと
                        // case "[INSERT YOUR NAME_02(Synchronize name with Google form name)]":
                        //    Payment_02 += parseInt(kData[i][2]);
                        //    break;
                }
                
                kPay += parseInt(kData[i][2]);
            }
        }
    }
    
    // 合計額を対象シートに代入
    kSpreadsheet_copyTo.getRange("B3").setValue(kPay);
    
    // 食料品
    kSpreadsheet_copyTo.getRange("E2").setValue(foodCharges);
    
    // 日用品
    kSpreadsheet_copyTo.getRange("E3").setValue(groceriesCharges);
    
    // 家財道具
    kSpreadsheet_copyTo.getRange("E4").setValue(householdCharges);
    
    // 水道代
    kSpreadsheet_copyTo.getRange("E5").setValue(waterCharges);
    
    // ガス代
    kSpreadsheet_copyTo.getRange("E6").setValue(gasCharges);
    
    // 電気代
    kSpreadsheet_copyTo.getRange("E7").setValue(electricityCharges);
    
    // 家賃
    kSpreadsheet_copyTo.getRange("E8").setValue(houseRent);
    
    // ガソリン代
    kSpreadsheet_copyTo.getRange("E9").setValue(gasolineCharges);
    
    // その他
    kSpreadsheet_copyTo.getRange("E10").setValue(otherCharges);
    
    // Payment
    kSpreadsheet_copyTo.getRange("B7").setValue(Payment);
    
    // Payment_02（支払者を２人にする場合は、下記の行のコメントを外すこと。また、それ以上の人数の支払者を設定する場合は、下記の行を増やしてコードを変更すること）
    // kSpreadsheet_copyTo.getRange("B8").setValue(Payment_02);
    
    // メール内容
    message = kSheet.getRange("G3").getValues() + " : 家計簿レポート";
    var subject = message;
    var kakeiMsg;
    
    // 家計簿Spreadsheet内の予算よりも使用額が多ければ、赤字と判定する。
    if(kSpreadsheet_copyTo.getRange("B4").getValues() < 0){
        kakeiMsg = "今月は赤字です。 ¥" + kSpreadsheet_copyTo.getRange("B4").getValues() + "の赤字が発生しています。";

        // 支払者を２人にする場合は、下記の行のコメントを外すこと。また、それ以上の人数で使用する場合は、コード末尾の方にある数字を人数分に変更すること
        // kakeiMsg = kakeiMsg + kSpreadsheet_copyTo.getRange("B6").setValue(Math.floor(kSpreadsheet_copyTo.getRange("B4").getValues() / 2));
    }else{
        kakeiMsg = "今月は黒字です。";
    }

    message = "<h3>///////////" + kSheet.getRange("G3").getValues() + " : 支払レポート///////////</h3>";
    message = message + "<p>今月の予算は¥<strong>" + kSpreadsheet_copyTo.getRange("B2").getValues() + "</strong></p>";
    message = message + "<p>今月の支払い合計額は¥<strong>" + kSpreadsheet_copyTo.getRange("B3").getValues() + "</strong></p>";
    message = message + "<p>今月の支払い状況は¥<strong>" + kSpreadsheet_copyTo.getRange("B4").getValues() + "</strong></p>";
    message = message + "<p>" + kakeiMsg + "</p><br/>";
    message = message + "<h3>///////////それぞれの支払状況について///////////</h3>";
    message = message + "<p>"+ Payment_name + "の支払い合計額は¥<strong>" + kSpreadsheet_copyTo.getRange("B7").getValues() + "</strong></p>";
    
    // 支払者を２人にする場合は、このコメントを外し、使用すること。また、それ以上の人数の支払者を設定する場合は、下記のソースを元に拡張していくこと
    // message = message + "<p>"+ Payment_02_name + "の支払い合計額は¥<strong>" + kSpreadsheet_copyTo.getRange("B8").getValues() + "</strong></p><br />";
    
    message = message + "<h3>///////////種別ごとの支払額について///////////</h3>";
    message = message + "<p>食料品の支払い合計額は¥<strong>" + kSpreadsheet_copyTo.getRange("E2").getValues() + "</strong></p>";
    message = message + "<p>日用品の支払い合計額は¥<strong>" + kSpreadsheet_copyTo.getRange("E3").getValues() + "</strong></p>";
    message = message + "<p>家財道具の支払い合計額は¥<strong>" + kSpreadsheet_copyTo.getRange("E4").getValues() + "</strong></p>";
    message = message + "<p>今月の水道代は¥<strong>" + kSpreadsheet_copyTo.getRange("E5").getValues() + "</strong></p>";
    message = message + "<p>今月のガス代は¥<strong>" + kSpreadsheet_copyTo.getRange("E6").getValues() + "</strong></p>";
    message = message + "<p>今月の電気代は¥<strong>" + kSpreadsheet_copyTo.getRange("E7").getValues() + "</strong></p>";
    message = message + "<p>今月の家賃は¥<strong>" + kSpreadsheet_copyTo.getRange("E8").getValues() + "</strong></p>";
    message = message + "<p>今月のガソリン代は¥<strong>" + kSpreadsheet_copyTo.getRange("E9").getValues() + "</strong></p>";
    message = message + "<p>その他、支払われた合計額について¥<strong>" + kSpreadsheet_copyTo.getRange("E10").getValues() + "</strong></p>";

    // 結果をメール送信
    MailApp.sendEmail(SEND_MAIL_ADDRESS, subject, "", {htmlBody: message});
    
    // 支払者を２人にする場合は、このコメントを外し、使用すること。また、それ以上の人数の支払者を設定する場合は、下記のソースを元に拡張していくこと
    // MailApp.sendEmail(SEND_MAIL_ADDRESS_02, subject, "", {htmlBody: message});
}

// 現在月の集計データを取得(対象月の更新は行わない)
function getCurrentMonthCount(){
    getCount();
}
// 現在月の集計データを取得
function countScript() {
    getCount(1)
}
