(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Core Entities module
 * Contains the base Entity class.
 */
var keys = require('../utils/utils.keysDown.js'),
	extend = require('../utils/utils.extend.js'),
	Sprite = require('./game.sprites.js');

function Entity(scope, coords, opts, sprites) {
	var entity = {};

	// Initialize state
	entity.state = {
		position: {
			x: coords.x,
			y: coords.y
		},
		action: false,
		direction: opts.startDirection || 'right',
		isGrounded: true
	};

	entity.baseAttributes = {
		gravity: opts.gravity || 1,
		groundSpeed: opts.groundSpeed || 1,
		airSpeed: opts.airSpeed || 0.25
	};
	// attributes will be used as the _active_ stats.
	// ie: buffed / nerfed stats due to a power up
	entity.attributes = extend({}, entity.baseAttributes);

	entity.constants = {
		gravityForce: 7
	};

	entity.updateDirection = function entityUpdateDirection(direction) {
		entity.state.direction = direction;
	};

	entity.updateSprite = function entityUpdateSprite(action, direction) {
		// Is direction even needed?
		entity.updateDirection(direction);
		
		if (action !== entity.state.action) {
			entity.state.action = action;
			entity.state.sprite = entity.sprites[action][direction];
		}
	};

	entity.update = function entityUpdate() {
		if (opts.hasOwnProperty('update')) {
			opts.update.call(entity, scope);
		}
		entity.applyGravity();
		entity.state.sprite.update();
	};

	entity.render = function entityRender() {
		if (opts.hasOwnProperty('render')) {
			opts.render.call(entity, scope);
		}
		entity.state.sprite.render(entity.state.position.x, entity.state.position.y);
	};

	entity.applyGravity = function entityApplyGravity() {
		entity.state.position.y += entity.attributes.gravity * entity.constants.gravityForce;
	};

	var fps = scope.constants.targetFps,
			ctx = scope.context;

	// Initialize sprites
	entity.sprites = {};

	for (var action in sprites) {
		entity.sprites[action] = {};
		for (var direction in sprites[action].images) {
			entity.sprites[action][direction] = new Sprite(extend({
				fps: fps,
				context: ctx,
				image: sprites[action].images[direction]
			}, sprites[action]));
			
			// If this is the default sprite, store it in the state
			if (entity.sprites[action][direction].hasOwnProperty('default')) {
				if (entity.sprites[action][direction].default !== false && direction === entity.state.direction) {
					entity.state.sprite = entity.sprites[action][direction];
				}
			}
		} // end direction loop
	} // end action loop

	return entity;
}

module.exports = Entity;
},{"../utils/utils.extend.js":9,"../utils/utils.keysDown.js":10,"./game.sprites.js":4}],2:[function(require,module,exports){
/** Game Loop Module
 * This module contains the game loop, which handles
 * updating the game state and re-rendering the canvas
 * (using the updated state) at the configured FPS.
 */
function gameLoop ( scope ) {
    var loop = this;

    // Initialize timer variables so we can calculate FPS
    var fps = scope.constants.targetFps,
        fpsInterval = 1000 / fps,
        before = window.performance.now(),
        // Set up an object to contain our alternating FPS calculations
        cycles = {
            new: {
                frameCount: 0,
                startTime: before,
                sinceStart: 0
            },
            old: {
                frameCount: 0,
                startTime: before,
                sineStart: 0
            }
        },
        // Alternating Frame Rate vars
        resetInterval = 5,
        resetState = 'new';

    loop.fps = 0;

    // Main game rendering loop
    loop.main = function mainLoop( tframe ) {
        // Request a new Animation Frame
        // setting to `stopLoop` so animation can be stopped via
        // `window.cancelAnimationFrame( loop.stopLoop )`
        loop.stopLoop = window.requestAnimationFrame( loop.main );

        // How long ago since last loop?
        var now = tframe,
            elapsed = now - before,
            activeCycle, targetResetInterval;

        // If it's been at least our desired interval, render
        if (elapsed > fpsInterval) {
            // Set before = now for next frame, also adjust for 
            // specified fpsInterval not being a multiple of rAF's interval (16.7ms)
            // ( http://stackoverflow.com/a/19772220 )
            before = now - (elapsed % fpsInterval);

            // Increment the vals for both the active and the alternate FPS calculations
            for (var calc in cycles) {
                ++cycles[calc].frameCount;
                cycles[calc].sinceStart = now - cycles[calc].startTime;
            }

            // Choose the correct FPS calculation, then update the exposed fps value
            activeCycle = cycles[resetState];
            loop.fps = Math.round(1000 / (activeCycle.sinceStart / activeCycle.frameCount) * 100) / 100;

            // If our frame counts are equal....
            targetResetInterval = (cycles.new.frameCount === cycles.old.frameCount 
                                   ? resetInterval * fps // Wait our interval
                                   : (resetInterval * 2) * fps); // Wait double our interval

            // If the active calculation goes over our specified interval,
            // reset it to 0 and flag our alternate calculation to be active
            // for the next series of animations.
            if (activeCycle.frameCount > targetResetInterval) {
                cycles[resetState].frameCount = 0;
                cycles[resetState].startTime = now;
                cycles[resetState].sinceStart = 0;

                resetState = (resetState === 'new' ? 'old' : 'new');
            }

            // Update the game state
            scope.state = scope.update( now );
            // Render the next frame
            scope.render();
        }
    };

    // Start off main loop
    loop.main();

    return loop;
}

module.exports = gameLoop;
},{}],3:[function(require,module,exports){
/** Game Render Module
 * Called by the game loop, this module will
 * perform use the global state to re-render
 * the canvas using new data. Additionally,
 * it will call all game entities `render`
 * methods.
 */
function gameRender( scope ) {
    // Setup globals
    var w = scope.constants.width,
        h = scope.constants.height;

    return function render() {
        // Clear out the canvas
        scope.context.clearRect(0, 0, w, h);
        
        // Spit out some text
        scope.context.font = '32px Arial';
        scope.context.fillStyle = '#fff';
        scope.context.fillText('It\'s dangerous to travel this route alone.', 5, 50);

        // If we want to show the FPS, then render it in the top right corner.
        if (scope.constants.showFps) {
            scope.context.fillStyle = '#ff0';
            scope.context.fillText(scope.loop.fps, w - 100, 50);
        }

        // If there are entities, iterate through them and call their `render` methods
        if (scope.state.hasOwnProperty('entities')) {
            var entities = scope.state.entities;
            // Loop through entities
            for (var entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].render();
            }
        }
    }
}

module.exports = gameRender;
},{}],4:[function(require,module,exports){
/**
 * Core sprites module
 */
function Sprite(options) {
	var sprite = {},
		duration = options.duration || 1,
		fps = options.fps || 60,
		loop = options.hasOwnProperty('loop') ? options.loop : true,
		frame = 0,
		tick = 0,
		ticksPerFrame = ticksPerFrame || fps * duration,
		framesCount = options.framesCount || 1;

	var spriteImg = new Image();
	spriteImg.src = options.image;

	sprite.image = spriteImg;
	sprite.width = options.width;
	sprite.height = options.height;
	sprite.ctx = options.context;
	sprite.frameWidth = sprite.width / framesCount;

	sprite.render = function spriteRender(x, y) {
		this.ctx.drawImage(
			this.image,
			frame * this.width / framesCount, 0, // source x, source y
			this.frameWidth, this.height, // source w, source h
			x || 0, y || 0, // destination x, y on the canvas
			this.frameWidth, this.height // destination w, destination h
		);
	};

	sprite.update = function spriteUpdate() {
		tick += 1;
		if (tick > ticksPerFrame) {
			tick = 0;
			if (frame < framesCount - 1) {
				frame += 1;
			} else {
				if (loop) {
					frame = 0;
				}
			}
		}
	};

	return sprite;
}

module.exports = Sprite;
},{}],5:[function(require,module,exports){
/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */
function gameUpdate ( scope ) {
    return function update( tFrame ) {
        var state = scope.state || {};

        // If there are entities, iterate through them and call their `update` methods
        if (state.hasOwnProperty('entities')) {
            var entities = state.entities;
            // Loop through entities
            for (var entity in entities) {
                // Fire off each active entities `render` method
                entities[entity].update();
            }
        }

        return state;
    }   
}

module.exports = gameUpdate;
},{}],6:[function(require,module,exports){
    // Modules
var gameLoop = require('./core/game.loop.js'),
    gameUpdate = require('./core/game.update.js'),
    gameRender = require('./core/game.render.js'),
    // Entities
    playerEnt = require('./players/player.js'),
    // Utilities
    cUtils = require('./utils/utils.canvas.js'), // require our canvas utils
    $container = document.getElementById('container');

function Game(w, h, targetFps, showFps) {
    var that;

    // Setup some constants
    this.constants = {
        width: w,
        height: h,
        targetFps: targetFps,
        showFps: showFps
    };

    // Instantiate an empty state object
    this.state = {};

  // Generate a canvas and store it as our viewport
    this.viewport = cUtils.generateCanvas(w, h);
    this.viewport.id = "gameViewport";

    // Get and store the canvas context as a global
    this.context = this.viewport.getContext('2d');

    // Append viewport into our container within the dom
    $container.insertBefore(this.viewport, $container.firstChild);

    // Instantiate core modules with the current scope
    this.update = gameUpdate( this );
    this.render = gameRender( this );
    this.loop = gameLoop( this );

    that = this;

    var createPlayer = function createPlayer() {
        that.state.entities = that.state.entities || {};
        that.state.entities.player = new playerEnt(that, 128, (h - 160));
    }();

    return this;
}

// Instantiate a new game in the global scope at 800px by 600px
window.game = new Game(800, 600, 60, true);

module.exports = game;
},{"./core/game.loop.js":2,"./core/game.render.js":3,"./core/game.update.js":5,"./players/player.js":7,"./utils/utils.canvas.js":8}],7:[function(require,module,exports){
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
},{"../core/game.entities.js":1,"../utils/utils.keysDown.js":10,"../utils/utils.math.js":11}],8:[function(require,module,exports){
module.exports = {
    /** Determine the proper pixel ratio for the canvas */
    getPixelRatio : function getPixelRatio(context) {
      console.log('Determining pixel ratio.');
      var backingStores = [
        'webkitBackingStorePixelRatio',
        'mozBackingStorePixelRatio',
        'msBackingStorePixelRatio',
        'oBackingStorePixelRatio',
        'backingStorePixelRatio'
      ];

      var deviceRatio = window.devicePixelRatio;

      // Iterate through our backing store props and determine the proper backing ratio.
      var backingRatio = backingStores.reduce(function(prev, curr) {
        return (context.hasOwnProperty(curr) ? context[curr] : 1);
      });

      // Return the proper pixel ratio by dividing the device ratio by the backing ratio
      return deviceRatio / backingRatio;
    },

    /** Generate a canvas with the proper width / height
     * Based on: http://www.html5rocks.com/en/tutorials/canvas/hidpi/
     */
    generateCanvas : function generateCanvas(w, h) {
      console.log('Generating canvas.');

      var canvas = document.createElement('canvas'),
          context = canvas.getContext('2d');
      // Pass our canvas' context to our getPixelRatio method
      var ratio = this.getPixelRatio(context);

      // Set the canvas' width then downscale via CSS
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      canvas.style.width = w +'px';
      canvas.style.height = h +'px';
      // Scale the context so we get accurate pixel density
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      return canvas;
    }
};
},{}],9:[function(require,module,exports){
/**
 * Native JS extend utility
 * via @ChrisFerdinandi
 */
function utilsExtendObj() {
	var result = {},
		length = arguments.length;

	var mergeObject = function (obj) {
		for (var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				result[prop] = obj[prop];
			}
		}
	};

	for (var i = 0; i < length; i++) {
		mergeObject(arguments[i]);
	}

	return result;
}

module.exports = utilsExtendObj;
},{}],10:[function(require,module,exports){
/** keysDown Utility Module
 * Monitors and determines whether a key 
 * is pressed down at any given moment.
 * Returns getters for each key.
 */
function keysDown() {
    this.isPressed = {};

    var left, right, up, down;

    // Set up `onkeydown` event handler.
    document.onkeydown = function (ev) {
        if (ev.keyCode === 39) { right = true; }
        if (ev.keyCode === 37) { left = true; }
        if (ev.keyCode === 38) { up = true; }
        if (ev.keyCode === 40) { down = true; }
    };

    // Set up `onkeyup` event handler.
    document.onkeyup = function (ev) {
        if (ev.keyCode === 39) { right = false; }
        if (ev.keyCode === 37) { left = false; }
        if (ev.keyCode === 38) { up = false; }
        if (ev.keyCode === 40) { down = false; }
    };

    // Define getters for each key
    // * Not strictly necessary. Could just return
    // * an object literal of methods, the syntactic
    // * sugar of `defineProperty` is just so much sweeter :)
    Object.defineProperty(this.isPressed, 'left', {
        get: function() { return left; },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this.isPressed, 'right', {
        get: function() { return right; },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this.isPressed, 'up', {
        get: function() { return up; },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(this.isPressed, 'down', {
        get: function() { return down; },
        configurable: true,
        enumerable: true
    });

    return this;
}

module.exports = keysDown();
},{}],11:[function(require,module,exports){
/** 
 * Number.prototype.boundary
 * Binds a number between a minimum and a maximum amount.
 * var x = 12 * 3;
 * var y = x.boundary(3, 23);
 * y === 23
 */

var Boundary = function numberBoundary(min, max, num) {
    return typeof num !== "undefined"
    	? Math.min( Math.max(num, min), max )
    	: Math.min( Math.max(this, min), max );
};

// Expose methods
Number.prototype.boundary = Boundary;
module.exports = Boundary;
},{}]},{},[6]);
