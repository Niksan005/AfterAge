
const playersData = {};

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
}

function create() {
    const self = this;

    io.on('connection', function (socket) {
        console.log('a user connected');
        var startX = Math.floor(Math.random() * 700) + 50;
        var startY = Math.floor(Math.random() * 500) + 50;
        socket.on('createPlayer', function (name, type, team) {
            for (var i in playersData) {
                socket.emit('createPlayer', playersData[i]);
            }
            playersData[socket.id] = {
                x: startX,
                y: startY,
                endX: startX,
                endY: startY,
                playerId: socket.id,
                team: team,
                name: name,
                type: type,
                hp: 100,
                MSpeed: 100,
                player: self.physics.add.sprite(startX, startY, 'ship'),
            };
            io.emit('createPlayer', playersData[socket.id]);
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
            playersData[socket.id].player.destroy();
            delete playersData[socket.id];
            io.emit('disconnect', socket.id);
        });

        socket.on('movePlayer', function (inputData) {
            if (playersData[socket.id]) {
                playersData[socket.id].endX = inputData.x;
                playersData[socket.id].endY = inputData.y;
                handlePlayerInput(self, socket.id, inputData);
            }
        });


        socket.on('pressedQWER', function (inputData) {
            //handleQWERpresses(self, socket.id, inputData);
        });
    });
}

function update() {

    for (var i in playersData) {
        var player = playersData[i];
        if (Phaser.Math.Distance.Between(player.player.x, player.player.y, player.endX, player.endY) < 5) {
            player.player.setVelocityX(0);
            player.player.setVelocityY(0);
        }
        playersData[i].x = playersData[i].player.x;
        playersData[i].y = playersData[i].player.y;
    }

    io.emit('playerUpdates', playersData);
}


function handlePlayerInput(self, playerId, input) {
    self.physics.moveToObject(playersData[playerId].player, { x: playersData[playerId].endX, y: playersData[playerId].endY }, playersData[playerId].MSpeed);
}
const game = new Phaser.Game(config);
window.gameLoaded();
