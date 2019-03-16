
import { CST } from '../CST.js';
var layers = {}, Qs = [], QsBR = 0, ShouldListen = false;
var LeaderBoard = [];
class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.GAME
        })
    }
    init(a) {
        this.HeroType = a.HeroType;
        this.Name = a.Name;
        this.IMobile = a.IMobile;
        this.team = a.team;
        console.log(a);
    }

    create() {
        var self = this;
        ShouldListen = true;
        this.socket = io();
        //console.log(this.team);
        this.socket.emit('createPlayer', this.Name, this.HeroType, this.team);

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
                        self.scene.start(CST.SCENES.LOAD, { Name: self.Name, HeroType: self.HeroType, team: self.team, IMobile: self.IMobile });//, self.HeroType, self.Name, self.IMobile);
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

            Object.keys(players).forEach(function (id) {
                self.players.getChildren().forEach(function (player) {

                    if (players[id] && players[id].playerId === player.playerId) {
                        player.setPosition(Math.round(players[id].x), Math.round(players[id].y));
                        player.nameText.setPosition(player.x - 25, player.y - 40);

                        player.HP.setPosition(player.x - 25, player.y - 28);

                        if (player.anims.currentAnim.key != players[id].lastMoved) {
                            player.anims.play(players[id].lastMoved);
                            console.log(players[id].lastMoved);
                        }
                    };
                });
            });
        });


        this.socket.on('playerUpdates', function (players) {
            var leaderBID = [];
            leaderBID[0] = 0;
            leaderBID[1] = 0;
            leaderBID[2] = 0;
            leaderBID[3] = 0;
            leaderBID[4] = 0;

            Object.keys(players).forEach(function (id) {
                self.players.getChildren().forEach(function (player) {
                    if (players[id] && players[id].playerId === player.playerId) {
                        if (leaderBID[0] == 0 || (players[id].kills > players[leaderBID[0]] && id != leaderBID[0])) {
                            leaderBID[4] = leaderBID[3];
                            leaderBID[3] = leaderBID[2];
                            leaderBID[2] = leaderBID[1];
                            leaderBID[1] = leaderBID[0];
                            leaderBID[0] = id;
                        } else if (leaderBID[1] == 0 || (players[id].kills > players[leaderBID[1]] && id != leaderBID[1])) {
                            leaderBID[4] = leaderBID[3];
                            leaderBID[3] = leaderBID[2];
                            leaderBID[2] = leaderBID[1];
                            leaderBID[1] = id;
                        } else if (leaderBID[2] == 0 || (players[id].kills > players[leaderBID[2]] && id != leaderBID[2])) {
                            leaderBID[4] = leaderBID[3];
                            leaderBID[3] = leaderBID[2];
                            leaderBID[2] = id;
                        } else if (leaderBID[3] == 0 || (players[id].kills > players[leaderBID[3]] && id != leaderBID[3])) {
                            leaderBID[4] = leaderBID[3];
                            leaderBID[3] = id;
                        } else if (leaderBID[4] == 0 || (players[id].kills > players[leaderBID[4]] && id != leaderBID[4])) {
                            leaderBID[4] = id;
                        }
                        self.text1 && self.text1.destroy();
                        self.text1 = self.add.text(12 * 64, 1 * 32, "1 : " + players[leaderBID[0]].Name + " - " + players[leaderBID[0]].kills, { fontSize: '20px', fill: '#000', fontWeight: 'bold' }).setScrollFactor(0);;
                        if (leaderBID[1] != 0) {
                            self.text2 && self.text2.destroy();
                            self.text2 = self.add.text(12 * 64, 2 * 32, "2 : " + players[leaderBID[1]].Name + " - " + players[leaderBID[1]].kills, { fontSize: '20px', fill: '#000', fontWeight: 'bold' }).setScrollFactor(0);;
                        }
                        if (leaderBID[2] != 0) {
                            self.text3 && self.text3.destroy();
                            self.text3 = self.add.text(12 * 64, 3 * 32, "3 : " + players[leaderBID[2]].Name + " - " + players[leaderBID[2]].kills, { fontSize: '20px', fill: '#000', fontWeight: 'bold' }).setScrollFactor(0);;
                        }
                        if (leaderBID[3] != 0) {
                            self.text4 && self.text4.destroy();
                            self.text4 = self.add.text(12 * 64, 4 * 32, "4 : " + players[leaderBID[3]].Name + " - " + players[leaderBID[3]].kills, { fontSize: '20px', fill: '#000', fontWeight: 'bold' }).setScrollFactor(0);;
                        }
                        if (leaderBID[4] != 0) {
                            self.text5 && self.text5.destroy();
                            self.text5 = self.add.text(12 * 64, 5 * 32, "5 : " + players[leaderBID[4]].Name + " - " + players[leaderBID[4]].kills, { fontSize: '20px', fill: '#000', fontWeight: 'bold' }).setScrollFactor(0);;
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
                        if (playerInfo.team == 'blue') {
                            player.HP = self.add.graphics({ fillStyle: { color: 0x1111ff } });
                        } else if (playerInfo.team == 'red') {
                            player.HP = self.add.graphics({ fillStyle: { color: 0xff1111 } });
                        } else if (playerInfo.team == 'green') {
                            player.HP = self.add.graphics({ fillStyle: { color: 0x11ff11 } });
                        } else if (playerInfo.team == 'yellow') {
                            player.HP = self.add.graphics({ fillStyle: { color: 0xffa200 } });
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
                        if (InputData.Ion) self.Rskill.anims.play('staticR', true);
                        else {
                            self.Rskill.anims.play('onLLcd', true);
                            setTimeout(() => {
                                self.Rskill.anims.play('staticR', true);
                            }, 140000);
                        }
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
        self.Rskill = self.add.sprite(36 + 3 * 67, 540, 'Rskill').setScrollFactor(0).setDisplaySize(64, 64);
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
            key: 'onLLcd',
            frames: self.anims.generateFrameNumbers('cd', { start: 0, end: 24 }),
            frameRate: 0.175,
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
        self.anims.create({
            key: 'staticR',
            frames: self.anims.generateFrameNumbers('Rskill', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

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
        // R VVV
        self.anims.create({
            key: 'WrightR',
            frames: self.anims.generateFrameNumbers('sprite', { start: 64, end: 71 }),
            frameRate: 24,
            repeat: -1
        });
        self.anims.create({
            key: 'rightR',
            frames: self.anims.generateFrameNumbers('sprite', { start: 64, end: 71 }),
            frameRate: 24,
            repeat: -1
        });
        self.anims.create({
            key: 'WleftR',
            frames: self.anims.generateFrameNumbers('sprite', { start: 72, end: 79 }),
            frameRate: 24,
            repeat: -1
        });
        self.anims.create({
            key: 'leftR',
            frames: self.anims.generateFrameNumbers('sprite', { start: 72, end: 79 }),
            frameRate: 24,
            repeat: -1
        });
        self.anims.create({
            key: 'staticR',
            frames: self.anims.generateFrameNumbers('sprite', { start: 80, end: 83 }),
            frameRate: 24,
            repeat: -1
        });
        self.anims.create({
            key: 'WstaticR',
            frames: self.anims.generateFrameNumbers('sprite', { start: 80, end: 83 }),
            frameRate: 24,
            repeat: -1
        });
        player.anims.play('static');
        player.nameText = self.add.text(playerInfo.x - 25, playerInfo.y - 30, playerInfo.name, { fontSize: '10px', fill: '#000', fontWeight: 'bold' });
        player.Name = playerInfo.name;
        var rect = new Phaser.Geom.Rectangle(0, 0, playerInfo.hp / 2, 5);
        //console.log(playerInfo.hp);
        if (playerInfo.team == 'blue') {
            player.HP = self.add.graphics({ fillStyle: { color: 0x1111ff } });
        } else if (playerInfo.team == 'red') {
            player.HP = self.add.graphics({ fillStyle: { color: 0xff1111 } });
        } else if (playerInfo.team == 'green') {
            player.HP = self.add.graphics({ fillStyle: { color: 0x11ff11 } });
        } else {
            player.HP = self.add.graphics({ fillStyle: { color: 0xffa200 } });
        }
        player.HP.fillRectShape(rect);

        self.players.add(player);
    }
}
export { GameScene };
