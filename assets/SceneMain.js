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
        }
        this.maxSpeed = 100;
        this.waveStartY = 0;
        this.waveVelocityY = -10;
        this.difficulty = 0;
        this.score = 0;
        this.debug = document.getElementById('debug');
    }

    init() {
        this.smoothZoom(this.input);
    }

    smoothZoom(inputs) {
        let zoom = setTimeout(() => {
            this.cameras.main.zoomTo(2.5);
        }, 2000);
    }

    handleWaveTouched() {
        this.scene.stop();
        let scoreContainer = document.getElementById('score-container');
        scoreContainer.innerHTML = this.score;
        document.getElementById('game-over').style.display = 'flex';

    }

    handleWaveAcceleration(d) {
        if(d > 0) {
            this.difficulty = d;
            this.waveVelocityY -= this.difficulty * 2;
            const waveTiles = this.wave.getChildren();
            waveTiles.forEach((tile) => {
                tile.body.velocity.y = this.waveVelocityY;
            });
        }
        else {
            this.difficulty = 0;
        }
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
        for(let x = snappedChunkX - 2; x < snappedChunkX + 3; x++) {
            for(let y = snappedChunkY - 4; y < snappedChunkY + 2; y++) {
                const existingChunk = this.getChunk(x, y);
                if(existingChunk == null) {
                    const newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                    
                    if(newChunk.x * this.chunkSize * this.tileSize < minX) {
                        for(let i = minX; i > newChunk.x * this.chunkSize * this.tileSize; i -= this.tileSize) {
                            this.waveTile = this.physics.add.sprite(i, Math.round(maxXTile.y), 'water', 64).refreshBody();
                            this.waveTile.depth = 20;
                            this.waveTile.setVelocityY(this.waveVelocityY);
                            this.wave.add(this.waveTile);
                        }
                    }
                    if(newChunk.x * this.chunkSize * this.tileSize > maxX) {
                        for(let i = maxX; i < newChunk.x * this.chunkSize * this.tileSize; i += this.tileSize) {
                            this.waveTile = this.physics.add.sprite(i, Math.round(maxXTile.y), 'water', 64).refreshBody();
                            this.waveTile.depth = 20;
                            this.waveTile.setVelocityY(this.waveVelocityY);
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

        // increment difficulty & wave speed depending on wave distance from start
        const d = Math.round(Math.log(Math.abs(Math.round(maxXTile.y + 1)) - Math.round(Math.abs(this.waveStartY))));
        if(d > 0 && d > this.difficulty) {
            this.handleWaveAcceleration(d);
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

        this.playerCharacter.setPosition(this.player.x, this.player.y - 16);
        this.cameras.main.centerOn(this.player.x, this.player.y - 100);

        this.debug.innerHTML = 'pV : (' + Math.round(this.player.body.velocity.x) + ', ' + Math.round(this.player.body.velocity.y) + ') wV : ' + this.waveVelocityY + ' maxS : ' + this.maxSpeed;
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
        this.input.on('gameout', (e) => this.handleOut(e));

        // camera
        this.cameras.main.setZoom(1.5);

        // player
        // key 46 : guy with pirate hat
        // key 24 : boat facing up
        this.player = this.physics.add.sprite(0, -100, 'beach', 20).refreshBody();
        this.player.depth = 10;
        this.player.body.setDrag(50);
        this.player.body.setMaxSpeed(this.maxSpeed);

        this.playerCharacter = this.physics.add.sprite(0, -100, 'characters', 12).refreshBody();
        this.playerCharacter.depth = 10;

        this.playerSpeed = 2;

        // tsunami
        this.wave = this.add.group();
        for(let i = -16; i < 16; i++) {
            this.waveTile = this.physics.add.sprite(i * this.tileSize, this.waveStartY, 'water', 64).refreshBody();
            this.waveTile.depth = 20;
            this.waveTile.setVelocityY(this.waveVelocityY);
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
        this.load.spritesheet('boats', 'assets/boats.png', { 
            frameWidth: 32, 
            frameHeight: 32
        }); 
        this.load.spritesheet('characters', 'assets/characters.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('beach', 'assets/beach.png', {
            frameWidth: 32,
            frameHeight: 32
        })
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
                if(e.event.movementX > 0) this.customControls.left = e.event.movementX;
                if(e.event.movementX < 0) this.customControls.right = e.event.movementX;
                if(e.event.movementY > 0) this.customControls.up = e.event.movementY;
                if(e.event.movementY < 0) this.customControls.down = e.event.movementY;
            }
        }
    }

    handleRelease(e) {
        if(e.event.changedTouches) {
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

    handleOut() {
        this.customControls.active = false;
        this.customControls.left = false;
        this.customControls.up = false;
        this.customControls.right = false;
        this.customControls.down = false;
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