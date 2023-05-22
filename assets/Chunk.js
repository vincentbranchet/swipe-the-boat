import Tile from "./Tile.js";
import ObjectController from './ObjectController.js';
import WaveTile from "./WaveTile.js";

class Chunk {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.tiles = this.scene.add.group();
        this.isLoaded = false;
    }

    createWaveTiles(y = 0, velocity = 0, size = 0) {
        let tiles = [];
        for(let i = this.minX; i < this.maxX; i += size) {
            let waveTile = new WaveTile(this.scene, i, y);
            waveTile.body.setVelocityY(velocity);
            tiles.push(waveTile);
            console.log({x: waveTile.body.x, y: waveTile.body.y, at: waveTile.metaData.created.at})
        }
        return tiles;
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

                    let tile = new Tile(this.scene, tileX, tileY);
                    this.tiles.add(tile);
                }
            }
            ObjectController.spawnRocks(this);
            ObjectController.spawnLoot(this);
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
