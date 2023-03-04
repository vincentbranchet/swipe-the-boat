export default class Loot extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, spriteKey, reward) {
        super(scene, x, y, 'water', spriteKey);
        this.reward = reward;
    }
}
