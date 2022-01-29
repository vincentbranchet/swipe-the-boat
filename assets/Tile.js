class Tile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, key, frame);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}

export default Tile;