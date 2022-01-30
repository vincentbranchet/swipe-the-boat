import Chunk from "./Chunk";

class SceneMain extends Phaser.Scene {
    constructor() {
        super({key: 'SceneMain'});
        this.customControls = {
            active: false,
            touches: [],
            prevTouch: false,
            left: false,
            up: false,
            right: false,
            down: false,
            speed: 1,
            maxSpeed: 400,
        }
    }

    handleWaveTouched() {
        this.scene.stop();
        document.getElementById('game-over').style.display = 'flex';
    }

    update() {
        // retrieve position of chunk where follow point is
        let snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.player.x / (this.chunkSize * this.tileSize));
        let snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.player.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;
        
        // get current wave tiles data
        const waveTiles = this.wave.getChildren();
        const maxX = Math.max.apply(Math,waveTiles.map((o) => o.x));
        const maxXTile = waveTiles.find((o) => o.x == maxX);
        const minX = Math.min.apply(Math,waveTiles.map((o) => o.x));

        // create chunks around position if they don't exist
        for(let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for(let y = snappedChunkY - 4; y < snappedChunkY + 2; y++) {
                const existingChunk = this.getChunk(x, y);
                if(existingChunk == null) {
                    const newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                    
                    if(newChunk.x * this.chunkSize * this.tileSize < minX) {
                        for(let i = minX; i > newChunk.x * this.chunkSize * this.tileSize; i -= this.tileSize) {
                            this.waveTile = this.physics.add.sprite(i, Math.round(maxXTile.y), 'water', 64).refreshBody();
                            this.waveTile.depth = 20;
                            this.waveTile.setVelocityY(maxXTile.body.velocity.y);
                            this.wave.add(this.waveTile);
                        }
                    }
                    if(newChunk.x * this.chunkSize * this.tileSize > maxX) {
                        for(let i = maxX; i < newChunk.x * this.chunkSize * this.tileSize; i += this.tileSize) {
                            this.waveTile = this.physics.add.sprite(i, Math.round(maxXTile.y), 'water', 64).refreshBody();
                            this.waveTile.depth = 20;
                            this.waveTile.setVelocityY(maxXTile.body.velocity.y);
                            this.wave.add(this.waveTile);
                        }
                    }
                }
            }
        }

        // load existings chunks close to position & unload existing chunks far from position
        for(let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i];

            if(Phaser.Math.Distance.Between(snappedChunkX, snappedChunkY, chunk.x, chunk.y) < 4) {
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

        // touch controls
        if(this.customControls.up) {
            this.player.setVelocityY(this.player.body.velocity.y - this.customControls.speed * Math.abs(this.customControls.up * 0.5));
        }
        if(this.customControls.down) {
            this.player.setVelocityY(this.player.body.velocity.y + this.customControls.speed * Math.abs(this.customControls.down * 0.5));
        }
        if(this.customControls.right) {
            this.player.setVelocityX(this.player.body.velocity.x + this.customControls.speed * Math.abs(this.customControls.right * 0.5));
        }
        if(this.customControls.left) {
            this.player.setVelocityX(this.player.body.velocity.x - this.customControls.speed * Math.abs(this.customControls.left * 0.5));
        }

        // keyboard controls
        if (this.keyZ.isDown) {
            this.player.y -= this.playerSpeed;
        }
        if (this.keyS.isDown) {
            this.player.y += this.playerSpeed;
        }
        if (this.keyQ.isDown) {
            this.player.x -= this.playerSpeed;
        }
        if (this.keyD.isDown) {
            this.player.x += this.playerSpeed;
        }

        this.cameras.main.centerOn(this.player.x, this.player.y - 85);
    }

    create() {
        // general
        this.chunkSize = 8;
        this.tileSize = 16;
        this.chunks = [];
        this.physics.world.fixedStep = false; 
        
        this.input.on('pointerdown', (e) => this.handlePress(e));
        this.input.on('pointermove', (e) => this.handleDrag(e));
        this.input.on('pointerup', (e) => this.handleRelease(e));

        // camera
        this.cameras.main.setZoom(1.5);

        // player
        this.player = this.physics.add.sprite(0, 0, 'boat', 4).refreshBody();
        this.player.depth = 10;
        this.player.body.setDrag(100);
        this.player.body.setMaxSpeed(this.customControls.maxSpeed);

        this.playerSpeed = 2;

        // tsunami
        this.wave = this.add.group();
        for(let i = -16; i < 16; i++) {
            this.waveTile = this.physics.add.sprite(i * this.tileSize, 100, 'water', 64).refreshBody();
            this.waveTile.depth = 20;
            this.waveTile.setVelocityY(-10);
            this.wave.add(this.waveTile);
        }

        // collisions
        this.physics.add.overlap(this.player,this.wave, this.handleWaveTouched, null, this);

        // controls
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    preload() {
        this.load.spritesheet("water", "assets/water.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('boat', 'assets/boats.png', { 
            frameWidth: 32, 
            frameHeight: 32
        }); 
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

    /**
     * Input functions
     */
     handlePress(e) {
        if(e.event.changedTouches) {
            const touches = e.event.changedTouches;

            for(let i = 0; i < touches.length; i++) {
                this.customControls.touches.push(this.copyTouch(touches[i]));
            }
        }
        else {
            this.customControls.active = true;
        }
    }

    handleDrag(e) {
        if(e.event.changedTouches) {
            const touches = e.event.changedTouches;

            for(let i = 0; i < touches.length; i++) {
                const idx = this.ongoingTouchIndexById(touches[i].identifier);

                if(idx >= 0) {              
                    const touch = this.customControls.touches[idx];

                    if(this.customControls.prevTouch) {

                        touch.movementX = touch.pageX - this.customControls.prevTouch.pageX;
                        touch.movementY = touch.pageY - this.customControls.prevTouch.pageY;

                        // 5 is the error margin : if the finger moves just a tiny bit, we don't take it into account
                        if(touch.movementY > 1) this.customControls.up = touch.movementY;
                        else this.customControls.up = false;
                        if(touch.movementY < -1) this.customControls.down = touch.movementY;
                        else this.customControls.down = false;
                        if(touch.movementX > 1) this.customControls.left = touch.movementX;
                        else this.customControls.left = false;
                        if(touch.movementX < -1) this.customControls.right = touch.movementX;
                        else this.customControls.right = false;

                       this.customControls.touches.splice(idx, 1, this.copyTouch(touches[i]));
                    }

                   this.customControls.prevTouch = touch;
                }
            }
        }
        else {
            if(this.customControls.active) {
                if(e.event.movementX > 0) this.customControls.left = true;
                if(e.event.movementX < 0) this.customControls.right = true;
                if(e.event.movementY > 0) this.customControls.up = true;
                if(e.event.movementY < 0) this.customControls.down = true;
            }
        }
    }

    handleRelease(e) {
        if(e.event.changedTouches) {
            console.log('release');

            const touches = e.event.changedTouches;

            for(let i = 0; i < touches.length; i++) {
                const idx = this.ongoingTouchIndexById(touches[i].identifier);

                if(idx >= 0) {
                    this.customControls.left = false;
                    this.customControls.up = false;
                    this.customControls.right = false;
                    this.customControls.down = false;

                    this.customControls.touches.splice(idx, 1);
                    this.customControls.prevTouch = false;
                }
            }
        }
        else {
            this.customControls.active = false;
            this.customControls.left = false;
            this.customControls.up = false;
            this.customControls.right = false;
            this.customControls.down = false;
        }
    }

    copyTouch({ identifier, pageX, pageY }) {
        return { identifier, pageX, pageY };
    }

    ongoingTouchIndexById(idToFind) {
        for (var i = 0; i < this.customControls.touches.length; i++) {
            var id = this.customControls.touches[i].identifier;

            if (id == idToFind) {
            return i;
            }
        }
        return -1;
    }
}

export default SceneMain;