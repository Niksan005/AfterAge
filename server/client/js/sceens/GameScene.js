import { CST } from '../CST.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        })
    }
    init(HeroType, Name, IMobile, team) {
        this.HeroType = HeroType;
        this.Name = Name;
        this.IMobile = IMobile;
        this.team = team;
    }

    create() {
        var self = this;
        this.socket = io();
        this.socket.emit('createPlayer', this.Name, this.HeroType, this.team);

        this.players = this.add.group();
        this.name = this.add.group();
        this.myID = 0;

        this.input.mouse.disableContextMenu();

        //drawLayers
        //drawHUD
        //setCamera


        this.socket.on('createPlayer', function (InputData) {
            self.displayPlayers(self, InputData);
        });

    }


    displayPlayers(self, playerInfo) {
        const player = self.add.sprite(playerInfo.x, playerInfo.y, 'sprite').setDisplaySize(50, 50);
        player.playerId = playerInfo.playerId;
        self.players.add(player);
    }
}
export { GameScene };