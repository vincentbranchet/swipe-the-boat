import Chunk from "./Chunk";

class SceneMain extends Phaser.Scene {
    constructor() {
        super({key: 'SceneMain'});
    }

    preload() {
        this.load.spritesheet("water", "assets/water.png", {
            frameWidth: 16,
            frameHeight: 16
        });        
    }

    create() {
        this.chunkSize = 16;
        this.tileSize = 16;
        this.cameraSpeed = 10;
        
        this.cameras.main.setZoom(2);

        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
            this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        );

        this.chunks = [];

        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    getChunk(x, y) {
        let chunk = null;
        for(let i = 0; i < this.chunks.length; i++) {
            if(this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }
        return chunk;

    }

    update() {
        console.log('player pos : ' + this.followPoint.x + ', ' + this.followPoint.y);
        // retrieve position of chunk where follow point is
        let snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
        let snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

        // create chunks around position if they don't exist
        for(let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for(let y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                const existingChunk = this.getChunk(x, y);
                if(existingChunk == null) {
                    const newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }

        // load existings chunks close to position & unload existing chunks far from position
        for(let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i];

            if(Phaser.Math.Distance.Between(snappedChunkX, snappedChunkY, chunk.x, chunk.y) < 3) {
                if(chunk !== null) {
                    chunk.load();
                }
            }
            else {
                if(chunk !== null) {
                    chunk.unload();
                }
            }
        }

        // handle camera
        if (this.keyZ.isDown) {
            this.followPoint.y += this.cameraSpeed;
        }
        if (this.keyS.isDown) {
            this.followPoint.y -= this.cameraSpeed;
        }
        if (this.keyQ.isDown) {
            this.followPoint.x += this.cameraSpeed;
        }
        if (this.keyD.isDown) {
            this.followPoint.x -= this.cameraSpeed;
        }

        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
    }
}

export default SceneMain;