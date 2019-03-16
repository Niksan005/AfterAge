import { CST } from '../CST.js';

class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }
    preload() { // Loading All Assets That Are Used


        this.load.tilemapTiledJSON('map', 'assets/map/TilemapFull.json');
        this.load.spritesheet('tileset', 'assets/map/tileset4.png', { frameWidth: 32, frameHeight: 32 });


        //this.load.image('Select', 'assets/sprites/loadingScreen/Selected.png')
        this.load.image('background', 'assets/sprites/loadingScreen/bg.png');
        this.load.image('startButt', 'assets/sprites/loadingScreen/startButton.png');

        this.load.image('flagRed', 'assets/sprites/loadingScreen/flagRed.png');
        this.load.image('flagBlue', 'assets/sprites/loadingScreen/flagBlue.png');
        this.load.image('flagGreen', 'assets/sprites/loadingScreen/flagGreen.png');
        this.load.image('flagYellow', 'assets/sprites/loadingScreen/flagYellow.png');


        this.load.spritesheet('Q', 'assets/sprites/ball.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('cd', 'assets/sprites/cooldownSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('E', 'assets/sprites/E.png', { frameWidth: 100, frameHeight: 100 });
        this.load.image('hud', 'assets/sprites/USED_HUD.png');
        this.load.spritesheet('Qskill', 'assets/sprites/Qskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Wskill', 'assets/sprites/Wskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Eskill', 'assets/sprites/Eskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Rskill', 'assets/sprites/Rskill.png', { frameWidth: 32, frameHeight: 32 });


        this.load.spritesheet('sprite', 'assets/sprites/AeraxSpriteSheet.png', { frameWidth: 50, frameHeight: 50 });

        this.team = 'red';
    }
    create() {
        console.log(this.team)
        this.bg = this.add.image(16 * 32, 9 * 32, 'background');
        this.startButt = this.add.sprite(16 * 32, 9 * 32, 'startButt')
            .setInteractive()
            .on('pointerdown', () => this.scene.start(CST.SCENES.GAME, { HeroType: 'Wizz', Name: 'TheNAme', Imobile: false, team: this.team }))
            .on('pointerover', () => console.log('Over'));

        this.flagRed = this.add.image(80, 15 * 32, 'flagRed')
            .setInteractive()
            .on('pointerdown', () => this.team = 'red');
        this.flagBlue = this.add.image(2 * 80, 15 * 32, 'flagBlue')
            .setInteractive()
            .on('pointerdown', () => this.team = 'blue');
        this.flagGreen = this.add.image(3 * 80, 15 * 32, 'flagGreen')
            .setInteractive()
            .on('pointerdown', () => this.team = 'green');
        this.flagYellow = this.add.image(4 * 80, 15 * 32, 'flagYellow')
            .setInteractive()
            .on('pointerdown', () => this.team = 'yellow');

    }
}
export { LoadScene };