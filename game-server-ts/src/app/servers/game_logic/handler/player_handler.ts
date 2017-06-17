"use strict";
/**
 * Created by Caiqiwen on 2017/5/9.
 */
class PlayerHandler{
    constructor(app){
        this.m_app = app;
    }
    public m_app:any;

    public on_player_enter(msg, session, next) {
        console.log("on_player_enter");
    };

}
module.exports = function (app) {
    return new PlayerHandler(app);
};
