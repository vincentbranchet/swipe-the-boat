class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'water', 5);

        scene.physics.world.enableBody(this);
        scene.add.existing(this);

        this.setOrigin(0);
    }
}

export default Tile;
