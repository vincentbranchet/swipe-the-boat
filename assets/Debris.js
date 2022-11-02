export default class Debris {

    constructor(chunk) {
        this.body = null;
        this.chunk = chunk;
        this.spawnRate = (1 / Math.round(Math.log(chunk.scene.difficulty) * 5));
    }

    spawn(x, y) {
        console.log(`Spawning debris in (${x}, ${y})`);
        this.body = this.chunk.scene.physics.add.sprite(x, y, 'water', 139).refreshBody();
        this.body.depth = 20;

        const playerBoats = this.chunk.scene.player.boat.getChildren();
        playerBoats.forEach(boat => {
            this.chunk.scene.physics.add.overlap(boat, this.body, this.chunk.scene.player.handleTouchedDebris, null, this);
        });
    }
}