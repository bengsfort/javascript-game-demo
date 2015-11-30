/** Game Update Module
 * Called by the game loop, this module will
 * perform any state calculations / updates
 * to properly render the next frame.
 */
function gameUpdate ( scope ) {
    return function update( tFrame ) {
        var state = scope.state || {};

        // Mutate the state var, then update the games state
        scope.state = state;

        return state;
    }   
}

module.exports = gameUpdate;