export default class Debris {

    constructor(chunk, spriteKey) {
        this.body = null;
        this.chunk = chunk;
        this.spriteKey = spriteKey;
    }

    spawn(x, y) {
        console.log(`Spawning debris in (${x}, ${y})`);
        this.body = this.chunk.scene.physics.add.sprite(x, y, 'water', this.spriteKey).refreshBody();
        this.body.depth = 20;

        const playerBoats = this.chunk.scene.player.boat.getChildren();
        playerBoats.forEach(boat => {
            this.chunk.scene.physics.add.overlap(boat, this.body, this.chunk.scene.player.handleTouchedDebris, null, this);
        });
    }
}