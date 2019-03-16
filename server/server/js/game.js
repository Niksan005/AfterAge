const playersData = {};
var layers = {};

const WizzQcd = 400;
const WizzWcd = 800;
const WizzEcd = 400;
const WizzRcd = 8000;
const EstunDuration = 50;
const rangeE = 200;

var Qs = [];
var QsBR = 0;

const config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    width: 24 * 32,
    height: 17 * 32,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoFocus: false
};


function preload() {


    this.load.tilemapTiledJSON('map', 'assets/map/TilemapFull.json');
    this.load.spritesheet('tileset', 'assets/map/tileset4.png', { frameWidth: 32, frameHeight: 32 });

    this.load.image('sprite', 'assets/sprites/Aerax.png');

}
function create() {
    const self = this;

    this.players = this.physics.add.group();

    self.map = self.make.tilemap({ key: 'map' });
    var tileset = self.map.addTilesetImage('tileset4', 'tileset');
    layers[0] = self.map.createStaticLayer("base_layer", tileset, 0, 0);
    layers[1] = self.map.createStaticLayer("partial_collision_layer", tileset, 0, 0);
    layers[2] = self.map.createStaticLayer("full_collision_layer", tileset, 0, 0);

    layers[1].setCollisionBetween(1, 2000);
    layers[2].setCollisionBetween(1, 2000);


    io.on('connection', function (socket) {


        socket.on('createPlayer', function (name, heroType, team) {

            console.log('a user connected');
            // create a new player and add it to our players object
            var startX = Math.floor(Math.random() * 1400) + 600;
            var startY = Math.floor(Math.random() * 1400) + 600;
            playersData[socket.id] = {
                x: startX,
                y: startY,
                endX: startX,
                endY: startY,
                playerId: socket.id,
                name: name,
                heroType: heroType,
                team: team,
                Qcd: 0,
                Qrange: 100,
                QstateSend: true,
                Wcd: 0,
                Wrange: 500,
                WstateSend: true,
                Ecd: 0,
                Erange: 1000,
                EstateSend: true,
                Rcd: 0,
                Rrange: 0,
                RstateSend: true,
                Dmg: 15,
                hp: 100,
                MSpeed: 100,
                Istationary: 0,
                player: null,
                lastMoved: 'static',
                InR: false,
            };



            addPlayer(self, playersData[socket.id]);
            socket.emit('currentPlayers', playersData);
            for (var i = 0; i < QsBR; i++) {
                socket.emit('createQ', { x: Qs[i].ball.x, y: Qs[i].ball.y }, { x: Qs[i].endX, y: Qs[i].endY });
            }
            socket.broadcast.emit('newPlayer', playersData[socket.id]);

        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
            if (socket.id in playersData) {
                removePlayer(self, socket.id);
                delete playersData[socket.id];
                io.emit('disconnect', socket.id);
            }
        });

        // when a player moves, update the player data
        socket.on('movePlayer', function (inputData) {
            //console.log(inputData);
            handlePlayerInput(self, socket.id, inputData);
        });


        socket.on('pressedQWER', function (inputData) {
            handleQWERpresses(self, socket.id, inputData);
        });
    });

    UpdateXYToPlayers();

}

function update() {
    this.players.getChildren().forEach((player) => {
        //console.log(playersData[player.playerId].QstateSend);

        if (Phaser.Math.Distance.Between(player.x, player.y, playersData[player.playerId].endX, playersData[player.playerId].endY) < 5) {
            player.setVelocityX(0);
            player.setVelocityY(0);
            playersData[player.playerId].player.setVelocityX(0);
            playersData[player.playerId].player.setVelocityY(0);
            if (playersData[player.playerId].MSpeed == 100) {
                playersData[player.playerId].lastMoved = 'static';
            } else {
                playersData[player.playerId].x = player.x;
                playersData[player.playerId].y = player.y;

                playersData[player.playerId].lastMoved = 'Wstatic';
            }
        }

        if (playersData[player.playerId].Qcd > 0) playersData[player.playerId].Qcd--;
        else if (!playersData[player.playerId].QstateSend) { io.emit('cdChange', { id: player.playerId, skill: 'Q', Ion: true }); playersData[player.playerId].QstateSend = true; }
        if (playersData[player.playerId].Wcd > 0) playersData[player.playerId].Wcd--;
        else if (!playersData[player.playerId].WstateSend) { io.emit('cdChange', { id: player.playerId, skill: 'W', Ion: true }); playersData[player.playerId].WstateSend = true; }
        if (playersData[player.playerId].Ecd > 0) playersData[player.playerId].Ecd--;
        else if (!playersData[player.playerId].EstateSend) { io.emit('cdChange', { id: player.playerId, skill: 'E', Ion: true }); playersData[player.playerId].EstateSend = true; }
        if (playersData[player.playerId].Rcd > 0) playersData[player.playerId].Rcd--;
        else if (!playersData[player.playerId].RstateSend) { io.emit('cdChange', { id: player.playerId, skill: 'R', Ion: true }); playersData[player.playerId].RstateSend = true; }
        if (playersData[player.playerId].Istationary > 0) {
            playersData[player.playerId].Istationary -= 1;
            player.setVelocityX(0);
            player.setVelocityY(0);
            playersData[player.playerId].lastMoved = 'stunned';
        }
        if (playersData[player.playerId].InR) {
            playersData[player.playerId].lastMoved = playersData[player.playerId].lastMoved + 'R';
        }
        playersData[player.playerId].x = player.x;
        playersData[player.playerId].y = player.y;
    });
    for (var i = 0; i < QsBR; i += 1) {
        this.players.getChildren().forEach((player) => {
            var x = Qs[i].ball.x, y = Qs[i].ball.y;
            if (player.x > x - 25 && player.x < x + 25 && player.y > y - 25 && player.y < y + 25 && playersData[player.playerId].team != playersData[Qs[i].id].team) {
                playersData[player.playerId].Istationary += EstunDuration;
                playersData[Qs[i].id].Ecd = 0;
                playersData[player.playerId].lastMoved = 'stunned';
                io.emit('cdChange', { id: player.playerId, skill: 'E', Ion: true });
                player.setVelocityX(0);
                player.setVelocityY(0);
                removeQ(i);
            }
        });
        if (Phaser.Math.Distance.Between(Qs[i].ball.x, Qs[i].ball.y, Qs[i].endX, Qs[i].endY) < 5) {
            removeQ(i);
        }


        //console.log(Qs[i].ball.x + ' : ' + Qs[i].ball.y + ' -- ' + Qs[i].endX + ' : ' + Qs[i].endY);
    }
}

function UpdateXYToPlayers() {
    io.emit('playerUpdates', playersData);
    setTimeout(() => {
        UpdateXYToPlayers();
    }, 50);
}


function addPlayer(self, playerInfo) {
    const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'sprite').setOrigin(0.5, 0.5).setDisplaySize(20, 20);
    //player.setDrag(100);
    //player.setMaxVelocity(200);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
    playersData[player.playerId].player = player;
    //self.physics.add.collider(player, layers);
    self.physics.add.collider(player, layers[1]);
    self.physics.add.collider(player, layers[2]);
    self.physics.add.collider(player, self.players, function (player1, player2) {
        if (playersData[player2.playerId] && playersData[player2.playerId].Istationary == 0 && playersData[player1.playerId].team != playersData[player2.playerId].team) newFunction(player1, self, player2);
        if (playersData[player1.playerId] && playersData[player1.playerId].Istationary == 0 && playersData[player1.playerId].team != playersData[player2.playerId].team) newFunction(player2, self, player1);
    });
}

function newFunction(player1, self, player2) {
    if (playersData[player1.playerId] && playersData[player1.playerId].hp > 0) {
        playersData[player1.playerId].hp -= 1;
        if (playersData[player1.playerId] < 10 && playersData[player1.playerId].InR) {
            playersData[player1.playerId].hp = 10;
        }
        io.emit('updateHP', { playerId: player1.playerId, hp: playersData[player1.playerId].hp, team: playersData[player1.playerId].team });
        if (playersData[player1.playerId].hp < 1 && !playersData[player1.playerId].InR) {
            io.emit('disconnect', player1.playerId);
            removePlayer(self, player1.playerId);
            delete playersData[player1.playerId];
            playersData[player2.playerId].hp += Math.round(Math.random() * 100);
            if (playersData[player2.playerId].hp > 100)
                playersData[player2.playerId].hp = 100;
            io.emit('updateHP', { playerId: player2.playerId, hp: playersData[player2.playerId].hp, team: playersData[player2.playerId].team });
        }
    }
}

function removePlayer(self, playerId) {
    var player = playersData[playerId].player;
    player.destroy();

}
function handlePlayerInput(self, playerId, input) {
    if (playersData[playerId] && playersData[playerId].Istationary == 0) {
        var player = playersData[playerId].player;
        playersData[player.playerId].endX = input.x;
        playersData[player.playerId].endY = input.y;
        if (playersData[player.playerId]) self.physics.moveToObject(player, { x: playersData[player.playerId].endX, y: playersData[player.playerId].endY }, playersData[player.playerId].MSpeed);
        if (player.x > playersData[player.playerId].endX) {
            if (playersData[playerId].MSpeed == 100) {
                playersData[playerId].lastMoved = 'left';
            } else {
                playersData[playerId].lastMoved = 'Wleft';
            }
        } else {
            if (playersData[playerId].MSpeed == 100) {
                playersData[playerId].lastMoved = 'right';
            } else {
                playersData[playerId].lastMoved = 'Wright';
            }
        }
    }
}
function handleQWERpresses(self, id, playerInput) {
    if (playersData[id]) {
        var player = playersData[id].player;

        if (playersData[id].heroType == 'Wizz') {
            //console.log(playersData[id].Istationary);
            if (playerInput.Q && playersData[id].Qcd <= 0 && playersData[id].Istationary == 0) {
                console.log('Q pressed');
                playersData[id].Qcd = WizzQcd;
                playersData[id].QstateSend = false;
                io.emit('cdChange', { id: id, skill: 'Q', Ion: false });
                //console.log('line 223: ' + JSON.stringify(playerInput));
                var tempXY = getXYwithRange(player, playerInput, 500, true);
                createQ(self, { x: playersData[id].x, y: playersData[id].y }, tempXY, id);
            }
            if (playerInput.W && playersData[id].Wcd <= 0) {
                console.log('W pressed');
                playersData[id].Wcd = WizzWcd;
                playersData[id].WstateSend = false;
                io.emit('cdChange', { id: id, skill: 'W', Ion: false });
                playersData[id].MSpeed = 200;
                playersData[id].hp += 40;
                if (playersData[id].hp > 100) playersData[id].hp = 100;
                io.emit('updateHP', { playerId: id, hp: playersData[id].hp, team: playersData[id].team });
                self.physics.moveToObject(player, { x: playersData[id].endX, y: playersData[id].endY }, playersData[id].MSpeed);

                if (Phaser.Math.Distance.Between(player.x, player.y, playersData[player.playerId].endX, playersData[player.playerId].endY) < 5) {
                    player.setVelocityX(0);
                    player.setVelocityY(0);
                    playersData[player.playerId].player.setVelocityX(0);
                    playersData[player.playerId].player.setVelocityY(0);
                }
                setTimeout(function () { if (playersData[id]) resetMSpeed(playersData[id]); }, 5000);
                console.log('set');

                io.emit('playerUpdates', playersData[id]);
            }
            if (playerInput.E && playersData[id].Ecd <= 0 && playersData[id].Istationary == 0) {
                console.log('E pressed');
                playersData[id].Ecd = WizzEcd;
                playersData[id].EstateSend = false;
                io.emit('cdChange', { id: id, skill: 'E', Ion: false });

                var xy = getXYwithRange({ x: playersData[id].x, y: playersData[id].y }, { x: playerInput.x, y: playerInput.y }, rangeE, false);
                io.emit('Exy', xy.x, xy.y);
                setTimeout(function () { dealEdmg(self, id, xy.x, xy.y); }, 500);
            }
            if (playerInput.R && playersData[id].Rcd <= 0 && playersData[id].Istationary == 0) {
                console.log('R pressed');
                playersData[id].Rcd = WizzRcd;
                playersData[id].RstateSend = false;
                playersData[id].InR = true;
                setTimeout(() => {
                    if (playersData[id])
                        playersData[id].InR = false;
                }, 5000);
                io.emit('cdChange', { id: id, skill: 'R', Ion: false });
            }
        }
    }
}
function createQ(self, beginXY, endXY, playerId) {
    Qs[QsBR] = {
        id: playerId,
        endX: endXY.x,
        endY: endXY.y,
        ball: self.physics.add.image(beginXY.x, beginXY.y, 'sprite').setOrigin(0.5, 0.5).setDisplaySize(32, 32)
    };
    self.physics.moveToObject(Qs[QsBR].ball, { x: Qs[QsBR].endX, y: Qs[QsBR].endY }, 400);
    QsBR += 1;
    io.emit('createQ', { x: beginXY.x, y: beginXY.y }, { x: endXY.x, y: endXY.y });

}
function removeQ(index) {
    Qs[index].ball.destroy();
    for (var i = index; i < QsBR - 1; i += 1) {
        Qs[i] = Qs[i + 1];
    }
    QsBR--;
    io.emit('removeQ', index);
}
function resetMSpeed(player) {
    console.log('remove');
    player.MSpeed = 100;
}
function dealEdmg(self, id, wx, wy) {
    var player = playersData[id].player;
    self.players.getChildren().forEach((player) => {
        var x = player.x, y = player.y;
        if (x > wx - 65 && x < wx + 65 && y > wy - 65 && y < wy + 65) {
            if (playersData[player.playerId].team != playersData[id].team) {
                //console.log(playersData[player.playerId].hp);
                playersData[player.playerId].hp -= 20;
                if (playersData[id].hp <= 90) playersData[id].hp += 10;
                else playersData[id].hp = 100;
                //console.log(playersData[player.playerId].hp);
                if (playersData[player.playerId].hp < 10 && playersData[player.playerId].InR) {
                    playersData[player.playerId].hp = 10;
                }
                io.emit('updateHP', { playerId: player.playerId, hp: playersData[player.playerId].hp, team: playersData[player.playerId].team });
                io.emit('updateHP', { playerId: id, hp: playersData[id].hp, team: playersData[id].team });
                //theE.destroy();
                if (playersData[player.playerId].hp <= 0 && !playersData[player.playerId].InR) {
                    io.emit('disconnect', player.playerId);
                    removePlayer(self, player.playerId);
                    delete playersData[player.playerId];
                }
            }
        }
    });
}

function getXYwithRange(player, playerInput, range, ImaxRange) {
    var tempXY = {
        x: 0,
        y: 0
    }

    var a = playerInput.x - player.x;
    var b = playerInput.y - player.y;
    var c = Math.sqrt(a * a + b * b);


    if (c > range) {
        //console.log('range in getXYwithRange : ' + range);
        tempXY.x = player.x + (range * a) / c;
        tempXY.y = player.y + (range * b) / c;
    } else {
        tempXY.x = playerInput.x;
        tempXY.y = playerInput.y;
        //console.log('tempXY in getXYwithRange : ' + JSON.stringify(tempXY));
    }
    if (ImaxRange) {
        tempXY.x = player.x + (range * a) / c;
        tempXY.y = player.y + (range * b) / c;
    }
    return tempXY;
}

const game = new Phaser.Game(config);
window.gameLoaded && window.gameLoaded();