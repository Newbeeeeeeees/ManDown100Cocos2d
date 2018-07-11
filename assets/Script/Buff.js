
cc.Class({
    extends: cc.Component,

    properties: {
        restTime: 0,
        buffIcon: {
            default: null,
            type: cc.Node
        },
        mass: 0,
        xVelocityRatio: 0,
        hp: 0,
        hpr: 0,
        is_trapped: false,
        is_turned: false,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start:function () {

    },

    // update (dt) {},
});
