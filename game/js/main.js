var FULLSCREEN = false;
var WIDTH = FULLSCREEN ? window.innerWidth * window.devicePixelRatio : 800,
  HEIGHT = FULLSCREEN ? window.innerHeight * window.devicePixelRatio : 600;
var gameContainer = document.getElementById("gameContainer");
var config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: gameContainer
  // scene: {
  //   preload: preload,
  //   create: create
  // }
};
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "gameContainer");

game.state.add("boot", STATE_BOOT);
game.state.add("load", STATE_LOAD);
game.state.add("game", STATE_GAME);

game.state.start("boot");