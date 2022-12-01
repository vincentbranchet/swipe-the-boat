export default class Rock extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, data) {
        super(scene, x, y, 'water', data.key)
        this.size = data.size;
    }
}