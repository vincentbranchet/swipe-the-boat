import Tile from "./Tile";
import ObjectController from './ObjectController';

class Chunk {
    constructor(scene, x, y) {
        this.scene = scene;
        this.objectController = new ObjectController(this);
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

                    let texture = {set: 'water', key: 5};
                    let tile = new Tile(this.scene, tileX, tileY, texture.set, texture.key);
                    this.tiles.add(tile);
                }
            }
            this.objectController.spawnRocks(this);
            this.objectController.spawnDebris(this);
            this.isLoaded = true;
        }
    }

    /**
     * Returns chunk minimum X position in true pixels
     */
    get minX() {
        return (this.x * (this.scene.chunkSize * this.scene.tileSize));
    }

    /**
     * Returns chunk maximum X position in true pixels
     */
    get maxX() {
        return (this.x * (this.scene.chunkSize * this.scene.tileSize)) + (this.scene.chunkSize * this.scene.tileSize);
    }

    /**
     * Returns chunk minimum Y position in true pixels
     */
    get minY() {
        return (this.y * (this.scene.chunkSize * this.scene.tileSize));
    }

    /**
     * Returns chunk maximum Y position in true pixels
     */
    get maxY() {
        return (this.y * (this.scene.chunkSize * this.scene.tileSize)) + (this.scene.chunkSize * this.scene.tileSize);
    }
}

export default Chunk;