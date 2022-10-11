export default class Debris {

    constructor(chunk) {
        this.chunk = chunk;
        this.spawnRate = (1 / Math.round(Math.log(chunk.scene.difficulty) * 10));
    }

    spawn(x, y) {
        console.log(`Spawning debris in (${x}, ${y})`);
        let debris = this.chunk.scene.physics.add.sprite(x, y, 'water', 139).refreshBody();
        this.chunk.resources.add(debris);
    }
}