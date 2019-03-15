import { LoadScene } from "./sceens/LoadScene.js";
import { GameScene } from "./sceens/GameScene.js";

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 2 * 16 * 32,
    height: 2 * 9 * 32,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [
        LoadScene, GameScene
    ],
    scale: {
        mode: Phaser.Scale.ZOOM
    },

};

var game = new Phaser.Game(config);
