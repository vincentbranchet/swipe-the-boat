export default class Debris {

    constructor(chunk) {
        this.body = null;
        this.chunk = chunk;
        this.spawnRate = (1 / Math.round(Math.log(chunk.scene.difficulty) * 10));
    }

    spawn(x, y) {
        console.log(`Spawning debris in (${x}, ${y})`);
        this.body = this.chunk.scene.physics.add.sprite(x, y, 'water', 139).refreshBody();
        this.body.depth = 20;

        const playerBoats = this.chunk.scene.player.boat.getChildren();
        playerBoats.forEach(boat => {
            this.chunk.scene.physics.add.overlap(boat, this.body, this.handlePlayerCollision, null, this);
        });
    }

    handlePlayerCollision() {
        if(this.body.active) {
            this.chunk.scene.player.maxSpeed = this.chunk.scene.player.maxSpeed + 20;
            const playerBoats = this.chunk.scene.player.boat.getChildren();
            const lastChild = playerBoats[playerBoats.length - 1];

            console.log('Adding raft in ('+lastChild.x + playerBoats.length * 8+', '+lastChild.y+')');
            const raft = this.chunk.scene.physics.add.sprite(lastChild.x + playerBoats.length * 8, lastChild.y, 'beach', 20).refreshBody();    
            this.chunk.scene.player.boat.add(raft);
            // add collision between new boat and all world objects

            const newLast = this.chunk.scene.player.boat.getChildren()[this.chunk.scene.player.boat.getChildren().length - 1];
            newLast.depth = 1;
            newLast.setDrag(50);
            newLast.body.setMaxSpeed(this.chunk.scene.player.maxSpeed);

            this.chunk.scene.player.boat.getChildren()[0].body.setMaxSpeed(this.chunk.scene.player.maxSpeed);
            this.chunk.scene.score++;
            this.body.destroy();
    
        }
    }
}