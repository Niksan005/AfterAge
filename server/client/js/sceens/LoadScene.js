import { CST } from '../CST.js';

class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }
    preload() { // Loading All Assets That Are Used


        this.load.tilemapTiledJSON('map', 'assets/map/TestMap1.2.json');
        this.load.spritesheet('TilesetFull', 'assets/map/TilesetFull.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('32x32_map_tile_v1.0', 'assets/map/32x32_map_tile_v1.0.png', { frameWidth: 32, frameHeight: 32 });


        //this.load.image('Select', 'assets/sprites/loadingScreen/Selected.png')
        //this.load.image('backgroun', 'assets/sprites/loadingScreen/bg.png');
        this.load.image('startButt', 'assets/sprites/loadingScreen/startButton.png');

        this.load.image('flagRed', 'assets/sprites/loadingScreen/flagRed.png');
        this.load.image('flagBlue', 'assets/sprites/loadingScreen/flagBlue.png');
        this.load.image('flagGreen', 'assets/sprites/loadingScreen/flagGreen.png');
        this.load.image('flagYellow', 'assets/sprites/loadingScreen/flagYellow.png');


        this.load.spritesheet('Q', 'assets/sprites/ball.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('cdpng', 'assets/sprites/skillCD.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('cdEpng', 'assets/sprites/skillCDE.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('E', 'assets/sprites/E.png', { frameWidth: 100, frameHeight: 100 });
        this.load.image('hud', 'assets/sprites/USED_HUD.png');
        this.load.spritesheet('Qskill', 'assets/sprites/Qskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('Wskill', 'assets/sprites/Wskill.png');
        this.load.spritesheet('Eskill', 'assets/sprites/Eskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('Rskill', 'assets/sprites/Rskill.png');


        this.load.spritesheet('sprite', 'assets/sprites/AeraxSpriteSheet.png', { frameWidth: 50, frameHeight: 50 });

    }
    create() {
        this.bg = this.add.image(16 * 32, 9 * 32, 'background');
        this.startButt = this.add.sprite(16 * 32, 9 * 32, 'startButt')
            .setInteractive()
            .on('pointerdown', () => this.scene.start(CST.SCENES.GAME))
            .on('pointerover', () => console.log('Over'));

        this.flagRed = this.add.image(80, 15 * 32, 'flagRed');
        this.flagBlue = this.add.image(2 * 80, 15 * 32, 'flagBlue');
        this.flagGreen = this.add.image(3 * 80, 15 * 32, 'flagGreen');
        this.flagYellow = this.add.image(4 * 80, 15 * 32, 'flagYellow');

    }
}
export { LoadScene };