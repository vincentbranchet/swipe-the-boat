class Start extends Phaser.Scene {

    constructor () {
        super('Start');
    }

    init() {
    }

    preload() {
    }

    create() {
        this.add.text(100,100, 'Start Game',{ fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('Game');
                this.scene.stop();
            });
    }

    update() {
    }
}

export default Start;