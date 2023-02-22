export default class PlayerBump extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'water', 144);

        this.depth = 1;
        this.angle = 180;

        scene.physics.world.enableBody(this);
        scene.add.existing(this);
    }
}