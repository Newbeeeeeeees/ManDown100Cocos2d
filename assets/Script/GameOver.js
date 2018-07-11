// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        try_again: {
            default: null,
            type: cc.Button
        },
        go_out: {
            default: null,
            type: cc.Button
        },


        player:{
            default: null,
            type: cc.Node
        },

        win_info:{
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function(){
        var that = this;
        this.try_again.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("try again TOUCH_END");
            that.restartgame();
            cc.director.loadScene("btScene");
        });
        this.go_out.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("go out TOUCH_END");
            cc.director.end();
        });
    },

    start :function() {
        var str = Global.HP1 > Global.HP2 ? "P1 win":"P2 win";
        this.win_info.node.getComponent(cc.Label).string = 'HP(P1): '+ Math.floor(Global.HP1) + "   HP(P2): "+ Math.floor(Global.HP2) +"\n"+str;


    },

    restartgame: function() {
        Global.mylevel = 1;
        Global.boardSpeed = 100;
        Global.gameTime = 0;
        //this.player.getComponent("Unit").hp = 10000;

    },

    // update (dt) {},
});
