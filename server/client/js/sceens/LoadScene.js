import { CST } from '../CST.js';

class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }

    init(a) {
        this.Name = a.Name;
        this.HeroType = a.HeroType;
        this.Imobile = a.Imobile;
        this.team = a.team;
        if (this.Name == undefined) {
            this.Name = 'Player';
        }
        if (this.HeroType == undefined) {
            this.HeroType = 'Wizz';
        }
        if (this.team == undefined) {
            this.team = 'red';
        }
    }
    preload() { // Loading All Assets That Are Used


        this.load.tilemapTiledJSON('map', 'assets/map/TilemapFull.json');
        this.load.spritesheet('tileset', 'assets/map/tileset4.png', { frameWidth: 32, frameHeight: 32 });


        this.load.image('Select', 'assets/sprites/loadingScreen/flagSelect.png')
        this.load.image('background', 'assets/sprites/loadingScreen/bg.png');
        this.load.image('startButt', 'assets/sprites/loadingScreen/startButton.png');
        this.load.image('createName', 'assets/sprites/loadingScreen/createName.png');

        this.load.image('flagRed', 'assets/sprites/loadingScreen/flagRed.png');
        this.load.image('flagBlue', 'assets/sprites/loadingScreen/flagBlue.png');
        this.load.image('flagGreen', 'assets/sprites/loadingScreen/flagGreen.png');
        this.load.image('flagYellow', 'assets/sprites/loadingScreen/flagYellow.png');


        this.load.spritesheet('Q', 'assets/sprites/ball.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('cd', 'assets/sprites/cooldownSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('E', 'assets/sprites/E.png', { frameWidth: 100, frameHeight: 100 });
        this.load.image('hud', 'assets/sprites/USED_HUD.png');
        this.load.spritesheet('Qskill', 'assets/sprites/Qskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Wskill', 'assets/sprites/Wskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Eskill', 'assets/sprites/Eskill.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('Rskill', 'assets/sprites/Rskill.png', { frameWidth: 32, frameHeight: 32 });


        this.load.spritesheet('QTbullet', 'assets/sprites/bullet.png', { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet('QTdeadAnims', 'assets/sprites/bulletDeath.png', { frameWidth: 64, frameHeight: 32 });


        this.load.spritesheet('WTbullet', 'assets/sprites/slowingBulletSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('WTdeadAnims', 'assets/sprites/slowingBulletDeath.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('ETbullet', 'assets/sprites/stunBulletSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('ETdeadAnims', 'assets/sprites/stunBulletDeathSpriteSheet.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('sprite', 'assets/sprites/AeraxSpriteSheet.png', { frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('spriteTank', 'assets/sprites/tankspritesheet.png', { frameWidth: 50, frameHeight: 50 });

        this.load.image('notification', 'assets/sprites/timeNotification.png');

    }//timeNotification.png
    create() {

        this.anims.create({
            key: 'Robot',
            frames: this.anims.generateFrameNumbers('sprite', { start: 16, end: 19 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'RobotTank',
            frames: this.anims.generateFrameNumbers('spriteTank', { start: 10, end: 17 }),
            frameRate: 4,
            repeat: -1
        });


        this.bg = this.add.image(16 * 32, 9 * 32, 'background');

        console.log(this.team)
        if (this.team == 'red') {
            this.selected = this.add.image(80, 15 * 32, 'Select');
        }

        if (this.team == 'blue') {
            this.selected = this.add.image(2 * 80, 15 * 32, 'Select');
        }

        if (this.team == 'gree') {
            this.selected = this.add.image(3 * 80, 15 * 32, 'Select');
        }

        if (this.team == 'yellow') {
            this.selected = this.add.image(4 * 80, 15 * 32, 'Select');
        }

        this.selected2 = this.add.image(this.HeroType == 'Wizz' ? (15 * 64) : (13 * 64), 16 * 32, 'Select').setDisplaySize(100, 100);

        this.startButt = this.add.sprite(16 * 32, 9 * 32, 'startButt')
            .setInteractive()
            .on('pointerdown', () => this.scene.start(CST.SCENES.GAME, { HeroType: this.HeroType, Name: this.Name, Imobile: false, team: this.team }))
            .on('pointerover', () => console.log('Over'));


        this.startButt = this.add.sprite(24 * 32, 9 * 32, 'createName').setDisplaySize(100, 100)
            .setInteractive()
            .on('pointerdown', () => this.Name = prompt("Please enter your name:", this.Name));

        this.flagRed = this.add.image(80, 15 * 32, 'flagRed')
            .setInteractive()
            .on('pointerdown', () => { this.team = 'red'; this.selected.x = 80; });
        this.flagBlue = this.add.image(2 * 80, 15 * 32, 'flagBlue')
            .setInteractive()
            .on('pointerdown', () => { this.team = 'blue'; this.selected.x = 2 * 80; });
        this.flagGreen = this.add.image(3 * 80, 15 * 32, 'flagGreen')
            .setInteractive()
            .on('pointerdown', () => { this.team = 'green'; this.selected.x = 3 * 80; });
        this.flagYellow = this.add.image(4 * 80, 15 * 32, 'flagYellow')
            .setInteractive()
            .on('pointerdown', () => { this.team = 'yellow'; this.selected.x = 4 * 80; });



        this.Robot = this.add.sprite(15 * 64, 8 * 64, 'sprite')
            .setDisplaySize(100, 100)
            .setInteractive()
            .on('pointerdown', () => this.SelectWizz(this.selected2, this));
        this.Robot.anims.play('Robot', true);

        this.RobotTank = this.add.sprite(13 * 64, 8 * 64, 'spriteTank')
            .setDisplaySize(100, 100)
            .setInteractive()
            .on('pointerdown', () => this.SelectTank(this.selected2, this));
        this.RobotTank.anims.play('RobotTank', true);
    }

    SelectWizz(s, h) {
        h.HeroType = 'Wizz';
        s.x = 15 * 64;
    }
    SelectTank(s, h) {
        h.HeroType = 'Tank';
        s.x = 13 * 64;
    }
}
export { LoadScene };