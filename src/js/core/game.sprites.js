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