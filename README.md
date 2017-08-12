# google-drive-Kakeibo
##### "google-drive-Kakeibo" for household accounts on Google Drive. it is a simple app.
* Version 1.1
* Japanese only so far

# Change Log

Export機能を追加(JSON,CSV対応)


# 概要  

##### google-drive-KakeiboはGoogleドライブ上で家計簿をつける、シンプルなアプリです。  
専用の送信フォームから支払った金額と項目を入力して"送信"ボタンを押せば、  
Googleドライブ上のスプレッドシートにそれらのリストが記述されていきます。  
スプレッドシート内に記述された支払金額と項目は、月末になると自動的に集計処理され、  
登録したメールアドレスに自動的に送信されます。  

##### この家計簿アプリであなたがするべきことは、２つだけです。
* 支払者と項目、そして支払金額を専用フォームに入力して送信すること。
* そして、その月の集計データをメールで受け取ること、




# 条件  

* Googleアカウントを持っていること

# 動作環境  

* Googleドライブ上にて使用

# 機能

* 家計簿専用のWeb送信フォーム
* 月末の自動集計機能
* 集計データのメール通知

# ダウンロード

* "google-dirve-Kakeibo"のソースはGitHub上からダウンロードできます。  
[google-drive-Kakeibo(GitHub)](https://github.com/shinshin86/google-drive-Kakeibo)


# 導入方法

下記は"google-drive-Kakeibo"をセットアップ・スタートさせるための設定方法を記載したものです。  
これらの手順を踏み、セットアップ・設定を完了させれば、後はバックグラウンドでスクリプトが自動的に処理を行います。


あなたのすることは支払金額をフォームから送信し、月末の集計結果を指定のアドレスに受け取るのみ。
それ以外にあなたの手を煩わせることはありません。

※ただし、この家計簿アプリをカスタマイズして使用する人は除きます。

(セットアップ時間の目安は15分です。)

##### ---導入手順---
0.あなたのGoogleドライブを開き、画面上から「新規」ボタン押下→「フォルダ」という順に操作を行い、"google-drive-kakeibo"という名前でフォルダを作成してください。

1.新規作成したフォルダ内で、画面上から「新規」ボタン押下→「Google スプレッドシート」を選択し、"家計簿スプレッドシート"というスプレッドシートファイルを作成します。

2.次に送信フォームを準備します。

下記の画像と送信フォーム作成手順を参考に、同様の送信フォームを作成してください。

![送信フォーム - 画像](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/images/Kakeibo_form_sample.png)


	フォームの作成手順は下記の通り:
	
	1."google-drive-kakeibo"フォルダ内で「新規」ボタンを押下→「その他」→「googleフォーム」を選択し、"支出送信フォーム"を作成します。
	
	2.上記リンクを参考に入力フォームを作成。

	※金額の入力項目作成時には、項目内にある詳細ボタンから、数値のみ入力可能なように設定してください。

3.フォームを作成した終えたら、フォーム画面上部に付いている「回答」ボタンを押下し、表示されたメニューから「回答先を変更…」を押下し、既存のスプレッドシートの新しいシート...の項目にチェックを付け、「選択」ボタンを押下します。

次にスプレッドシートの選択画面が出てくるので、先ほど作成した"家計簿スプレッドシート"を選択。

すると、"家計簿スプレッドシート"に新たなシートが追加されているので、そちらのシートに下記の画像と同様の項目を追加してください。


※実装上の都合により、セルのF3〜G4にかけてある対象月・対象シートの欄は必ず適切な値を入力してください。間違えた値を入力した場合、スクリプトエラーが発生します。この部分については、後に改修する予定です。

	例：2015年9月の場合、対象月⇒2015/09/01,対象シート⇒201509

![Form送信結果_スプレッドシート](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/images/Kakeibo_Spreedsheet_sample.png)


これで送信フォームの準備は以上です。

4.次に"家計簿スプレッドシート"内にあるsheet1の名前を、家計簿をつける月の年月に変更します。フォーマットは下記のように入力してください。

	例：2015/09
	
5.下記の画像を参考にして、変更したスプレッドシートファイルに表を作成します。 

![スプレッドシート](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/images/Spreedsheet_01_sample.png)

※なお、ひと月の集計ごとに一枚のシートを使用していくので、利用する月数分のシートは今のうちから作成しておいたほうが便利かもしれません。上で作成したスプレッドシートをいくつもコピーし、シート名を変更しておいてください。


6.続いて、新規作成したフォルダ内で、画面上から「新規」ボタン押下→「その他」→「Google Apps スクリプト」を選択し、"CountScript"というスクリプトファイルを作成します。

7."CountScript"ファイルを開き、[ここからgoogle-drive-Kakeiboのスクリプトソース](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/scripts/count_script.js)をコピー&ペーストしてください。 
	
	あなたの使用する環境に合わせて、いくつかソースを書き換える必要があります。
		
		1.[INSERT YOUR SPREDSHEET ID]という箇所には、あなたの作成した"家計簿スプレッドシート"のIDを入力してください。
		※SpreadsheetのIDは"https://docs.google.com/spreadsheet/d/[ここがSpreadsheetのIDになります]#gid=ID番号"
		
		2.[INSERT YOUR MAIL ADRRES]には集計した家計簿のデータを送信するための宛先を入力してください。
		
		3.[INSERT YOUR NAME(Synchronize name with address and payment)]"には家計簿を使用する方の名前を入力してください。
		
		※この家計簿アプリは複数人で使用することも想定されています。もしあなたがご家族でこの家計簿アプリを使用するならば、人数分の名前と使用するアドレスをソース内に入力すれば、そのまま共有して使用することが出来ます。
    
 
8.月末集計機能のためのトリガーを有効にします。

CountScriptファイルを開き、画面上部の時計のアイコンを押下します。現在のプロジェクトのトリガーという画面が表示されるので、「新しいトリガーを追加」というボタンを押下し、表示されるプルダウンリストを下記のように指定します。

	* 実行：countScript
	* イベント：時間主導型、月タイマー、午前4時〜午前5時、1
	
以上のように設定することにより、その月の一日目の午前４時〜午前５時の間に集計スクリプトが動き、あなたの前月の収支をまとめて、メールで送信します。

起きて、先月の出費に頭を痛める事のないように気をつけましょう。

これで導入手順については以上です。



# 使用方法

送信フォームのURLをあなたのスマートフォンやPCのブラウザに登録しておき、  
何かを支払った際に送信フォームにアクセスし、支払者と項目、それから金額を入力して"送信"ボタンを押下します。  

月末の深夜、正確には翌日の午前2時(良識ある人々は既に寝ているであろう時間帯)にその月の集計処理が行われ、翌日の朝に、登録したアドレスに集計結果が届きます。  

全ての集計結果を見たい場合は、セットアップの際に設定したスプレッドシートを見れば、
今までの集計の全内容を参照することが出来ます。



# Export機能

今までの支払い記録(PaymentList_form)をJSON、またはCSV形式でエクスポートできます。

1.導入手順については、"PaymentList_form"シートを開き、「ツール」⇒「スクリプトエディタ」を選択します<br>
(下の図を参照)

![スクリプトエディタを起動する](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/images/introduction_of_export_function_01.png)


2.スクリプトエディタ内にて、[ここからgoogle-drive-KakeiboのExport用のスクリプトソース](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/scripts/export_script.js)をコピー＆ペーストして保存します。

3."PaymentList_form"シート上を一度閉じてから再度開きます。すると、メニューバーに"Export Menu"が追加されているので、あとはそこから各Export機能を実行できます。
<br>(下の図を参照)

![スクリプトエディタを起動する](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/images/introduction_of_export_function_02.png)

4.Export機能を用いて実際にエクスポートした各ファイルは下記のとおりです。

[JSON_Exportファイル](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/Sample_of_Export_File_JSON/PaymentList_JSON_20151031_223554.json)

[CSV_Exportファイル](https://github.com/shinshin86/google-drive-Kakeibo/blob/master/Sample_of_Export_File_CSV/PaymentList_CSV_20151031_041.csv)


