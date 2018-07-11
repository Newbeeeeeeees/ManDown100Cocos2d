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

        _velocity: 100,
        velocity: {
            get:function () {
                return this._velocity;
            },
            set:function (value) {
                this._velocity = value;
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function ()
    {},

    start:function () {

    },

    update:function (dt) {
        var node = this.node.parent;
        node.y += Global.boardSpeed*dt ;
        if(node.y >= 900 )
        {
            node.destroy();
        }

    },

    onCollisionEnter: function (other){
        // this.node.parent.color = cc.Color.RED;
        // this.onboard();
        //cc.log('red board oncollision enter !!!');
    }
});
