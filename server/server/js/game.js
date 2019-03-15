
const players = {};

const config = {
    type: Phaser.HEADLESS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
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
        players[socket.id] = {
            rotation: 0,
            x: Math.floor(Math.random() * 700) + 50,
            y: Math.floor(Math.random() * 500) + 50,
            playerId: socket.id,
            team: 'red'

        };
        addPlayer(self, players[socket.id]);
        socket.emit('currentPlayers', players);;

        socket.on('disconnect', function () {
            console.log('user disconnected');
            removePlayer(self, socket.id);
            delete players[socket.id];
            io.emit('disconnect', socket.id);
        });

        socket.on('playerInput', function (inputData) {
            handlePlayerInput(self, socket.id, inputData);
        });
    });
}

function addPlayer(self, playerInfo) {
    const player = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    player.setDrag(100);
    player.setAngularDrag(100);
    player.setMaxVelocity(200);
    player.playerId = playerInfo.playerId;
    self.players.add(player);
}

const game = new Phaser.Game(config);
window.gameLoaded();
