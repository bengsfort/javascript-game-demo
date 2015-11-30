var cUtils = require('./utils/utils.canvas.js'),
    $container = document.getElementById('container');

// Create base game class
var game = function game() {
  this.viewport = cUtils.generateCanvas(800, 600);
  viewport.id = "gameViewport";

  $container.insertBefore(viewport, $container.firstChild);

  this.context = viewport.getContext('2d');

  context.font = '32px Arial';
  context.fillText('It\'s dangerous to travel this route alone.', 5, 50, 800);

  return this;
};

// Instantiate the game in a global
window.game = game();

// Export the game as a module
module.exports = game;