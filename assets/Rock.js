export default class Rock {

    constructor(chunk) {
        this.body = null;
        this.chunk = chunk;
        this.spawnRate = Math.round(Math.log(chunk.scene.difficulty) - 1);
        this.tilemapKeys = [108, 109, 110, 111, 112, 113];
    }

    spawn(x, y) {
        const key = this.tilemapKeys[Math.floor(Math.random()*this.tilemapKeys.length)];
        this.body = this.chunk.scene.physics.add.sprite(x, y, 'water', key).refreshBody();
        this.body.depth = 20;
        
        const playerBoats = this.chunk.scene.player.boat.getChildren();
        playerBoats.forEach(boat => {
            this.chunk.scene.physics.add.overlap(boat, this.body, this.handlePlayerCollision, null, this);
        });
    }

    handlePlayerCollision() {
        this.chunk.scene.scene.stop();
        this.chunk.scene.scene.start('GameOver');
    }
}