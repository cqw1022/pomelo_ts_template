/**
 * Created by Administrator on 2017/5/11.
 */

var async = require('async');
var Code = require('../../../../global/Code');
//玩家离开调用
var onUserLeave = function (app, session, reason) {
    // if(!session || !session.uid) {
    //     return;
    // }
    //
    // utils.myPrint('1 ~ OnUserLeave is running ...');
    // app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), instanceId: session.get('instanceId')}, function(err){
    //     if(!!err){
    //         logger.error('user leave error! %j', err);
    //     }
    // });
    // app.rpc.chat.chatRemote.kick(session, session.uid, null);
};
//登陆处理

class LoginHandler{
    constructor(app){
        this.m_app = app;
    }

    public m_app:any;

    public login(msg, session, next):void {

        var self = this;
        async.waterfall([
            function (cb) {
                self.m_app.get('sessionService').kick(msg.player_name, cb);
            }, function (cb) {
                session.bind(msg.player_name, cb);
            }, function (cb) {
                session.set('player_name', msg.player_name);
                session.set('screen_width', msg.screenWidth);
                session.set('screen_height', msg.screenHeight);
                session.on('closed', onUserLeave.bind(null, self.m_app));
                session.pushAll(cb);
            },function (cb) {

                self.m_app.rpc.game_logic.player_remote.on_player_enter(session, msg.player_name, self.m_app.get('serverId'), cb);
            }
        ], function (err) {
            if (err) {
                next(err, { code: Code.FAIL });
                return;
            }
            next(null, { code: Code.OK, player: msg.player_name });
        });
    };
}

module.exports = function (app) {
    return new LoginHandler(app);
};
