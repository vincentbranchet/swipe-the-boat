import Tile from "./Tile";

class Chunk {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.tiles = this.scene.add.group();
        this.rocks = this.scene.add.group();
        this.people = this.scene.add.group();
        this.isLoaded = false;
        this.rockProbability = Math.round(Math.log(scene.difficulty));
        this.peopleProbability = (1 / Math.round(Math.log(scene.difficulty) * 10));

        this.scene.physics.add.overlap(this.scene.playerBoats.getChildren()[0], this.rocks, this.handleRockTouched, null, this);
        this.scene.physics.add.overlap(this.scene.playerBoats.getChildren()[0], this.people, this.handlePeopleTouched, null, this);
        /**
         * TODO : add overlap on EVERY member of player group and not just the first one
         * OR make a hitbox object on top of player group to handle that kind of stuff (probably what you're supposed to do)
         */
    }

    handlePeopleTouched(player, people) {
        if(people.active) {
            this.scene.maxSpeed = this.scene.maxSpeed + 20;
            this.scene.playerBoats.getChildren()[0].body.setMaxSpeed(this.scene.maxSpeed);
            this.scene.score++;
            this.people.killAndHide(people);
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
            this.rocks.clear(true, true);
            this.people.clear(true, true);
            this.isLoaded = false;
        }
    }

    load() {
        if(!this.isLoaded) {
            for(let x = 0; x < this.scene.chunkSize; x++) {
                for(let y = 0; y < this.scene.chunkSize; y++) {
                    const tileX = (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (x * this.scene.tileSize);
                    const tileY = (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (y * this.scene.tileSize);
                    /**
                     * TODO : add rocks
                     * scene has a difficulty level based on far the wave is from its starting position
                     * when a chunk is created it receives the difficulty level from the scene
                     * it uses it to fill its rock and people groups
                     * each chunk tile is either water, rock or people
                     * /!\ careful with collision handlers, should be declared in Scene
                     */
                    const prob = (Math.random() * 100);
                    let texture = {set: 'water', key: 5};
                    let tile = new Tile(this.scene, tileX, tileY, texture.set, texture.key);
                    this.tiles.add(tile);

                    if(prob < this.peopleProbability) {
                        let people = this.scene.physics.add.sprite(tileX, tileY, 'characters', 12).refreshBody();
                        this.people.add(people);
                    }
                    else if(prob < this.rockProbability) {
                        const rockKeys = [108, 109, 110, 111, 112, 113];
                        const key = rockKeys[Math.floor(Math.random()*rockKeys.length)];
                        let rock = this.scene.physics.add.sprite(tileX, tileY, 'water', key).refreshBody();
                        rock.depth = 20;
                        this.rocks.add(rock);
                    }
                }
            }
            this.isLoaded = true;
        }
    }
}

export default Chunk;