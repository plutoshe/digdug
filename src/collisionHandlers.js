import {collide, min, max} from "./helper/helper.js"
var collisionHandlers = { 
	"overlap": {
	    "player": {
	    	"player_attack":
	    		function attackRetrieve(player, attack) {
	    			if (attack.canRecycle && 
	    				Math.abs(player.x - attack.x) < attack.dispearDistance && 
	    				Math.abs(player.y - attack.y) < attack.dispearDistance) {
	    			attack.setVisible(false);
	    			attack.anims.pause();
	    			attack.setVelocity(0, 0);
	    			attack.x = -10;
	    			attack.y = -10;
	    			}
	    		},
        	"full_block": 
				function overlapForBlock(player, block)
				{
					if (!block) return;
				    let blockTopLeft = block.getTopLeft();
				    let playerTopLeft = player.getTopLeft();
				    let playerBottomRight = player.getBottomRight();
				    let minPlayerX = min(playerTopLeft.x, playerBottomRight.x);
				    let maxPlayerX = max(playerTopLeft.x, playerBottomRight.x);
				    let minPlayerY = min(playerTopLeft.y, playerBottomRight.y);
				    let maxPlayerY = max(playerTopLeft.y, playerBottomRight.y);
				    // if (!collide(player, block)) return;
				    if (minPlayerY == blockTopLeft.y) {
				        if (maxPlayerX - blockTopLeft.x <= block.width &&
				            maxPlayerX - blockTopLeft.x >= block.minX) {
				            block.minX = maxPlayerX - blockTopLeft.x;
				        }
				        if (minPlayerX - blockTopLeft.x >= 0 && 
				            minPlayerX - blockTopLeft.x <= block.maxX) {
				            block.maxX = minPlayerX - blockTopLeft.x;
				        }
				    }
				   
 				    if (minPlayerX == blockTopLeft.x) {
				        if (maxPlayerY - blockTopLeft.y <= block.height && 
				            maxPlayerY - blockTopLeft.y >= block.minY) {
				            block.minY = maxPlayerY - blockTopLeft.y;
				        }
				        if (minPlayerY - blockTopLeft.y >= 0 && 
				            minPlayerY - blockTopLeft.y <= block.maxY) {
				            block.maxY = minPlayerY - blockTopLeft.y;
				        }
				    }
				    block.setCrop(
				        block.minX / block.scaleX, 
				        block.minY / block.scaleY, 
				        (block.maxX - block.minX) / block.scaleX, 
				        (block.maxY - block.minY) / block.scaleY);
				    
				},
			"camera":
				function beyondCamearaLimit(playerClass, camera) {
					var my = camera.midPoint.y;
					
					while (playerClass.dsty + playerClass.backgroundCellHeight / 2 >
					 	my + camera.height / 2 - 
					 	playerClass.cameraBoundry * playerClass.backgroundCellHeight) {
						my += playerClass.backgroundCellHeight;
					}
					while (playerClass.dsty - playerClass.backgroundCellHeight / 2 < 
						my - camera.height / 2 + 
						playerClass.cameraBoundry * playerClass.backgroundCellHeight)
						my -=  playerClass.backgroundCellHeight;
					camera.pan(camera.midPoint.x, my, 50);
				},
			"knight":
				function rescueKnight(player, knight) {
					if (Math.abs(knight.x - player.x) < player.sensitiveDistance &&
	    				Math.abs(knight.y - player.y) < player.sensitiveDistance) {
						knight.isRescue = true;
						knight.disableBody(true, true);
					}
					
				},
			"enemy":
				function encounterEnemy(player, enemy) {
					if (Math.abs(enemy.x - player.x) < player.sensitiveDistance &&
	    				Math.abs(enemy.y - player.y) < player.sensitiveDistance) {
						player.disableBody(true, true);
					}
				},
		},
		"player_attack":{
			"knight": 
				function serveAttack(attack, knight) {
					if (Math.abs(knight.x - attack.x) < attack.dispearDistance &&
	    				Math.abs(knight.y - attack.y) < attack.dispearDistance) {
						knight.disableBody(true, true);
						attack.vx = -attack.vx;
						attack.vy = -attack.vy;
						attack.setVelocity(attack.vx, attack.vy);
						attack.canRecycle = true;
					}
				},
			"enemy":
				function serveAttack(attack, enemy) {
					if (attack.vx != 0 && Math.abs(enemy.x - attack.x) < attack.dispearDistance ||
	    				 attack.vy != 0 && Math.abs(enemy.y - attack.y) < attack.dispearDistance) {
						enemy.disableBody(true, true);
						attack.vx = -attack.vx;
						attack.vy = -attack.vy;
						attack.setVelocity(attack.vx, attack.vy);
						attack.canRecycle = true;
					}

				},
		},
		"lava":{
			"rock": function(lava, rock) {
				console.log("rock meets lava");
				rock.disableBody(true, true);
			},
			"player": function(player, lava) {
				console.log("player meets lava");
				if (Math.abs(lava.x - player.x) < player.sensitiveDistance &&
	    			Math.abs(lava.y - player.y) < player.sensitiveDistance) {
					player.disableBody(true, true);
				}
			},
			"enemy": function(lava, enemy) {
				console.log("enemy meets lava");
				enemy.disableBody(true, true);
			},
			"knight": function(lava, knight) {
				console.log("knight meets lava");
				knight.disableBody(true, true);
			}
		},
		"enemy": {
        	"full_block": 
				function overlapForBlock(player, block)
				{
				    let blockTopLeft = block.getTopLeft();
				    let playerTopLeft = player.getTopLeft();
				    let playerBottomRight = player.getBottomRight();
				     //if (!collide(player, block)) return;
				    if (playerTopLeft.y == blockTopLeft.y) {
				        if (playerBottomRight.x - blockTopLeft.x <= block.width &&
				            playerBottomRight.x - blockTopLeft.x >= block.minX) {
				            block.minX = playerBottomRight.x - blockTopLeft.x;
				        }
				        if (playerTopLeft.x - blockTopLeft.x >= 0 && 
				            playerTopLeft.x - blockTopLeft.x <= block.maxX) {
				            block.maxX = playerTopLeft.x - blockTopLeft.x;
						}
				    }
				    
				    if (playerTopLeft.x == blockTopLeft.x) {
				        if (playerBottomRight.y - blockTopLeft.y <= block.height && 
				            playerBottomRight.y - blockTopLeft.y >= block.minY) {
				            block.minY = playerBottomRight.y - blockTopLeft.y;
				        }
				        if (playerTopLeft.y - blockTopLeft.y >= 0 && 
				            playerTopLeft.y - blockTopLeft.y <= block.maxY) {
				            block.maxY = playerTopLeft.y - blockTopLeft.y;
				        }
				    }
				    
				}
        },

    },

    "collision": {
    	"player": {
    		"rock": 
    			function (player, rock) {
    				if (rock.status == "falling") {
	    				player.disableBody(true, true);
	    			}
    			}
		},
		
		"enemy": {
    		"rock": 
    			function (enemy, rock) {
    				if (rock.status == "falling") {
	    				enemy.disableBody(true, true);
	    			}
    			}
    	},
    	"knight": {
    		"rock":
    			function (knight,rock) {
    				if (rock.status == "falling") {
    					knight.disableBody(true, true);
    				}
    			}
    	}
	},

}

export { collisionHandlers }

