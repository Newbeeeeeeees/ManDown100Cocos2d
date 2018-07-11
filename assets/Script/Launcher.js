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

        is_start: true,

        /*-----------------------------------------------Game Resource----------------------------------------------*/
        //topboard
        t_node_top_board:{
            default:null,
            type:cc.Node
        },

        //bottomboard
        t_node_bottom_board:{
            default:null,
            type:cc.Node
        },

        slot_list:
        {
            default: [],
            type: [cc.Integer],
            serializable: true,
        },

        currentBoards_list:
        {
            default: [],
            type: [cc.Prefab],
            serializable: true,
        },

        boards_list:
        {
            default: [],
            type: [cc.Prefab],
            serializable: true,
        },

        item_list:
            {
                default: [],
                type: [cc.Prefab],
                serializable: true,
            },

        //board prefabs
        t_prefab_yellow_stable:{
            default:null,
            type:cc.Prefab
        },

        t_prefab_green_pass:{
            default:null,
            type:cc.Prefab
        },

        t_prefab_red_loseLP:{
            default:null,
            type:cc.Prefab
        },

        t_prefab_brown_rebound:{
            default:null,
            type:cc.Prefab
        },

        /*t_prefab_white_slide:{
            default:null,
            type:cc.Prefab
        },

        t_prefab_grey_transpose:{
            default:null,
            type:cc.Prefab
        },*/

        //item prefabs
        t_prefab_item_heal:{
            default:null,
            type:cc.Prefab
        },
        t_prefab_item_gas:{
            default:null,
            type:cc.Prefab
        },
        t_prefab_item_RedBull:{
            default:null,
            type:cc.Prefab
        },
        t_prefab_item_Timer:{
            default:null,
            type:cc.Prefab
        },
        t_prefab_item_Voodoo:{
            default:null,
            type:cc.Prefab
        },
        t_prefab_item_Trap:{
            default:null,
            type:cc.Prefab
        },

        /*-----------------------------------------------Game Resource----------------------------------------------*/


        /*-----------------------------------------------Game Parameters----------------------------------------------*/
        //interval to produce board
        cd:1,
        delta_cd:1.5,

        //board idx to produce board
        delta_board_len: 0.5,
        min_board_len: 0.5,

        //random prob to produce bd gap
        bd_gap_a:  1.5,
        bd_gap_b:  2,
        bd_gap_c:  3,
        bd_gap_d:  4,
        bd_gap_e:  5,
        bd_gap_p1: 0.1,
        bd_gap_p2: 0.325,
        bd_gap_p3: 0.675,
        bd_gap_p4: 0.9,
        /*-----------------------------------------------Game Parameters----------------------------------------------*/

    },


    onLoad:function()
    {
        this.t_node_top_board.zIndex = 1;
        this.t_node_bottom_board.zIndex = 1;

        this.slot_list = [60,120,180,240,300,360,420];
        this.boards_list = [this.t_prefab_yellow_stable,
                            this.t_prefab_green_pass,
                            this.t_prefab_red_loseLP,
                            this.t_prefab_brown_rebound];

        this.item_list = [this.t_prefab_item_heal,
                          this.t_prefab_item_RedBull,
                          this.t_prefab_item_gas,
                          this.t_prefab_item_Voodoo,
                          this.t_prefab_item_Timer,
                          this.t_prefab_item_Trap];

        this.produceBoard(150);
        this.produceBoard(300);
        this.produceBoard(450);

    },



    update:function (dt) {
        this.cd -= dt;
        if(this.cd <= 0 )
        {
            this.produceBoard(10);
            this.cd = (1.5 + cc.random0To1() * this.delta_cd) / (1 + Global.boardVelocityRatio * Global.mylevel);
        }

        Global.gameTime = Global.gameTime + dt;
    },


    produceBoard:function(y_position) {
        //how many boards will be produced in a row
        var num = Math.floor(cc.random0To1() * 1) + 3;
        //gap between left side of camera and right side of prior board
        var leftgap = 0;

        for (var i=0; i<num; i++) {
            //gap between between 2 consecutive boards
            var gap = this.boardGap() * Global.gridnum;
            if (i == 0) {
                gap = this.firstBoardGap() * Global.gridnum;
            }
            //cc.log("gap: ", gap);

            var idx =  Math.floor(cc.random0To1() * this.boards_list.length);
            var tPrefab = cc.instantiate(this.boards_list[idx]);
            //cc.log("i,leftgap,gap", i,leftgap,gap);

            var ranx = this.min_board_len + cc.random0To1() * this.delta_board_len;
            tPrefab.width = tPrefab.width * ranx;
            tPrefab.setPosition(leftgap + gap + tPrefab.width/2, y_position);
            tPrefab.children[0].getComponent(cc.BoxCollider).size.width = tPrefab.width;
            tPrefab.parent = cc.director.getScene();
            this.currentBoards_list[this.currentBoards_list.length] = tPrefab;


            //produceItem_onBoard();
            var p_item = cc.random0To1();
            if (p_item < 0.5) {
                var idx_item =  Math.floor(cc.random0To1() * this.item_list.length);
                //cc.log("idx_item:", idx_item);
                var prefab_item = cc.instantiate(this.item_list[idx_item]);
                prefab_item.parent = cc.director.getScene();
                prefab_item.setPosition(leftgap + gap + tPrefab.width/2, y_position + 30);
            }

            leftgap = leftgap +  gap + tPrefab.width;
        }

    },


    firstBoardGap:function(){
        var ran = cc.random0To1();
        //cc.log("ran", ran);
        var result = 1;
        if (ran  < 0.05 )   {result = 0;    return result;}
        if (ran  < 0.3)     {result = 1.1;  return result;}
        if (ran  < 0.75)    {result = 2;    return result;}
        if (ran  < 0.95)    {result = 3;    return result;}
        if (ran  <= 1)      {result = 4;    return result;}
        //cc.log("result", result);
    },

    boardGap:function(){
        var ran = cc.random0To1();
        if (ran  < this.bd_gap_p1)  {return this.bd_gap_a;}
        if (ran  < this.bd_gap_p2)  {return this.bd_gap_b;}
        if (ran  < this.bd_gap_p3)  {return this.bd_gap_c;}
        if (ran  < this.bd_gap_p4)  {return this.bd_gap_d;}
	    return this.bd_gap_e;
    },

});
