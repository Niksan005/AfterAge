import { CST } from '../CST.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        })
    }
}
export { GameScene };