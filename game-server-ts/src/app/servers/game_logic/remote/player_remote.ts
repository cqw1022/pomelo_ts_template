/**
 * Created by Caiqiwen on 2017/5/9.
 */
class  PlayerRemote{
    constructor(app) {
        this.m_app = app;
        this.m_game_logic = require("../../../game_logic/game_logic")(app);
    }

    public m_app:any;
    public m_game_logic:GameLogic;

    public on_player_enter(player_name, sid, cb) {
        var self = this;
        // self.m_app.get('serverId')
        var channel = self.m_app.get('channelService').getChannel("test", true);
        if (!!channel) {
            channel.add(player_name, sid);
        }
        self.m_game_logic.on_player_enter(player_name, sid);
        cb();
    };
}
module.exports = function (app) {
    return new PlayerRemote(app);
};
