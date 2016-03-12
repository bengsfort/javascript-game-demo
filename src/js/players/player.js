var Entity = require('../core/game.entities.js'),
    keys = require('../utils/utils.keysDown.js'),
    boundary = require('../utils/utils.math.js');

/**
 * Player module
 * The Players character entity.
 * @extends core#Entity
 */
function Player(scope, x, y) {
    var player = new Entity(scope, {
            x: x,
            y: y
        }, {
            gravity: 1,
            groundSpeed: 3.5,
            airSpeed: 1.25,
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
                }

                if ((!keys.isPressed.left && !keys.isPressed.right && !keys.isPressed.down && !keys.isPressed.up)) {
                    this.updateSprite('idle', this.state.direction);
                }

                // Bind the player to the boundary
                this.state.position.x = this.state.position.x.boundary(0, (scope.constants.width - this.state.sprite.frameWidth));
                this.state.position.y = this.state.position.y.boundary(0, (scope.constants.height - (this.state.sprite.height + 10)));
                // Not sure why the height is off by 10.....
            }
        }, {
            'idle': {
                duration: 0.4,
                framesCount: 2,
                images: {
                    left: '/assets/sprites/entities/mmx-idle-left.png',
                    right: '/assets/sprites/entities/mmx-idle-right.png'
                },
                width: 256,
                height: 140,
                default: true
            },
            'run': {
                duration: 0.1,
                framesCount: 6,
                images: {
                    left: '/assets/sprites/entities/mmx-run-left.png',
                    right: '/assets/sprites/entities/mmx-run-right.png'
                },
                width: 852,
                height: 142
            },
            'crouch': {
                duration: 0.1,
                framesCount: 2,
                images: {
                    left: '/assets/sprites/entities/mmx-crouch-left.png',
                    right: '/assets/sprites/entities/mmx-crouch-right.png'
                },
                loop: false,
                width: 256,
                height: 140
            },
            'jump': {
                duration: 0.1,
                framesCount: 1,
                images: {
                    left: '/assets/sprites/entities/mmx-jump-left.png',
                    right: '/assets/sprites/entities/mmx-jump-right.png'
                },
                loop: false,
                width: 74,
                height: 184
            },
            'fall': {
                duration: 0.1,
                framesCount: 1,
                images: {
                    left: '/assets/sprites/entities/mmx-fall-left.png',
                    right: '/assets/sprites/entities/mmx-fall-right.png'
                },
                loop: false,
                width: 108,
                height: 168
            }
        });
    
    player.handleInputs = function playerHandleInputs() {
        
    };
    
    return player;
}

module.exports = Player;