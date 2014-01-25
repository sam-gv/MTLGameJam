include("js/game/NPC.js");
var BoommerConstants = {
    idleImages : [],
    moveImages : [],
    IDLE : 0,
    MOVE : 1
}
BoommerConstants['idleImages']['L'] = new Image();
BoommerConstants['idleImages']['L'].src = "./images/boomers/standbyLeft.png";

BoommerConstants['idleImages']['R'] = new Image();
BoommerConstants['idleImages']['R'].src = "./images/Mooses/standbyRight.png";

BoommerConstants['moveImages']['L'] = [];
BoommerConstants['moveImages']['L'].push(new Image());
BoommerConstants['moveImages']['L'].push(new Image());
BoommerConstants['moveImages']['L'].push(new Image());
BoommerConstants['moveImages']['L'].push(new Image());
BoommerConstants['moveImages']['L'].push(new Image());
for(i in BoommerConstants['moveImages']['L']) {
    BoommerConstants['moveImages']['L'][i].src = "./images/boomers/runLeft/SlugWalk"+i+".png";
}
BoommerConstants['moveImages']['R'] = [];
BoommerConstants['moveImages']['R'].push(new Image());
BoommerConstants['moveImages']['R'].push(new Image());
BoommerConstants['moveImages']['R'].push(new Image());
BoommerConstants['moveImages']['R'].push(new Image());
BoommerConstants['moveImages']['R'].push(new Image());
for(i in BoommerConstants['moveImages']['R']) {
    BoommerConstants['moveImages']['R'][i].src = "./images/boomers/runRight/SlugWalk"+i+".png";
}

var Hostile = NPC.extend({
	
constructor : function(posX, posY) {
		this.height = 56;
		this.width = 68;
		this.x = posX;
		this.y = posY + this.height/2;
        this.currentDirection = "L";
        this.moving = true;
        this.speed = 4;

        this.animationIndex = 0;
        this.animation = 0;
	},
	
	draw : function(canvas, context) {
        if(this.moving) {
            context.drawImage(BoommerConstants['moveImages'][this.currentDirection][this.animationIndex], this.x, this.y);
        }

	},

	update : function(framerate, player) {
        if(this.moving) {
            this.animation += framerate;
            if(this.animation >= 250) {
                console.log("tick");
                this.animationIndex++;
                if(this.animationIndex >= BoommerConstants['moveImages'][this.currentDirection].length) {
                    this.animationIndex=0;
                }
                this.animation = 0;
            }
            if(this.x > player.x) {
                this.x -= this.speed;
                this.currentDirection = "L";
            } else {
                this.x += this.speed;
                this.currentDirection = "R";
            }
        }
        this.collide(player);
	},
	collide : function(player){
		this.base(player);
	}

});