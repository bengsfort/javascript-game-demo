var Entity = require('../core/game.entities.js'),
    keys = require('../utils/utils.keysDown.js'),
    boundary = require('../utils/utils.math.js'),
    playerSprites = require('./player.sprites.js');

/**
 * Player module
 * The Players character entity.
 * @extends core#Entity
 */
function Player(scope, x, y) {
    console.log(playerSprites);
    var player = new Entity(scope, {
            x: x,
            y: y
        }, {
            gravity: 1,
            groundSpeed: 3.5,
            airSpeed: 1,
            startDirection: 'right',
            update: function playerUpdate() {
                this.handleInputs();
                // Check if keys are pressed, if so, update the players position.
                if (keys.isPressed.left && !keys.isPressed.down) {
                    if (this.state.isGrounded) {
                        this.state.position.x -= this.attributes.groundSpeed;
                        this.updateSprite('run', 'left');
                    } else {
                        this.state.position.x -= this.attributes.airSpeed;
                    }
                }

                if (keys.isPressed.right && !keys.isPressed.down) {
                    if (this.state.isGrounded) {
                        this.state.position.x += this.attributes.groundSpeed;
                        this.updateSprite('run', 'right');
                    } else {
                        this.state.position.x += this.attributes.airSpeed;
                    }
                }
                
                if (keys.isPressed.down) {
                    this.updateSprite('crouch', this.state.direction);
                }
                
                if (keys.isPressed.up) {
                    this.updateSprite('jump', this.state.direction);
                    this.state.position.y -= 7 * 3;
                    this.state.isGrounded = false;
                }

                if ((!keys.isPressed.left && !keys.isPressed.right && !keys.isPressed.down && !keys.isPressed.up)) {
                    this.updateSprite('idle', this.state.direction);
                }
            }
        }, playerSprites);
    
    player.handleInputs = function playerHandleInputs() {
        
    };
    
    return player;
}

module.exports = Player;