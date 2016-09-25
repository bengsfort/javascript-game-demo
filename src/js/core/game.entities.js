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
	
	entity.updateQueue = {};
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
		this.state.position.x = this.state.position.x.boundary(0, (scope.constants.width - this.state.sprite.frameWidth));
		this.state.position.y = this.state.position.y.boundary(0, (scope.constants.height - (this.state.sprite.height + 10)));
		entity.calculateUpdates();
		entity.state.sprite.update();
	};

	entity.render = function entityRender() {
		if (opts.hasOwnProperty('render')) {
			opts.render.call(entity, scope);
		}
		entity.state.sprite.render(entity.state.position.x, entity.state.position.y);
	};

	entity.applyGravity = function entityApplyGravity() {
		var gravitationalConstant = entity.constants.gravityForce,
			entityMass = entity.attributes.gravity * 0.5,
			floorMass = 400,
			distance = entity.state.position.y - (scope.constants.height + 200),
			gravitationalPull = gravitationalConstant * (entityMass * floorMass / Math.pow(distance, 2)) * 1500;
		console.log('gravitational pull', gravitationalPull);
		entity.state.position.y += gravitationalPull;
	};

	entity.calculateUpdates = function entityCalculateUpdates() {
		
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