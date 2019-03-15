
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

    /*  this.physics.add.overlap(this.players, this.star, function (star, player) {
        if (players[player.playerId].team === 'red') {
          self.scores.red += 10;
        } else {
          self.scores.blue += 10;
        }
        self.star.setPosition(randomPosition(700), randomPosition(500));
        io.emit('updateScore', self.scores);
        io.emit('starLocation', { x: self.star.x, y: self.star.y });
      });*/

    io.on('connection', function (socket) {
        console.log('a user connected');
        var startX = Math.floor(Math.random() * 700) + 50;
        var startY = Math.floor(Math.random() * 500) + 50;
        socket.on('createPlayer', function (name, type, team) {
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
            for (var i in playersData) {
                io.emit('createPlayer', playersData[i]);
            }
        });

        socket.on('disconnect', function () {
            console.log('user disconnected');
            delete playersData[socket.id];
            io.emit('disconnect', socket.id);
        });

        socket.on('playerInput', function (inputData) {
            handlePlayerInput(self, socket.id, inputData);
        });
    });
}

function update() { }


const game = new Phaser.Game(config);
window.gameLoaded();
