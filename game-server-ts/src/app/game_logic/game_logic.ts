"use strict";
/**
 * Created by Administrator on 2017/5/9.
 */

class GameLogic {
    constructor(app) {
        // private m_players = [];
        this.m_users = {};
        this.m_app = app;
        this.m_cfg = app.get("argaio_init");
    }

    public m_app: any;
    public m_users: any;
    public m_cfg;

    public log = (function () {
        var log = Math.log;
        return function (n, base) {
            return log(n) / (base ? log(base) : 1);
        };
    })();

    public uniformPosition(points, radius) {
        var self = this;
        var bestCandidate, maxDistance = 0;
        var numberOfCandidates = 10;
        if (points.length === 0) {
            return self.randomPosition(radius);
        }
        // Generate the cadidates
        for (var ci = 0; ci < numberOfCandidates; ci++) {
            var minDistance = Infinity;
            var candidate = self.randomPosition(radius);
            // candidate.radius = radius;
            for (var pi = 0; pi < points.length; pi++) {
                var distance = self.getDistance(candidate, points[pi]);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
            if (minDistance > maxDistance) {
                bestCandidate = candidate;
                maxDistance = minDistance;
            }
            else {
                return self.randomPosition(radius);
            }
        }
        return bestCandidate;
    };

    public on_player_enter(player_name, sid): void {
        var self = this;
        // this.app.get('channelService')
        // console.log(self.m_app.get('proxy'));
        // aa.aa = 1;
        console.log("on_player_enter  " + player_name);
        var config = self.m_cfg;
        var radius = self.massToRadius(config.defaultPlayerMass);
        var position = config.newPlayerInitialPosition == 'farthest' ? self.uniformPosition(self.m_users, radius) : self.randomPosition(radius);
        var cells = [];
        var massTotal = 0;
        // if(type === 'player') {
        //     cells = [{
        //         mass: config.defaultPlayerMass,
        //         x: position.x,
        //         y: position.y,
        //         radius: radius
        //     }];
        //     massTotal = config.defaultPlayerMass;
        // }
        var currentPlayer = {
            sid: sid,
            id: player_name,
            x: position.x,
            y: position.y,
            w: config.defaultPlayerMass,
            h: config.defaultPlayerMass,
            cells: cells,
            massTotal: 0,
            hue: Math.round(Math.random() * 360),
            lastHeartbeat: new Date().getTime(),
            target: {
                x: 0,
                y: 0
            }
        };
        self.m_users[player_name] = currentPlayer;
        console.log("!!!!!!!!!!!!!!!!!!!!!!");
        // var connector = dispatcher.dispatch(uid, app.getServersByType('connector'));
        // if(connector) {
        //     return connector.id;
        // }
        // messageService.pushMessageToPlayer({uid:player.userId, sid : player.serverId}, 'onUpdateTaskData', reData);
        self.m_app.get('channelService').pushMessageByUids('gameSetup', {
            gameWidth: config.defaultPlayerMass,
            gameHeight: config.defaultPlayerMass
        }, [{uid: player_name, sid: sid}], function (err) {
        });
    }

    public on_player_leave(player_name):void {
    };

    public validNick(nickname):boolean {
        var regex = /^\w*$/;
        return regex.exec(nickname) !== null;
    };

    public massToRadius(mass):number {
        return 4 + Math.sqrt(mass) * 6;
    };

    public getDistance(p1, p2):number {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) - p1.radius - p2.radius;
    };

    public randomInRange(from, to):number {
        return Math.floor(Math.random() * (to - from)) + from;
    };
    // generate a random position within the field of play
    public randomPosition(radius) {
        var self = this;
        return {
            x: self.randomInRange(radius, self.m_cfg.gameWidth - radius),
            y: self.randomInRange(radius, self.m_cfg.gameHeight - radius),
            radius: radius
        };
    }

    public findIndex(arr, id):number {
        var len = arr.length;
        while (len--) {
            if (arr[len].id === id) {
                return len;
            }
        }
        return -1;
    };

    public randomColor() {
        var color = '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
        var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var r = (parseInt(c[1], 16) - 32) > 0 ? (parseInt(c[1], 16) - 32) : 0;
        var g = (parseInt(c[2], 16) - 32) > 0 ? (parseInt(c[2], 16) - 32) : 0;
        var b = (parseInt(c[3], 16) - 32) > 0 ? (parseInt(c[3], 16) - 32) : 0;
        return {
            fill: color,
            border: '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        };
    };

}

module.exports = function (app) {
    return new GameLogic(app);
};
