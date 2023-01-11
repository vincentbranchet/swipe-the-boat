export default class PlayerBoat extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'beach', 20);

        this.depth = 1;

        scene.physics.world.enableBody(this);
        scene.add.existing(this);
    }
}