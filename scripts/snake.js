/**
 * Created by jjf001 on 14-1-23.
 */

/**
 *
 * @type {{CANVAS: {width: number, height: number}, SIZE: {length: number}}}
 */
var Config = {
    CANVAS: {
        width: 800,
        height: 600
    },

    SIZE: {
        length: 20
    },

    DIRECTION: {
        up: 0,
        right: 1,
        down: 2,
        left: 3
    }
}

/**
 *
 * @param x
 * @param y
 * @constructor
 */
function Node(x, y) {
    this.length = Config.SIZE.length;
    this.x = x;
    this.y = y;
}

/**
 *
 * @constructor
 */
function Food(context){
    this.context = context;
    var stepX = Config.CANVAS.width / Config.SIZE.length - 1;
    var stepY = Config.CANVAS.height / Config.SIZE.length - 1;
    var x = Math.ceil(Math.random() * stepX) * Config.SIZE.length;
    var y = Math.ceil(Math.random() * stepY) * Config.SIZE.length;
    Node.apply(this,[x, y])
}

/**
 *
 * @private
 */
Food.prototype._draw = function(){
    this.context.fillRect(this.x, this.y, Config.SIZE.length, Config.SIZE.length);
}

/**
 *
 * @param context
 * @constructor
 */
function Snake(context) {
    this.context = context;
    this.body = [];
    this.food = new Food(this.context);
    this.direction = Config.DIRECTION.right;
    this.speed = 100;

    //event
    this.onEaten = null;
    this.onDie = null;
}

/**
 *
 */
Snake.prototype.init = function () {
    var x = Config.SIZE.length * 10;
    var y = Config.SIZE.length * 10;
    for (var i = 0; i < 8; i++) {
        this.body.push(new Node(x - Config.SIZE.length * i, y));
    }
    this._bind();
    this._draw();
};

/**
 *
 * @private
 */
Snake.prototype._bind = function(){
    var that = this;
    $(window).keydown(function(event){
        switch(event.keyCode) {
            case 38:
                if(that.direction == Config.DIRECTION.down){
                    return;
                }
                that.direction = Config.DIRECTION.up;
                break;
            case 39:
                if(that.direction == Config.DIRECTION.left){
                    return;
                }
                that.direction = Config.DIRECTION.right;
                break;
            case 40:
                if(that.direction == Config.DIRECTION.up){
                    return;
                }
                that.direction = Config.DIRECTION.down;
                break;
            case 37:
                if(that.direction == Config.DIRECTION.right){
                    return;
                }
                that.direction = Config.DIRECTION.left;
                break;
        }
    });
};

/**
 *
 * @private
 */
Snake.prototype._draw = function () {
    this.context.clearRect(0, 0, Config.CANVAS.width, Config.CANVAS.height);
    this.context.fillStyle = "#00ff00";
    for (var i = 0; i < this.body.length; i++) {
        this.context.fillRect(this.body[i].x, this.body[i].y, this.body[i].length, this.body[i].length);
    }
    this.food._draw();
};

/**
 *
 * @returns {boolean}
 */
Snake.prototype.isEatenFood = function(){
    return this.body[0].x === this.food.x && this.body[0].y === this.food.y;
};

/**
 *
 * @returns {boolean}
 */
Snake.prototype.isEatenMySelf = function(){
    for (var i = 1; i < this.body.length; i++)
    {
        if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y)
        {
            return true;
        }
    }
    return false;
};

/**
 *
 */
Snake.prototype._move = function () {
    if(this.isEatenMySelf()){
        if(this.onDie){
            this.onDie.call(this);
        }
        return;
    }

    if(this.isEatenFood()){
        if(this.onEaten){
            this.onEaten.call(this);
        }

        this.body.unshift(this.food);
        this.food = new Food(this.context);
    }

    this.body.pop();
    var headX = this.body[0].x;
    var headY = this.body[0].y;
    switch (this.direction) {
        case Config.DIRECTION.up:
            if(headY <= 0)
            {
                headY = Config.CANVAS.height;
            }
            this.body.unshift(new Node(headX, headY - Config.SIZE.length));
            break;
        case Config.DIRECTION.right:
            if(headX >= Config.CANVAS.width - Config.SIZE.length){
                headX = -Config.SIZE.length;
            }
            this.body.unshift(new Node(headX + Config.SIZE.length, headY));
            break;
        case Config.DIRECTION.down:
            if(headY >= Config.CANVAS.height - Config.SIZE.length){
                headY = -Config.SIZE.length;
            }
            this.body.unshift(new Node(headX, headY + Config.SIZE.length));
            break;
        case Config.DIRECTION.left:
            if(headX <= 0){
                headX = Config.CANVAS.width;
            }
            this.body.unshift(new Node(headX - Config.SIZE.length, headY));
            break;
    }
    this._draw();
    setTimeout($.proxy(this._move, this), this.speed);
};

/**
 *
 */
Snake.prototype.start = function(){
    this._move();
};