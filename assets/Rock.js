export default class Rock extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, data, chunk) {
        super(scene, x, y, 'water', data.key, chunk)
        this.breaksAt = data.breaksAt;
        this.displayWidth = data.size;
        this.displayHeight = data.size;
    }
}
