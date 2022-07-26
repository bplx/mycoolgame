const WIDTH = 800;
const HEIGHT = 600;

import { Game } from "./gameScene.mjs";

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
    scene: [Game],
};

var game = new Phaser.Game(config);
//game.scene.start("awesomeGame", Game, true);
