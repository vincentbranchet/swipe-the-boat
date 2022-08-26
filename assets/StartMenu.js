class StartMenu extends Phaser.Scene {

    constructor () {
        super('StartMenu');
    }

    init() {
    }

    preload() {
    }

    create() {
        this.add.text(100,100, 'Start Game',{ fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('SceneMain'));
    }

    update() {
    }
}

export default StartMenu;