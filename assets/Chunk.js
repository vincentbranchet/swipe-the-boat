import Tile from "./Tile";

class Chunk {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.tiles = this.scene.add.group();
        this.isLoaded = false;
    }

    unload() {
        if(this.isLoaded) {
            this.tiles.clear(true, true);
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
                    const key = "water";
                    let tile = new Tile(this.scene, tileX, tileY, key, 5);
                    this.tiles.add(tile);
                }
            }
            this.isLoaded = true;
        }
    }
}

export default Chunk;