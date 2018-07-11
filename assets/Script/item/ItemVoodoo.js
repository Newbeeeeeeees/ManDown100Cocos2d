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


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function ()
    {},

    start:function () {

    },

    update:function (dt) {
        var node = this.node.parent;
        node.y += Global.boardSpeed * dt ;
        if(node.y >= 900 )
        {
            node.destroy();
        }

    },

    onCollisionEnter: function (other){

        //cc.log("Voodoo item oncollision enter !!!");
        this.node.parent.destroy();
    }

});