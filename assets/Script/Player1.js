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
        //default settings
        is_flying: false,
        is_drop: true,
        top_board_in: false,
        gravity: -100,
        init_gravity: -100,
        init_x_velocity: 150,
        init_y_velocity: 250,
        y_velocity: 0,
        x_velocity: 0,
        leftCollision: false,
        rightCollision: false,

        //board info
        currentBoard: {
            default: null,
            type: cc.Node
        },
        lastboard: {
            default: null,
            type: cc.Node
        },
        lastboardtime: null,
        lastposition: {
            default: 0,
            type: cc.Integer,
        },

        //player info
        redboard_hpr: 0,
        flyingHPPerSecond: -200,
        hp: 1000,
        xVelocityRatio: 1,
        mass: 1,
        max_player_width : 80,
        max_player_height : 120,
        max_player_mass : 8,

        //launcher
        game: {
            default: null,
            type: cc.Node
        },

        //Control key
        turn_left_key: cc.KEY.a, //cc.KEY.left 37
        turn_right_key: cc.KEY.d, //cc.KEY.right 39
        flying_key: cc.KEY.space, //cc.KEY.up 38
        myname: "Player1",

        //other player
        other_player: {
            default: null,
            type: cc.Node
        },

        //item regarding
        is_trapped: false,
        is_gas: false,
        is_SandyGlass: false,
        timer_trap: 0,
        timer_gas: 0,
        timer_SandyGlass: 0,
        redbull_enlarge_ratio: 1.2,

    },
    setInputControl: function () {
        //cc.log('set input control!');
        var self = this;

        // 添加键盘事件监听
        // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            //cc.log("aaa: ",cc.KEY.left,cc.KEY.right,cc.KEY.up);
            if (event.keyCode == self.turn_left_key) {
                self.x_velocity = -self.init_x_velocity;
            }

            if (event.keyCode == self.turn_right_key) {
                self.x_velocity = self.init_x_velocity;
            }
            if (event.keyCode == self.flying_key) {
                self.gravity = -self.init_gravity;
                self.is_flying = true;
                self.y_velocity = Global.boardSpeed*1.5;
            }
        });

        //松开按键时，停止向该方向的加速
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            if(event.keyCode == self.turn_left_key )
            {
                if (self.x_velocity == -self.init_x_velocity) {
                    self.x_velocity = 0;
                }
            }
            if (event.keyCode == self.turn_right_key ) {
                if (self.x_velocity == self.init_x_velocity) {
                    self.x_velocity = 0;
                }
            }

            if (event.keyCode == self.flying_key) {
                self.gravity = self.init_gravity;
                self.is_flying = false;
            }
        });
    },

    onLoad:function ()
    {
        this.lvboard();

        this.lastposition = [0,0];
            // 初始化键盘输入监听
        this.setInputControl();
    },

    start:function () {},

    update:function (dt) {
        var node = this.node.parent;
        this.lastposition = [node.x, node.y];
        //判断是否需要下落
        if(!this.is_drop && this.currentBoard) {
            if ((this.abs(node.x-this.currentBoard.x)) > (node.width/2 + this.currentBoard.width/2)
            || this.abs((this.abs(node.y-this.currentBoard.y)) - (node.height/2 + this.currentBoard.height/2)) > 35) {
                this.is_drop = true;
                this.currentBoard = null;
            }
        }

        //apply an acceleration
        if (this.is_drop) {
            if(this.gravity < 0) {
                if(this.y_velocity < -500) {
                    this.y_velocity += this.gravity * dt;
                }
                if(this.y_velocity >= -500 && this.y_velocity < -300) {
                    this.y_velocity += 2 * this.gravity * dt;
                }
                if (this.y_velocity >= -300 && this.y_velocity < -100){
                    this.y_velocity += 3 * this.gravity * dt;
                }
                if (this.y_velocity >= -100 && this.y_velocity < 100){
                    this.y_velocity += 4 * this.gravity * dt;
                }
                if (this.y_velocity >= 100 && this.y_velocity < 300){
                    this.y_velocity += 5 * this.gravity * dt;
                }
                if (this.y_velocity >= 300 ){
                    this.y_velocity += 6 * this.gravity * dt;
                }
            }
        }

        //预测不碰撞才移动
        var xCollision = false;

        if(this.lastboard != null && this.lastboard.y > 850) {
            this.lastboard = null;
        }

        if(this.x_velocity > 0 && this.lastboard != null && this.rightCollision && node.x < this.lastboard.x) {
            if ((Math.abs(node.x-this.lastboard.x) < node.width/2+this.lastboard.width/2)
                && (Math.abs(node.y-this.lastboard.y) < node.height/2+this.lastboard.height/2)) {
                xCollision = true;
            } else {
                // this.rightCollision = false;
            }
        }
        if(this.x_velocity<0 && this.lastboard != null &&  this.leftCollision  && node.x > this.lastboard.x) {
            if ((Math.abs(node.x-this.lastboard.x) < node.width/2+this.lastboard.width/2)
                && (Math.abs(node.y-this.lastboard.y) < node.height/2+this.lastboard.height/2)) {
                xCollision = true;
            } else {
                //this.leftCollision = false;
            }
        }

        //根据当前加速度方向每帧更新速度
        node.y += this.y_velocity * dt;
        //cc.log("this.y_velocity: ", this.y_velocity);
        if(!this.is_trapped) {
            if (!xCollision) {
                node.x += this.x_velocity * this.xVelocityRatio * dt;
            }

            if (node.x >= (Global.maxwidth - node.width)) {
                node.x = Global.maxwidth - node.width - 1;
                this.x_velocity = 0;
            }
            if (node.x <= 0) {
                node.x = 1;
                this.x_velocity = 0;
            }
        }

        //每帧更新Hp
        this.hp += this.redboard_hpr*dt;
        if(this.is_flying) {
            this.hp += this.flyingHPPerSecond*dt;
        }

        //hp < 0 触发end
        if (this.hp < 0) {
            this.gameOver();
        }

        //got trapped, NO current x_v for 3s
        if (this.is_trapped) {
            this.timer_trap -= dt;
            if (this.timer_trap <0) {
                this.is_trapped = false;
            }
        }

        //got gas, speed up for certain seconds
        if (this.is_gas) {
            this.timer_gas -= dt;
            if(this.timer_gas <0) {
                this.is_gas = false;
                this.xVelocityRatio = this.xVelocityRatio/3;
            }
        }

        //got Timer, speed down for certain seconds
        if (this.is_SandyGlass) {
            this.timer_SandyGlass -= dt;
            if(this.timer_SandyGlass <0) {
                this.is_SandyGlass = false;
                this.xVelocityRatio = this.xVelocityRatio/0.3;
            }
        }
        //cc.log(" this.xVelocityRatio: ",  this.xVelocityRatio);
    },

    //if player is on board (collide with board),
    //set is_drop = false
    //change the y_velocity to boardSpeed
    //触发相应color的效果
    onboard:function(color) {
        this.is_drop = false;
        this.y_velocity = Global.boardSpeed;
        if (color == "red") {
            this.redboard_hpr += -50;
        }
    },

    //if player is NOT on board,
    //set the is_drop = true
    //change the player image color to YELLOW
    //WHY STILL IF COLOR==RED????
    lvboard:function(color)
    {
        //this.is_drop = true;
        //this.y_velocity = this.y_velocity-this.init_y_velocity;
        if (color == "red") {
            this.redboard_hpr = 0;
        }
        //test/de-bug purpose
        this.node.parent.color = cc.Color.YELLOW;
    },


    onCollisionEnter:  function (other) {
        //cc.log("collision enter, name: ", other.name);
        var otherPlayer = this.other_player.getComponent("Player1")

        //接触顶端板时掉血
        if (other.name === 'top_board<BoxCollider>' ) {
            //this.currentboard = other;
            //this.getEnterType(other);
            if (this.y_velocity > 0) {
                this.y_velocity = -this.y_velocity;
            }
            this.node.parent.y = this.node.parent.y - 30;
            this.gravity = this.init_gravity;
            this.is_flying = false;
            this.top_board_in = true;

            this.hp -= 50;
        }

        //接触底板时载入结束画面
        if (other.name === 'bottom_board<BoxCollider>') {
            this.hp = -1;
            this.gameOver();
            return;
        }

        //黄色钢板，绝对支撑物
        if (other.name === 'YellowBoard<BoxCollider>') {

            var enterType = this.getEnterType(other);
            //cc.log("enterType: ", enterType);
            if (enterType === 4) {
                this.node.parent.color = cc.Color.RED; //test/de-bug purpose
                this.onboard();
                //jia xue
                //this.hp += 1;
            }
            this.currentBoard = other.node.parent;
            this.lastboardtime = Global.gameTime;
        }

        //绿色草丛板，穿过
        if (other.name === 'GreenBoard<BoxCollider>') {
            this.node.parent.color = cc.Color.RED;
            //jia xue
            this.hp += 1;
            //this.lastboard = other.node.parent;
            //this.lastboardtime = Global.gameTime;
        }

        //红色伤害板，持续扣血
        if (other.name === 'RedBoard<BoxCollider>') {
            var enterType = this.getEnterType(other);
            if (enterType === 4) {

                this.node.parent.color = cc.Color.RED;
                this.onboard("red");
            }
            this.currentBoard = other.node.parent;
            this.lastboardtime = Global.gameTime;
        }

        //棕色弹跳板，弹簧效果，上弹
        if (other.name === 'BrownBoard<BoxCollider>') {
            var enterType = this.getEnterType(other);
            if (enterType === 4) {
                this.node.parent.color = cc.Color.RED;
                if (this.node.parent.y < 720) {
                    this.y_velocity = 400;
                }
                if (this.is_trapped) {
                    this.onboard();
                    this.currentBoard = other.node.parent;
                }
                //ce shi jia xue
                //this.hp += 5;
            }
            //this.lastboard = other.node.parent;
            //this.lastboardtime = Global.gameTime;
        }

        //Item effects
        //Heal item
        if (other.name === 'item_heal<BoxCollider>'){

            this.hp += 100;

        }

        //Voodoo Item;
        //change the control direction; get another one to recover regular control
        if (other.name === 'item_voodoo<BoxCollider>') {
            var turn_key_transfer ;

            turn_key_transfer = otherPlayer.turn_left_key;
            otherPlayer.turn_left_key = otherPlayer.turn_right_key;
            otherPlayer.turn_right_key = turn_key_transfer;

            otherPlayer.x_velocity = - otherPlayer.x_velocity;

        }

        //Trap Item
        if (other.name === 'item_trap<BoxCollider>'){

            otherPlayer.is_trapped = true;
            otherPlayer.timer_trap = 2;

        }

        //Gas item
        //make the player speed UP
        if (other.name === 'item_gas<BoxCollider>' && !this.is_gas) {
            this.is_gas = true;
            this.timer_gas = 5;
            this.xVelocityRatio = 3 * this.xVelocityRatio; //if changed this, remember to turn it back in update() close;
        }

        //Timer item
        //make the player speed DOWN
        if (other.name === 'item_timer<BoxCollider>' && !this.is_SandyGlass) {
            otherPlayer.is_SandyGlass = true;
            otherPlayer.timer_SandyGlass = 5;
            otherPlayer.xVelocityRatio = 0.3 * otherPlayer.xVelocityRatio;
        }

        //Redbull item
        //make the player mass BIGGER
        //make the player image size bigger;
        //make the player collision bounder bigger;
        //if meet the max size, stick to the max value;
        if (other.name === 'item_redbull<BoxCollider>') {
            var player_width = this.node.parent.width;
            var player_height = this.node.parent.height;

            this.mass = this.redbull_enlarge_ratio * this.mass;
            player_width = this.redbull_enlarge_ratio * player_width;
            player_height = this.redbull_enlarge_ratio * player_height;

            if (player_width > this.max_player_width) {
                player_width = this.max_player_width;
            }
            if (player_height > this.max_player_height) {
                player_height = this.max_player_height;
            }
            if (this.mass > this.max_player_mass) {
                this.mass = this.max_player_mass;
            }
            //cc.log("player current mass:", this.mass);

            this.node.parent.width = player_width;
            this.node.parent.height = player_height;
            this.node.getComponent(cc.BoxCollider).size.width = player_width;
            this.node.getComponent(cc.BoxCollider).size.height = player_height;
        }


        if (other.name === 'Unit1<BoxCollider>') {
            var vx1 = this.x_velocity;
            var vy1 = this.y_velocity;
            var mass1 = this.mass;

            var vx2 = other.node._components[1].x_velocity;
            var vy2 = other.node._components[1].y_velocity;
            var mass2 = other.node._components[1].mass;

            if  (mass1 == mass2) {
                var tempx = vx1;
                var tempy = vy1;
                vx1 = vx2;
                vy1 = vy2;
                vx2 = tempx;
                vy2 = tempy;
            }
            if (mass1 > mass2) {
                vx2 = this.myCollide(vx1,mass1,vx2,mass2);
                vy2 = this.myCollide(vy1,mass1,vy2,mass2);
                vx1 = 0;
                vy1 = 0;
                if (!this.is_drop) {
                    vy1 = Global.boardSpeed;
                }
            }
            if (mass2 > mass1) {
                vx1 = this.myCollide(vx2,mass2,vx1,mass1);
                vy1 = this.myCollide(vy2,mass2,vy1,mass1);
                vx2 = 0;
                vy2 = 0;
                if (!other.node._components[1].is_drop) {
                    vy2 = Global.boardSpeed;
                }
            }



            this.x_velocity = vx1;
            this.y_velocity = vy1;
            other.node._components[1].x_velocity = vx2;
            other.node._components[1].y_velocity = vy2;
            //站在头上等逻辑，放置重叠
            if (this.is_drop || other.node._components[1].is_drop) {
                //other.node._components[1].is_drop = true;
                //this.is_drop = true;
            }

            //cc.log("1111:",other.node._components[1].hp);

        }



    },

    myCollide: function(vx1,mass1,vx2,mass2) {
        //默认vx1质量大于vx2
        if(vx1 == 0 && vx2 == 0) {
            return 0;
        }
        //X ,反向
        if(vx1 * vx2 <= 0) {
            vx2 = (this.abs(mass1 * vx1)+this.abs(mass2 * vx2)) / mass2 * (vx2==0?vx1/this.abs(vx1):-vx2/this.abs(vx2));
            return vx2;
        }
        //X ,同向
        if(vx1 * vx2 > 0) {
            if (this.abs(vx1) > this.abs(vx2)) {
                vx2 = (this.abs(mass1 * vx1)+this.abs(mass2 * vx2)) / mass2 * (vx2/this.abs(vx2));
                return vx2;
            }
            if (this.abs(vx1) <= this.abs(vx2)) {
                vx2 = (this.abs(mass1 * vx1)+this.abs(mass2 * vx2)) / mass2 * (-vx2/this.abs(vx2));
                return vx2;
            }
        }
    },

    abs: function(number) {
        if (number < 0) {
            return -number;
        }
        return number;
    },

    getEnterType: function(other) {
        var thisnode = this.node.parent;
        var othernode = other.node.parent;
        var v1 = Math.abs(thisnode.x + thisnode.width/2 - (othernode.x - othernode.width/2));
        var v2 = Math.abs(othernode.x + othernode.width/2 - (thisnode.x - thisnode.width/2));
        var v4 = Math.abs(othernode.y + othernode.height/2 - (thisnode.y - thisnode.height/2)) ;
        var v3 = Math.abs(thisnode.y + thisnode.height/2 - (othernode.y - othernode.height/2)) ;

        //cc.log("v1: ", v1);
        //cc.log("v2: ", v2);
        //cc.log("v3: ", v3);
        //cc.log("v4: ", v4);

        var leftin = false;
        var rightin = false;


        //右移进入，则自动移出，X速度变为0
        if (v1 < 20){
            if (this.lastposition[0] < thisnode.x && (this.lastposition[0] + thisnode.width/2) < (othernode.x - othernode.width/2)) {
                rightin = true;
                thisnode.x = othernode.x - othernode.width/2 - 1 -thisnode.width/2;
                this.rightCollision = true;
                this.lastboard = othernode;
                return 1;
            }
        }

        //左移进入，则自动移出，X速度变为0
        if (v2 < 20){
            if (this.lastposition[0] > thisnode.x && (this.lastposition[0] - thisnode.width/2) > (othernode.x + othernode.width/2)) {
                leftin = true;
                thisnode.x = othernode.x + othernode.width / 2 + 1 + thisnode.width / 2;
                this.leftCollision = true;
                this.lastboard = othernode;
                return 2;
            }
        }

        //上面落下，则进入正常逻辑
        if (v4 < 30 && !leftin && !rightin){

            thisnode.y = othernode.y + othernode.height/2 - 1 + thisnode.height/2;
            return 4;
        }

        //下面向上头顶，则自动移出，Y速度变为0
        if (v3 < 30 ){

            thisnode.y = othernode.y - othernode.height/2 - 1 - thisnode.height/2;
            this.y_velocity = 0;
            return 3;
        }
    },

    onCollisionExit: function(other) {
        //cc.log("collision exit, name: ", other.name);
        if (other.name === 'RedBoard<BoxCollider>') {
            this.lvboard("red");
            return;
        }

        if (other.name === 'BrownBoard<BoxCollider>') {
            this.lvboard("brown");
            return;
        }
        if (other.name === 'YellowBoard<BoxCollider>') {
            this.lvboard("yellow");
            return;
        }
        if (other.name === 'top_board<BoxCollider>') {
            this.top_board_in = false;
        }

        if (other.name === 'Unit1<BoxCollider>') {
            //this.is_drop = false;
            //other.node._components[1].is_drop = false;
        }
    },

    gameOver: function() {
        var otherPlayer = this.other_player.getComponent("Player1")
        if (this.myname == "Player1") {
            Global.HP1 = this.hp;
            Global.HP2 = otherPlayer.hp;
        } else {
            Global.HP2 = this.hp;
            Global.HP1 = otherPlayer.hp;
        }
        cc.director.loadScene('edScene');
    }
});
