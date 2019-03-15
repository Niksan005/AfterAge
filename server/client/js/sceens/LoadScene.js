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


}
export { LoadScene };