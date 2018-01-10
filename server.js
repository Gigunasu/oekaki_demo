// モジュール読み込み
var http = require( "http" );
var socketio = require( "socket.io" );
var fs = require( "fs" );

// ユーザーリスト
var users = {};

// httpサーバーの作成
// アクセスがあったときのイベント
var server = http.createServer( function( req, res ){
    // レスポンスにヘッダ情報を設定
    res.writeHead( 200, {"Content-Type":"text/html"});
    // index.htmlを読み込み
    var output = fs.readFileSync( "./index.html", "utf-8" );
    // レスポンスに設定して終了
    res.end( output );
} );

// サーバを立ち上げ
server.listen( 8080 );
// socket.io立ち上げ
var io = socketio.listen( server );

// socket.ioにクライアントが接続されたときのイベントを記述します
io.sockets.on( "connection", function( socket ){
    console.log( "=============================" );
    // サーバーのログに接続を表示
    console.log( "connection!:" + socket.id );
    // リストに追加
    users[socket.id] = socket;
    // ユーザー一覧の表示
    displog_user();

    // 描画イベント
    socket.on( "draw", function( data ){
        // すべてのクライアントに描画情報を送信
        socket.broadcast.emit( "draw", data );
    } );

    // カーソルの移動イベント
    socket.on( "cursor", function( data ){
        // すべてのクライアントに移動情報を送信
        socket.broadcast.emit( "cursor", data );
    } );

    // クライアントとの接続が切断された場合のイベント
    socket.on( "disconnect", function(){
        console.log( "=============================" );
        // ログに表示
        console.log( "disconnect...:" + socket.id );
        // クライアントリストから削除
        if( users[socket.id] ) delete users[socket.id];
        // ユーザー一覧の表示
        displog_user();
    } );

} );

// ユーザ一覧をログに表示します
function displog_user(){
    // 接続一覧表示
    console.log( "接続一覧" );
    for( var key in users ){
        console.log( users[key].id );
    }
}