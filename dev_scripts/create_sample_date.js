function createSampleData(){
    
    // 使用するSpreadsheetのIDを入力
    var KSS_ID = "{SpreadsheetのID}";
    var kSpreadsheet = SpreadsheetApp.openById(KSS_ID);
    var kSheet = kSpreadsheet.getSheetByName("{データ挿入対象のシート名}"); // データ挿入対象のシート名を入力
    
    // サンプルデータ挿入先セル
    var kItem;
    
    // 項目
    var types = ["食費","日用品","家財道具","水道代","ガス料金","電気代","家賃","ガソリン代","その他項目"];
    
    // 項目からランダムで値を選択
    function getRandomTypes(){
        return types[ Math.floor( Math.random() * types.length ) ] ;
    }
    
    // 支払者
    var users = ["test_user"];
    // 支払い者が複数存在することを想定する場合、下記のように配列にユーザを追加する
    // var users = ["test_user01", "test_user02", "test_user03"]
    
    // 金額のランダムな値を取得
    function getRandomCharges(min,max){
        var value = ( Math.random() * ( ( max + 1 ) - min ) ) + min
        var result_value = Math.floor(value);
        return (result_value * 100);
    }
    
    // 2015/1/1〜2017/12/31までの、1000件のランダムなテストデータを作成する
    // 月が0から始まるため、月の指定は"実際の指定月 - 1"
    for(var i = 1; i < 1000; i++){
        kSheet.getRange(i,1).setValue(displayRandomDateString({y:2015, m:0, d:1}, {y:2017, m:11, d:31}));
        kSheet.getRange(i,2).setValue(getRandomTypes());
        kSheet.getRange(i,3).setValue(getRandomCharges(10, 100));
        kSheet.getRange(i,4).setValue(users[Math.floor(Math.random() * users.length)]);
    }
    
    /** ランダムな日付データを作成 **/
    // 下記の記事の実装を参照している(Reference this implementation.)
    // http://language-and-engineering.hatenablog.jp/entry/20110829/p1
    
    // ２つの年月日の間に存在する，ランダムな日付情報を返却する
    // 第一引数を開始日とし，第二引数は開始日よりも後の日付であること。
    function getRandomDate( date1, date2 )
    {
        // 引数を取り出し
        var y1 = date1.y;
        var m1 = date1.m;
        var d1 = date1.d;
        var y2 = date2.y;
        var m2 = date2.m;
        var d2 = date2.d;

        // うるう年などを考慮した，矛盾のない日付オブジェクトを生成
        var d1 = new Date( y1, m1, d1 );
        var d2 = new Date( y2, m2, d2 );

        // 差分をミリ秒で求める
        var diff_ms = d2 - d1;

        // 差分を0〜100％の割合でランダムに加工する
        var diff_ms_random = Math.random() * diff_ms;

        // 基準日時に対してランダムな差分を加算し，新たな日付オブジェクトとする
        var d_random = new Date();
        d_random.setTime( d1.getTime() + diff_ms_random );

        // ランダムな日付として返却する
        return d_random;
    }

    // Dateオブジェクトの年月日を、月と日に対して0埋めし、yyyymmdd 0:00:00という形式で返す
    function getDatetimefromDateObject( obj_d )
    {
        var y = obj_d.getFullYear();

        var m = obj_d.getMonth() + 1;
        if( m < 10 ) m = "0" + m;

        var d = obj_d.getDate();
        if( d < 10 ) d = "0" + d;

        return "" + y + "/" + m + "/" + d + " 0:00:00";
    }

    // ランダムな日付の情報を表示
    function displayRandomDateString(date1, date2)
    {
        // 対象期間の範囲内で，ランダムな日付を取得
        var random_date = getRandomDate(date1, date2);
        return getDatetimefromDateObject(random_date);
    }
}
