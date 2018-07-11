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
        // left_controller: {
        //     default: null,
        //     type: cc.Sprite
        // },
        // right_controller: {
        //     default: null,
        //     type: cc.Sprite
        // },

        player1:{
            default: null,
            type: cc.Node
        },

        player2:{
            default: null,
            type: cc.Node
        },

        level_info:{
            default: null,
            type: cc.Label
        },

        levelTime:2,
        init_levelTime:2,

        hp_info:{
            default: null,
            type: cc.Label
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        var that = this;
        // this.left_controller.node.on(cc.Node.EventType.TOUCH_END, function (event) {
        //     cc.log('this.left_controller click');
        //     that.player.parent.x -= 10;
        // });
        // this.right_controller.node.on(cc.Node.EventType.TOUCH_END, function (event) {
        //     cc.log('this.right_controller click');
        //     that.player.parent.x += 10;
        // });

        var manager = cc.director.getCollisionManager();
        //默认碰撞检测系统是禁用的，这里开启检测系统
        manager.enabled = true;
        //绘制碰撞范围
        manager.enabledDebugDraw = true;
        //绘制node的包围盒
        manager.enabledDrawBoundingBox = true;
    },

    start:function () {

    },

    update:function (dt) {
        this.level_info.node.getComponent(cc.Label).string = "Level: "+Global.mylevel;
        this.hp_info.node.getComponent(cc.Label).string = 'HP(P1): '+ Math.floor(this.player1.getComponent("Player1").hp) + " HP(P2): "+ Math.floor(this.player2.getComponent("Player1").hp);
        this.levelTime = this.levelTime - dt;
        //cc.log('levelTime: '+this.levelTime);
        if (this.levelTime < 0) {
            //cc.log('level up');
            this.levelTime = this.init_levelTime;
            Global.mylevel += 1;
            Global.boardSpeed = Global.boardSpeed * (1 + Global.boardVelocityRatio);
            //cc.log("Global.boardSpeed: ", Global.boardSpeed);
        }
    },
});
