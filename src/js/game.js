var cUtils = require('./utils/utils.canvas.js'),
    $container = document.getElementById('container');

var game = function game() {
  this.viewport = cUtils.generateCanvas(800, 600);
  viewport.id = "gameViewport";

  this.context = viewport.getContext('2d');

  $container.insertBefore(viewport, $container.firstChild);

  context.font = '32px Arial';
  context.color = '#fff';
  context.fillText('It\'s dangerous to travel this route alone.', 5, 50);

  return true;
};

window.game = game();

module.exports = game;