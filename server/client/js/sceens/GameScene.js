
import { CST } from '../CST.js';
var layers = {}, Qs = [], QsBR = 0, ShouldListen = false;
class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        })
    }
    init(HeroType, Name, IMobile) {
        this.HeroType = HeroType;
        this.Name = Name;
        this.IMobile = IMobile;
    }

    create() {
        var self = this;
        ShouldListen = true;
        this.socket = io();
        this.socket.emit('createPlayer', this.Name, this.HeroType);

        this.players = this.add.group();
        this.name = this.add.group();
        this.myID = 0;

        this.input.mouse.disableContextMenu();

        this.drawLayers(self);
        this.drawHUD(self);
        this.setCamera(self);

        /// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX|
        /// IO = conection with the server.js                                                            |
        /// IO CONECTION XXXXXX IO CONECTION XXXXXX IO CONECTION XXXXXX IO CONECTION XXXXXX IO CONECTION |
        /// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX|

        this.socket.on('currentPlayers', function (players) {
            if (ShouldListen) {
                Object.keys(players).forEach(function (id) {
                    self.displayPlayers(self, players[id]);
                    if (players[id].playerId === self.socket.id) {
                        self.players.getChildren().forEach(function (player) {
                            if (self.socket.id === player.playerId) {
                                self.cameras.main.startFollow(player);
                                self.myID = player.playerId;
                            }
                        });
                    }
                });
            }
        });
        this.socket.on('newPlayer', function (playerInfo) {
            if (ShouldListen) {
                self.displayPlayers(self, playerInfo);
            }
        });
        this.socket.on('disconnect', function (playerId) {

            if (ShouldListen) {
                self.players.getChildren().forEach(function (player) {
                    if (playerId === player.playerId && player.playerId == self.myID) {
                        ShouldListen = false;
                        self.socket.disconnect();
                        self.scene.start(CST.SCENES.LOAD);//, self.HeroType, self.Name, self.IMobile);
                        return;
                    }
                    if (playerId === player.playerId) {
                        player.HP.destroy();
                        player.nameText.destroy();
                        player.destroy();
                    }
                });
            }
        });
        this.socket.on('playerUpdates', function (players) {
            /*if (ShouldListen) {
                if (self.players[player.playerId]) {
                    self.players[player.playerId].player.setPosition(Math.round(players[id].x), Math.round(players[id].y));
                    self.players[player.playerId].player.nameText.setPosition(player.x - 25, player.y - 40);

                    self.players[player.playerId].player.HP.setPosition(self.players[player.playerId].player.x - 25, self.players[player.playerId].player.y - 28);

                    if (self.players[player.playerId].player.anims.currentAnim.key != self.players[player.playerId].lastMoved) {
                        self.players[player.playerId].player.anims.play(players[player.playerId].lastMoved);
                    }
                }
            }*/
            Object.keys(players).forEach(function (id) {
                self.players.getChildren().forEach(function (player) {
                    if (players[id] && players[id].playerId === player.playerId) {
                        player.setPosition(Math.round(players[id].x), Math.round(players[id].y));
                        player.nameText.setPosition(player.x - 25, player.y - 40);

                        player.HP.setPosition(player.x - 25, player.y - 28);

                        if (player.anims.currentAnim.key != players[id].lastMoved) {
                            player.anims.play(players[id].lastMoved);
                        }
                    }
                });
            });

        });

        this.socket.on('updateHP', function (playerInfo) {
            if (ShouldListen) {
                self.players.getChildren().forEach(function (player) {
                    if (playerInfo.playerId === player.playerId) {
                        player.HP.destroy();
                        var rect = new Phaser.Geom.Rectangle(0, 0, playerInfo.hp / 2, 5);
                        //console.log(playerInfo.hp);
                        if (playerInfo.playerId == self.socket.id) {
                            player.HP = self.add.graphics({ fillStyle: { color: 0x1111ff } });
                        } else {
                            player.HP = self.add.graphics({ fillStyle: { color: 0xff1111 } });
                        }
                        player.HP.fillRectShape(rect);
                    }
                });
            }
        });
        this.socket.on('createQ', function (startxy, endxy) {
            if (ShouldListen) {
                Qs[QsBR] = self.physics.add.sprite(startxy.x, startxy.y, 'Q').setOrigin(0.5, 0.5).setDisplaySize(64, 64);
                //console.log(Qs[QsBR].body.angle);
                Qs[QsBR].rotation = Phaser.Math.Angle.Between(startxy.x, startxy.y, endxy.x, endxy.y);
                //console.log(Qs[QsBR].body.angle);
                self.anims.create({
                    key: 'Q',
                    frames: self.anims.generateFrameNumbers('Q', { start: 0, end: 24 }),
                    frameRate: 24,
                    repeat: 10
                });
                Qs[QsBR].anims.play('Q', true);
                self.physics.moveToObject(Qs[QsBR], { x: endxy.x, y: endxy.y }, 400);
                QsBR += 1;
            }
        });
        this.socket.on('removeQ', function (index) {
            if (ShouldListen) {
                if (Qs[index]) Qs[index].destroy();
                for (var i = index; i < QsBR - 1; i += 1) {
                    Qs[i] = Qs[i + 1];
                }
                QsBR -= 1;
            }
        });
        this.socket.on('Exy', function (x, y) {

            if (ShouldListen) {
                const E = self.add.sprite(x, y, 'E').setOrigin(0.5, 0.5).setDisplaySize(125, 125);
                self.anims.create({
                    key: 'E',
                    frames: self.anims.generateFrameNumbers('E', { start: 0, end: 24 }),
                    frameRate: 24,
                    repeat: -1
                });
                E.anims.play('E', true);
                setTimeout(function () { E.destroy(); }, 1000);

            }
        });
        this.socket.on('cdChange', function (InputData) {

            if (ShouldListen) {
                if (self.myID != 0 && self.myID == InputData.id) {
                    var skill = InputData.skill;
                    if (skill == 'Q') {
                        if (InputData.Ion) self.Qskill.anims.play('staticQ', true);
                        else {
                            self.Qskill.anims.play('oncd', true);
                            setTimeout(() => {
                                self.Qskill.anims.play('staticQ', true);
                            }, 7000);
                        }
                    }
                    if (skill == 'W') {
                        if (InputData.Ion) self.Wskill.anims.play('staticW', true);
                        else {
                            self.Wskill.anims.play('onLcd', true);
                            setTimeout(() => {
                                self.Wskill.anims.play('staticW', true);
                            }, 14000);
                        }
                    }
                    if (skill == 'E') {
                        if (InputData.Ion) self.Eskill.anims.play('staticE', true);
                        else {
                            self.Eskill.anims.play('oncd', true);
                            setTimeout(() => {
                                self.Eskill.anims.play('staticE', true);
                            }, 7000);
                        }
                    }
                    if (skill == 'R') {
                        self.Rskill.x = InputData.Ion ? 36 + 3 * 67 : - 100;
                        self.Rskill.y = 540;
                    }
                }
            }
        });
        /// |XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-|
        /// | END OF IO CON   XXXXXXXXX END OF IO CON   XXXXXXXXX END OF IO CON   XXXXXXXXX END OF IO CON   XXXXXXXXX END OF IO CON   |
        /// | KEY DECLARATION XXXXXXXXX KEY DECLARATION XXXXXXXXX KEY DECLARATION XXXXXXXXX KEY DECLARATION XXXXXXXXX KEY DECLARATION |
        /// |XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-|

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
        /// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-
        /// UPDATE XXXXXX UPDATE XXXXXX UPDATE XXXXXX UPDATE XXXXXX UPDATE XXXXXX UPDATE XXXXXX UPDATE XXXXXX UPDATE XXXXXX UPDATE XXXXXX UPDATE
        /// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-
        /// FUNCTIONS XXXXXX FUNCTIONS XXXXXX FUNCTIONS XXXXXX FUNCTIONS XXXXXX FUNCTIONS XXXXXX FUNCTIONS XXXXXX FUNCTIONS XXXXXX FUNCTIONS
        /// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-

    }

    drawLayers(self) {
        self.map = self.make.tilemap({ key: 'map' });
        var tileset = self.map.addTilesetImage('tileset4', 'tileset');
        layers[0] = self.map.createStaticLayer("base_layer", tileset, 0, 0);
        layers[1] = self.map.createStaticLayer("partial_collision_layer", tileset, 0, 0);
        layers[2] = self.map.createStaticLayer("full_collision_layer", tileset, 0, 0);



    }
    drawHUD(self) {
        self.hud = self.add.image(138, 576 - 36, 'hud').setScrollFactor(0).setDisplaySize(138 * 2, 36 * 2);
        self.Qskill = self.add.sprite(36 + 0 * 67, 540, 'Qskill').setScrollFactor(0).setDisplaySize(64, 64);
        self.Wskill = self.add.sprite(36 + 1 * 67, 540, 'Wskill').setScrollFactor(0).setDisplaySize(64, 64);
        self.Eskill = self.add.sprite(36 + 2 * 67, 540, 'Eskill').setScrollFactor(0).setDisplaySize(64, 64);
        self.anims.create({
            key: 'oncd',
            frames: self.anims.generateFrameNumbers('cd', { start: 0, end: 24 }),
            frameRate: 3.5,
            repeat: -1
        });
        self.anims.create({
            key: 'onLcd',
            frames: self.anims.generateFrameNumbers('cd', { start: 0, end: 24 }),
            frameRate: 1.75,
            repeat: -1
        });
        self.anims.create({
            key: 'staticQ',
            frames: self.anims.generateFrameNumbers('Qskill', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        self.anims.create({
            key: 'staticW',
            frames: self.anims.generateFrameNumbers('Wskill', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });


        self.anims.create({
            key: 'staticE',
            frames: self.anims.generateFrameNumbers('Eskill', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        self.Rskill = self.add.image(36 + 3 * 67, 540, 'Rskill').setScrollFactor(0).setDisplaySize(64, 64);
    }
    setCamera(self) {

        self.cameras.main.setBounds(0, 0, self.map.widthInPixels, self.map.heightInPixels);
        self.fullScreen = self.add.image(32, 32, 'fullScreen').setScrollFactor(0);
        self.fullScreen.setInteractive().on('pointerdown', function () {
            if (self.scene.scale.isFullscreen) {
                self.scene.scale.stopFullscreen();
            } else {
                self.scene.scale.startFullscreen();
            }
        });
    }

    displayPlayers(self, playerInfo) {
        const player = self.add.sprite(playerInfo.x, playerInfo.y, 'sprite').setOrigin(0.5, 0.5).setDisplaySize(50, 50);
        player.playerId = playerInfo.playerId;
        self.anims.create({
            key: 'left',
            frames: self.anims.generateFrameNumbers('sprite', { start: 8, end: 15 }),
            frameRate: 12,
            repeat: -1
        });

        self.anims.create({
            key: 'right',
            frames: self.anims.generateFrameNumbers('sprite', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
        self.anims.create({
            key: 'static',
            frames: self.anims.generateFrameNumbers('sprite', { start: 16, end: 19 }),
            frameRate: 4,
            repeat: -1
        });
        self.anims.create({
            key: 'stunned',
            frames: self.anims.generateFrameNumbers('sprite', { start: 20, end: 43 }),
            frameRate: 12,
            repeat: -1
        });
        self.anims.create({
            key: 'Wstatic',
            frames: self.anims.generateFrameNumbers('sprite', { start: 60, end: 63 }),
            frameRate: 12,
            repeat: -1
        });
        self.anims.create({
            key: 'Wleft',
            frames: self.anims.generateFrameNumbers('sprite', { start: 52, end: 59 }),
            frameRate: 12,
            repeat: -1
        });
        self.anims.create({
            key: 'Wright',
            frames: self.anims.generateFrameNumbers('sprite', { start: 44, end: 51 }),
            frameRate: 24,
            repeat: -1
        });
        player.anims.play('static');
        player.nameText = self.add.text(playerInfo.x - 25, playerInfo.y - 30, 'The PL-Name', { fontSize: '10px', fill: '#000', fontWeight: 'bold' });
        var rect = new Phaser.Geom.Rectangle(0, 0, playerInfo.hp / 2, 5);
        //console.log(playerInfo.hp);
        if (playerInfo.playerId == self.socket.id) {
            player.HP = self.add.graphics({ fillStyle: { color: 0x1111ff } });
        } else {
            player.HP = self.add.graphics({ fillStyle: { color: 0xff1111 } });
        }
        player.HP.fillRectShape(rect);

        self.players.add(player);
    }
}
export { GameScene };
