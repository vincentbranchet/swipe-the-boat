export default class Rock {

    constructor(chunk) {
        this.chunk = chunk;
        this.spawnRate = Math.round(Math.log(chunk.scene.difficulty));
        this.tilemapKeys = [108, 109, 110, 111, 112, 113];
    }

    spawn(x, y) {
        const key = this.tilemapKeys[Math.floor(Math.random()*this.tilemapKeys.length)];
        let rock = this.chunk.scene.physics.add.sprite(x, y, 'water', key).refreshBody();
        rock.depth = 20;

        this.chunk.obstacles.add(rock);
    }
}