include("js/game/Weapon.js");
//console.log(location.href);
var PlayerConstants = {
    idleImages : [],
    moveImages : [],
    attackImages : [],
    jumpingImages : [],
    hitImage : [],
    IDLE : 0,
    MOVE : 1
}
PlayerConstants['idleImages']['L'] = new Image();
PlayerConstants['idleImages']['L'].src = location.href + "images/player/standbyLeft.png";

PlayerConstants['idleImages']['R'] = new Image();
PlayerConstants['idleImages']['R'].src = location.href + "images/player/standbyRight.png";

PlayerConstants['jumpingImages']['L'] = new Image();
PlayerConstants['jumpingImages']['L'].src = location.href + "images/player/jumpLeft.png";

PlayerConstants['jumpingImages']['R'] = new Image();
PlayerConstants['jumpingImages']['R'].src = location.href + "images/player/jumpRight.png";

PlayerConstants['hitImage']['L'] = new Image();
PlayerConstants['hitImage']['L'].src = location.href + "images/player/persoHitLeft.png";

PlayerConstants['hitImage']['R'] = new Image();
PlayerConstants['hitImage']['R'].src = location.href + "images/player/persoHitRight.png";

PlayerConstants['moveImages']['L'] = [];
PlayerConstants['moveImages']['L'].push(new Image());
PlayerConstants['moveImages']['L'].push(new Image());
PlayerConstants['moveImages']['L'].push(new Image());
PlayerConstants['moveImages']['L'].push(new Image());
PlayerConstants['moveImages']['L'].push(new Image());
PlayerConstants['moveImages']['L'].push(new Image());
PlayerConstants['moveImages']['L'].push(new Image());
PlayerConstants['moveImages']['L'].push(new Image());
for(i in PlayerConstants['moveImages']['L']) {
    PlayerConstants['moveImages']['L'][i].src = location.href + "images/player/runLeft/run"+i+".png";
}
PlayerConstants['moveImages']['R'] = [];
PlayerConstants['moveImages']['R'].push(new Image());
PlayerConstants['moveImages']['R'].push(new Image());
PlayerConstants['moveImages']['R'].push(new Image());
PlayerConstants['moveImages']['R'].push(new Image());
PlayerConstants['moveImages']['R'].push(new Image());
PlayerConstants['moveImages']['R'].push(new Image());
PlayerConstants['moveImages']['R'].push(new Image());
PlayerConstants['moveImages']['R'].push(new Image());
for(i in PlayerConstants['moveImages']['R']) {
    PlayerConstants['moveImages']['R'][i].src = location.href + "images/player/runRight/run"+i+".png";
}


//Weapon images ------------------------------------------------------------------------------------------
PlayerConstants['attackImages']['L'] = [];
PlayerConstants['attackImages']['L'].push(new Image());
PlayerConstants['attackImages']['L'].push(new Image());

for(i in PlayerConstants['attackImages']['L']) {
    PlayerConstants['attackImages']['L'][i].src = location.href + "images/player/attackLeft/attack"+i+".png";
}

PlayerConstants['attackImages']['R'] = [];
PlayerConstants['attackImages']['R'].push(new Image());
PlayerConstants['attackImages']['R'].push(new Image());


for(i in PlayerConstants['attackImages']['R']) {
    PlayerConstants['attackImages']['R'][i].src = location.href + "images/player/attackRight/attack"+i+".png";
}

var Player = Base.extend({
	constructor: function(posX, posY, spriteSrcL, spriteSrcR){

		this.height = 100;
		this.width = 40;
		this.posY = posY;
		this.x = posX;
		this.y = this.posY + this.height;
		this.hp = 6;
		this.sanity = 100;

		this.equippedWeapon = 0;
		this.primaryWeapon = 0;
		this.secondaryWeapon = 1;
		this.weapons = [,];

		//damage, attackSpeed, reach, sanityThreshold, cooldown, typeAttack, sprites
		this.axe = new Weapon(1.2, 1.7, 58, 80, 1, "slash", "");

		this.weapons[this.primaryWeapon] = this.axe;


        this.images = [];
        this.images["R"] = new Image();
        this.images["L"] = new Image();
        this.images["R"].src = spriteSrcR;
        this.images["L"].src = spriteSrcL;

		this.speed = 9.5;
		this.mouvement = "";
		this.currentDirection = "R";
		this.gravity = 1.4;
		this.velocityX = 0.0;
		this.velocityY = 0.0;
		this.onGround = true;
		this.inHole = false;
		this.onBlock = false;
		this.groundY = posY;
		this.staticGround = this.groundY;
		this.collidingObject = false;
		this.canRunLeft = true;
		this.canRunRight = true;

        this.animationIndex = 0;
        this.animation = 0;
        this.attacking = false;
        this.animationAttackingIndex = 0;
        this.animationAttacking = 0;
        this.doDamage = false;
        this.recovery = 0;
	},

	attack: function(){
		this.attacking = true;
        SoundManager.play("swoosh");
	},
	collidesWith : function(collidingObject){
		if(collidingObject){ 
			////console.log (collidingObject);
			this.collidingObject = collidingObject;
			return this.collidingObject;
		}
		else{
			this.collidingObject = false;
			return false;
		}		

	},
	draw: function(canvas, context, camera, area){
        var img;

        if(this.recovery > 0) {
            img = PlayerConstants['hitImage'][this.currentDirection];
        } else {
            if(this.attacking){
                img = PlayerConstants['attackImages'][this.currentDirection][this.animationAttackingIndex];
            }
            else {
                if(this.onGround) {
                    if(this.mouvement != "") {
                        img = PlayerConstants['moveImages'][this.currentDirection][this.animationIndex];
                    } else {
                        img = PlayerConstants['idleImages'][this.currentDirection];
                    }
                } else {
                    img = PlayerConstants['jumpingImages'][this.currentDirection];
                }
            }
        }
        
        var offsetX = (this.mouvement == "" && this.currentDirection == "L") ? -20 : 0;
        var offsetY = (this.attacking) ? 40 : 0;

        if(this.x < camera.halfWidth) {
            context.drawImage(img, this.x - this.width/2 + offsetX, this.y - this.height/2 - offsetY);
        }
        else if(this.x > area.width - camera.halfWidth - this.width/2) {
            context.drawImage(img, this.x - area.width/2 + this.width/2 + offsetX, this.y - this.height/2 - offsetY);
            //context.drawImage(img, this.x - camera.width/2 + offsetX, this.y - this.height/2);
        }
        else {
            context.drawImage(img, camera.halfWidth - this.width/2 + offsetX, this.y - this.height/2 - offsetY);
        }

	},

	jump: function(){
		
		if(this.onGround && !this.inHole){
	        this.velocityY = -22.0;
	        this.onGround = false;
	        this.onBlock = false;

	        if(this.currentDirection.indexOf("L") != -1 && this.velocityX != 0){
				this.velocityX = -2.0;
			}
				
			else if(this.currentDirection.indexOf("R") != -1 && this.velocityX != 0){
				this.velocityX = 2.0;
			}
            SoundManager.play("jump");
	    }
	},

	eatApple: function(hpUP){
		
		if((this.hp += hpUP) <= 6){
			this.hp += hpUP;
		}
		else {
			this.hp = 6;
		}
		
	},

	endJump: function(){
		
		if(this.velocityY < -6.0)
        	this.velocityY = -6.0;
	},

	interact: function(){
		//console.log("PLAYER initiated Interaction.");
		if(this.collidingObject){
			//console.log("PLAYER is interacting near WorldObject '"+this.collidingObject+"'");
		}

	},
	move: function(area){

		if(this.mouvement.indexOf("L") != -1 && this.canRunLeft){
			this.canRunRight = true;
			this.x -= this.speed;
            if(this.x - this.width/2 <= 0)
                this.x = this.width/2;
			this.currentDirection = "L";
		}
			
		else if(this.mouvement.indexOf("R") != -1 && this.canRunRight){
			this.canRunLeft = true;
			this.x += this.speed;
            if(this.x >= area.width)
                this.x = area.width;      	
			this.currentDirection = "R";
		}
		
	},

	mouvementReplace: function(direction){
		this.mouvement = this.mouvement.replace(direction, "");
	},

	update: function(framerate, area){

        if(this.hp == 0) {
            alert("You are dead !!");
            window.location = "/MTLGameJam";
            location.reload();
        }

        if(this.y > area.height) {
            this.hp = 0;
        }

		if(this.recovery <= 0){
			this.recovery = 0;
		}
		else{
			this.recovery -= framerate;
		}


        if(this.attacking){
        	this.animationAttacking += framerate;
        	if(this.animationAttacking >= this.weapons[this.equippedWeapon].attackSpeed * 100){
        		this.animationAttackingIndex++;
        		if(this.animationAttackingIndex >= PlayerConstants['attackImages'][this.currentDirection].length) {
        			this.doDamage = true;
                    this.animationAttackingIndex=0;
                    this.attacking = false        				
                }                	
                this.animationAttacking = 0;       
        	}
        } 
        else{
        	this.doDamage = false;       	
        }

        
        if(this.mouvement != "") {      	
            this.animation += framerate;
            if(this.animation >= 100) {

                this.animationIndex++;
                if(this.animationIndex >= PlayerConstants['moveImages'][this.currentDirection].length) {
                    this.animationIndex=0;
                }
                this.animation = 0;
            }
        }

        if(this.inHole && this.onGround){
        	this.velocityY = 12.0;
        }   
        else {
        	this.inHole = false;
        }    

        if(!this.onBlock){
        	this.groundY = this.staticGround;
        }
        	
		this.velocityY += this.gravity;        
	    this.x += this.velocityX; 
	    if(this.x < 0){
	    	this.x = 0;
	    }   
	    this.y += this.velocityY;  

	    if(this.y > this.groundY && !this.inHole){
	        this.y = this.groundY;
	        this.velocityX = 0.0;
	        this.velocityY = 0.0;
	        this.onGround = true;
            if(this.mouvement !=  "") {
                SoundManager.play("footsteps");
            }
	    }

	    this.move(area);
	},
	takeDamage:function(dmg, sourceOfDmg){
		if(this.onGround && !this.inHole){
	        this.velocityY = -10.0;
	        this.onGround = false;

	        if(this.currentDirection.indexOf("L") != -1 && this.velocityX != 0){
				this.velocityX = -2.0;
			}
				
			else if(this.currentDirection.indexOf("R") != -1 && this.velocityX != 0){
				this.velocityX = 2.0;
			}
            SoundManager.play("jump");
	    }

		this.velocityY 	= -22;
		var knockbackDirection;
		if(sourceOfDmg.x >= this.x){
			knockbackDirection = -1;
		}
		else{
			knockbackDirection = 1
		}
		this.velocityX += (10 * dmg * knockbackDirection)
		


		this.hp -= dmg;

		this.recovery = 300;		

	}
});