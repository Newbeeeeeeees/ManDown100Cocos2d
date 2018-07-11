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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        enter_btn: {
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function ()
    {

        var self = this;
        self.enter_btn.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("TOUCH_START")
        });

        self.enter_btn.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log("TOUCH_MOVE")
        });

        self.enter_btn.node.on(cc.Node.EventType.TOUCH_END, function (event) {
               console.log("TOUCH_END")
            cc.director.loadScene("btScene");
        });

    },

    start:function () {
    },

    // update (dt) {},
});
