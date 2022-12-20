export default class Debris extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, 'water', spriteKey);
    }
}