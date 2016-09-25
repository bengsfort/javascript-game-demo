module.exports = {
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
};