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

        this.players = {};
        this.myID = 0;

        this.input.mouse.disableContextMenu();

        //this.drawLayers(self);
        //drawHUD
        //setCamera


        this.socket.on('createPlayer', function (InputData) {
            self.displayPlayers(self, InputData);
        });

        this.socket.on('playerUpdates', function (players) {
            for (var i in players) {
                if (self.players[i]) {
                    self.players[i].player.x = players[i].x;
                    self.players[i].player.y = players[i].y;
                }
            }
        });



        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q); // XeQ
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // Blink
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E); // XeW
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); // some R (bigger dmg and MS(movment speed))

        this.pointerAndKeys = {
            'x': this.input.activePointer.x + this.cameras.main.scrollX,// - 512,
            'y': this.input.activePointer.y + this.cameras.main.scrollY,// - 288,
            'Q': false,
            'W': false,
            'E': false,
            'R': false
        };

        this.input.on('pointerdown', function () {
            this.pointerAndKeys.x = this.input.activePointer.x + this.cameras.main.scrollX;
            this.pointerAndKeys.y = this.input.activePointer.y + this.cameras.main.scrollY;
            //console.log('pointerdown ' + this.pointerAndKeys.x + ' : ' + this.pointerAndKeys.y);
            this.socket.emit('movePlayer', this.pointerAndKeys);
        }, this);
    }

    update() {
        if (this.pointerAndKeys.Q != this.keyQ.isDown ||
            this.pointerAndKeys.W != this.keyW.isDown ||
            this.pointerAndKeys.E != this.keyE.isDown ||
            this.pointerAndKeys.R != this.keyR.isDown) {
            this.pointerAndKeys = {
                'x': this.input.activePointer.x + this.cameras.main.scrollX,
                'y': this.input.activePointer.y + this.cameras.main.scrollY,
                'Q': this.keyQ.isDown,
                'W': this.keyW.isDown,
                'E': this.keyE.isDown,
                'R': this.keyR.isDown
            };
            this.socket.emit('pressedQWER', this.pointerAndKeys);
        }
    }

    displayPlayers(self, playerInfo) {
        self.players[playerInfo.playerId] = {
            player: self.add.sprite(playerInfo.x, playerInfo.y, 'sprite'),
            playerId: playerInfo.playerId
        }
    }

    drawLayers(self) {
        self.map = self.add.tilemap('map');
        var TilesetFull = self.map.addTilesetImage('TilesetFull', 'TilesetFull');
        for (var i = 0; i < self.map.layers.length; i++) {
            //layers[self.map.layers[i].name] = self.map.createDynamicLayer(i, TilesetFull);
        }
    }
}
export { GameScene };