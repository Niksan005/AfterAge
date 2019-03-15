import { CST } from '../CST.js';

class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }
    create() {
        console.log('LoadSceneHere');
    }
    preload() { // Loading All Assets That Are Used
        this.load.image('Select', 'assets/sprites/loadingScreen/Selected.png')
        this.load.image('backgroun', 'assets/sprites/loadingScreen/bg.png');
        this.load.image('startButt', 'assets/sprites/loadingScreen/startButton.png');

        this.load.image('flagRed', 'assets/sprites/loadingScreen/flagRed.png');
        this.load.image('flagBlue', 'assets/sprites/loadingScreen/flagBlue.png');
        this.load.image('flagGreen', 'assets/sprites/loadingScreen/flagGreen.png');
        this.load.image('flagYellow', 'assets/sprites/loadingScreen/flagYellow.png');

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