export default class WaveTile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'water', 64);

        this.depth = 20;
        this.angle = 180;
        this.metaData = {
            created: {
                at: new Date().toTimeString(),
                by: 'Game',
            },
            updated: {
                at: null,
                by: null,
            },
            createdAtX: x,
            createdAtY: y
        }

        scene.physics.world.enableBody(this);
        scene.add.existing(this);
    }
}
