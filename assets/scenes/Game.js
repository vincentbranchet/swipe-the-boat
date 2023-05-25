import Chunk from "../Chunk.js";
import PlayerCharacter from "../PlayerCharacter.js";

class Game extends Phaser.Scene {
    constructor() {
        super({key: 'Game'});
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
        this.rocks = null;
        this.loots = null;
        this.totalDistance = null;
        this.playerStartX = 0;
        this.playerStartY = -100;
        this.debug = document.getElementById('debug');
        this.UI = {
            playerLoot: document.getElementById('playerLoot'),
            closestLootIndicator: null,
        };
    }

    init() {
        this.smoothZoom(this.input);
        this.totalDistance = null;
    }

    smoothZoom(inputs) {
        let zoom = setTimeout(() => {
            this.cameras.main.zoomTo(2.5);
        }, 4000);
    }

    update() {
        const boat = this.player.boat;
        // retrieve position of chunk where follow point is
        let snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(boat.x / (this.chunkSize * this.tileSize));
        let snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(boat.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

        // create chunks around position if they don't exist
        let chunkPositions = '';
        for(let x = snappedChunkX - 2; x < snappedChunkX + 3; x++) {
            for(let y = snappedChunkY - 4; y < snappedChunkY + 2; y++) {
                const existingChunk = this.getChunk(x, y);
                if(existingChunk == null) {
                    chunkPositions = chunkPositions.concat('('+x+', '+y+') ');
                    const newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }

        chunkPositions != '' ? console.log(`Created chunks around (${snappedChunkX}, ${snappedChunkY}) in ${chunkPositions}`) : null;

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
            boat.body.velocity.y = boat.body.velocity.y - this.customControls.speed * Math.abs(this.customControls.up * 0.5);
        }
        if(this.customControls.down) {
            boat.body.velocity.y = boat.body.velocity.y + this.customControls.speed * Math.abs(this.customControls.down * 0.5);
        }
        if(this.customControls.right) {
            boat.body.velocity.x = boat.body.velocity.x + this.customControls.speed * Math.abs(this.customControls.right * 0.5);
        }
        if(this.customControls.left) {
            boat.body.velocity.x = boat.body.velocity.x - this.customControls.speed * Math.abs(this.customControls.left * 0.5);
        }


        // player objects position
        this.player.body.x = boat.x - 16;
        this.player.body.y = boat.y - 32;
        this.player.updateShield();

        // camera
        this.cameras.main.centerOn(boat.x, boat.y - 40);

        // UI
        this.UI.playerLoot.innerHTML = this.player.loot;
        this.UI.closestLootIndicator.depth = -1;

        let closestLoot = {exists: false, x: 0, y: 0, d: 0, indicatorTopPosition: 0, indicatorLeftPosition: 0};
        const loots = this.loots.getChildren();
        if(loots.length > 0) {
            loots.forEach(l => {
                const d = Math.round(Phaser.Math.Distance.Between(l.body.x, l.body.y, this.player.body.x, this.player.body.y));
                if((closestLoot.x === 0 && closestLoot.y === 0) || d < closestLoot.d) {
                    closestLoot = {x: Math.round(l.body.x), y: Math.round(l.body.y), d: d};
                    closestLoot.exists = true;
                }
            });
        }

        const offset = 10;
        const closestLootIsOffscreenX = closestLoot.x < this.cameras.main.worldView.left + offset ||
            closestLoot.x > this.cameras.main.worldView.right - offset;
        const closestLootIsOffscreenY = closestLoot.y < this.cameras.main.worldView.top + offset ||
            closestLoot.y > this.cameras.main.worldView.bottom - offset;

        if(closestLoot.exists && (closestLootIsOffscreenX || closestLootIsOffscreenY)) {
            /**
             * Offscreen closest loot UI is placed thanks to the slope y-intercept formula and someone from Unity forums
             * source : https://answers.unity.com/questions/1607125/off-camera-view-object-tracker.html
             */
            this.UI.closestLootIndicator.depth = 100;
            const slope = (closestLoot.y - this.player.body.y) / (closestLoot.x - this.player.body.x);
            const intercept = this.player.body.y + (-slope * this.player.body.x);
            this.UI.closestLootIndicator.x = this.clamp(closestLoot.x, this.cameras.main.worldView.left + offset, this.cameras.main.worldView.right - offset);
            this.UI.closestLootIndicator.y = (slope * this.UI.closestLootIndicator.x) + intercept;

            if(this.UI.closestLootIndicator.y > this.cameras.main.worldView.bottom - offset || this.UI.closestLootIndicator.y < this.cameras.main.worldView.top + offset) {
                this.UI.closestLootIndicator.y = this.clamp(closestLoot.y, this.cameras.main.worldView.top + offset, this.cameras.main.worldView.bottom - offset);
                this.UI.closestLootIndicator.x = (this.UI.closestLootIndicator.y - intercept) / slope;
            }
        }


        // debug
        this.debug.innerHTML =
            `boat speed : ${Math.round(this.player.boat.body.speed)}
            <br /> max speed : ${this.player.boat.body.maxSpeed}
            <br /> player position : (${Math.round(this.player.body.x)}, ${Math.round(this.player.body.y)})
            <br /> closest loot : (${closestLoot.x}, ${closestLoot.y}) (${closestLoot.d})
            `;
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
        this.player = new PlayerCharacter(this, this.playerStartX, this.playerStartY);
        this.player.init();

        // rocks
        this.rocks = this.add.group();

        // loots
        this.loots = this.add.group();

        // controls
        this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // UI
        this.UI.closestLootIndicator = this.add.rectangle(-100, -300, 10, 10, 0x6666ff);
        this.UI.closestLootIndicator.depth = -1;
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

    clamp(num, min, max) {
         return Math.min(Math.max(num, min), max);
    }
}

export default Game;
