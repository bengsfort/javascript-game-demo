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