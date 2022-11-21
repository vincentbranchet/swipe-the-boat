export default class Rock {

    constructor(chunk, spriteKey) {
        this.body = null;
        this.chunk = chunk;
        this.spriteKey = spriteKey;
    }

    spawn(x, y) {
        this.body = this.chunk.scene.physics.add.sprite(x, y, 'water', this.spriteKey).refreshBody();
        this.body.depth = 20;
        
        const playerBoats = this.chunk.scene.player.boat.getChildren();
        playerBoats.forEach(boat => {
            this.chunk.scene.physics.add.overlap(boat.body, this.body, this.handlePlayerCollision, null, this);
        });
        console.log(`Spawned rock of key ${this.key} at (${x}, ${y}) in chunk (${this.chunk.x}, ${this.chunk.y})`);
    }

    handlePlayerCollision() {
        console.log(`Player has touched a rock at ${this.body.x}, ${this.body.y}`);
        this.chunk.scene.scene.stop();
        this.chunk.scene.scene.start('GameOver');
    }
}