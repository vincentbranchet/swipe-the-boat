class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
        //this.chunkSize = 8;
        this.tileSize = 16;
        this.waveStartY = 300;
        this.waveVelocityY = -500;
        this.hasTouchedWave = false;
    }

    init() {
    }

    preload() {
        this.load.spritesheet("water", "assets/water.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('boats', 'assets/boats.png', { 
            frameWidth: 32, 
            frameHeight: 32
        }); 
        this.load.spritesheet('characters', 'assets/characters.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('beach', 'assets/beach.png', {
            frameWidth: 32,
            frameHeight: 32
        })
    }

    create() {
        // camera
        this.cameras.main.setZoom(3);

        // tsunami
        this.wave = this.add.group();
        for(let i = -16; i < 16; i++) {
            this.waveTile = this.physics.add.sprite(i * this.tileSize, this.waveStartY, 'water', 64).refreshBody();
            this.waveTile.depth = 20;
            this.waveTile.setVelocityY(this.waveVelocityY);
            this.wave.add(this.waveTile);
        }

        // character
        this.player = this.physics.add.sprite(0, -100, 'beach', 20).refreshBody();
        this.playerCharacter = this.physics.add.sprite(0, -100, 'characters', 12).refreshBody();
        this.player.depth = 10;
        this.playerCharacter.depth = 10;
        this.playerCharacter.setPosition(this.player.x, this.player.y - 16);

        // collisions        
        this.physics.add.overlap(this.player,this.wave, this.handleWaveTouched, null, this);

        this.cameras.main.centerOn(this.player.x, this.player.y);
    }

    update() {
        if(this.hasTouchedWave) {
            this.add.text(this.player.x - 50, this.player.y, 'Restart',{ fill: '#0f0' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.stop();
                    this.scene.start('Game');
                });
            this.player.x += 1000;
            this.playerCharacter.x += 1000;
        }

    }

    handleWaveTouched() {
        this.hasTouchedWave = true;
    }
}

export default GameOver;