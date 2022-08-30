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
                this.scene.stop();
                this.scene.start('Game');
            });
    }

    update() {
    }
}

export default Start;