var pomelo = require('pomelo');
// var routeUtil = require('./app/util/routeUtil');
var app = pomelo.createApp();
app.set('name', 'enchanter_battle');
app.configure('production|development', function () {
    // proxy configures
    app.set('proxyConfig', {
        cacheMsg: true,
        interval: 30,
        lazyConnection: true
        // enableRpcLog: true
    });
    // remote configures
    app.set('remoteConfig', {
        cacheMsg: true,
        interval: 30
    });
    // app.route('game_logic', routeUtil.chat);
});
// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig', {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : false
    });
});
app.configure('production|development', 'game_logic', function () {
    app.loadConfig('argaio_init', app.getBase() + '/config/argaio.json');
    app.game_logic = require("./app/game_logic/game_logic")(app);
});
// start app
app.start();
process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
//球球大作战转为ts
//容器
//日志
//数据库
//熟悉登陆流程，数据库流程，日志流程，客户端流程
//球球大作战玩法
//卡牌和麻将
