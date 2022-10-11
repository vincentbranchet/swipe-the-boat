import Tile from "./Tile";
import ObjectController from './ObjectController';

class Chunk {
    constructor(scene, x, y) {
        this.scene = scene;
        this.objectController = new ObjectController(this);
        this.x = x;
        this.y = y;
        this.tiles = this.scene.add.group();
        this.obstacles = this.scene.add.group();
        this.resources = this.scene.add.group();
        this.isLoaded = false;

        this.scene.physics.add.overlap(this.scene.player.boat.getChildren()[0], this.obstacles, this.handleRockTouched, null, this);
        this.scene.physics.add.overlap(this.scene.player.boat.getChildren()[0], this.resources, this.handleResourceTouched, null, this);
        /**
         * TODO : add overlap on EVERY member of player group and not just the first one
         * OR make a hitbox object on top of player group to handle that kind of stuff (probably what you're supposed to do)
         */
    }

    handleResourceTouched(player, resource) {
        if(resource.active) {
            this.scene.maxSpeed = this.scene.maxSpeed + 20;
            const playerBoats = this.scene.player.boat.getChildren();
            const lastChild = playerBoats[playerBoats.length - 1];

            console.log('Adding raft in ('+lastChild.x + playerBoats.length * 8+', '+lastChild.y+')');
            const raft = this.scene.physics.add.sprite(lastChild.x + playerBoats.length * 8, lastChild.y, 'beach', 20).refreshBody();    
            this.scene.player.boat.add(raft);

            const newLast = this.scene.player.boat.getChildren()[this.scene.player.boat.getChildren().length - 1];
            newLast.depth = 1;
            newLast.setDrag(50);
            newLast.body.setMaxSpeed(this.scene.player.maxSpeed);
            
            /* this.scene.playerBoats.setDepth(1);
            this.playerBoats.getChildren().forEach(b => b.body.setDrag(50));
            this.playerBoats.getChildren().forEach(b => b.body.setMaxSpeed(this.maxSpeed)); */
    
            /* this.playerCharacters = this.physics.add.group();
            const adam = this.physics.add.sprite(0, -100, 'characters', 12).refreshBody();
            this.playerCharacters.add(adam);
            this.playerCharacters.setDepth(10);
    
            this.playerSpeed = 2; */

            this.scene.player.boat.getChildren()[0].body.setMaxSpeed(this.scene.maxSpeed);
            this.scene.score++;
            this.resources.killAndHide(resource);
    
        }
            // increase wave speed ?? instead of log function ?
        // NTA : increase raft size 1 cell, unzoom camera if needed
    }

    handleRockTouched() {
        this.scene.scene.stop();
        this.scene.scene.start('GameOver');
    }

    unload() {
        if(this.isLoaded) {
            this.tiles.clear(true, true);
            this.obstacles.clear(true, true);
            this.resources.clear(true, true);
            this.isLoaded = false;
        }
    }

    load() {
        if(!this.isLoaded) {
            for(let x = 0; x < this.scene.chunkSize; x++) {
                for(let y = 0; y < this.scene.chunkSize; y++) {
                    const tileX = (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (x * this.scene.tileSize);
                    const tileY = (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (y * this.scene.tileSize);

                    let texture = {set: 'water', key: 5};
                    let tile = new Tile(this.scene, tileX, tileY, texture.set, texture.key);
                    this.tiles.add(tile);

                    this.objectController.spawnObstacleOrResource(tileX, tileY);
                    /**
                     * TODO : split object spawning logic from tile generation logic. We want objects not be tied to tiles position or size.
                     */
                }
            }
            this.isLoaded = true;
        }
    }
}

export default Chunk;