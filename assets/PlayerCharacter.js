import PlayerBoat from "./PlayerBoat.js";
import WaveTile from "./WaveTile.js";
import ShieldController from "./ShieldController.js";

export default class PlayerCharacter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'characters', 12);
        this.boat = null;
        this.shield = [];
        this.shieldUpdateFramesCount = 0;
        this.debutWidth = 10;
        this.debutHeight = 20;
        this.loot = 0;
        this.depth = 10;

        scene.physics.world.enableBody(this);
        scene.add.existing(this);
    }

    init() {
        this.boat = new PlayerBoat(this.scene, 0, -100);

        this.boat.body.setSize(this.debutWidth, this.debutHeight);
        this.boat.body.drag.x = 50;
        this.boat.body.drag.y = 50;
        this.boat.body.maxSpeed = 150;

        console.log(`Boat was created with body size (${this.boat.body.width}, ${this.boat.body.height}).`);
    }

    updateShield() {
        const shieldSize = ShieldController.getShieldLength(this.boat.body.speed);
        if(this.shield.length !== shieldSize) {
            this.shieldUpdateFramesCount ++;

            if(this.shieldUpdateFramesCount >= 24) {
                for(let i in this.shield) {
                    this.shield[i].destroy();
                }
                this.shield = [];
                for(let i = 0; i < shieldSize; i++) {
                    const newShield = new WaveTile(this.scene, this.boat.body.x, this.boat.body.y);

                    newShield.body.size = ShieldController.width;
                    newShield.displayWidth = ShieldController.width;
                    newShield.displayHeight = ShieldController.height;

                    this.shield.push(newShield);
                }
                this.shieldUpdateFramesCount = 0;
            }
        }

        if(this.shield.length > 0) {
            for(let i = 0; i < this.shield.length; i++) {
                this.shield[i].body.x = this.boat.x - ShieldController.getXOffset(i) + (this.shield.length / 2 * ShieldController.width);
                this.shield[i].body.y = this.boat.y - ShieldController.getYOffset();

                this.scene.physics.add.overlap(this.shield[i], this.scene.rocks, this.scene.player.handleTouchedRock, null, this.scene.player);
            }
        }
    }

    /**
     * Collision callback between player and loot
     * @param {Phaser.GameObjects.Sprite} boat
     * @param {Phaser.GameObjects.Sprite} loot
     */
    handleTouchedLoot(boat, loot) {
        console.log('Player has touched a loot.');

        if(loot.active) {
            this.loot += 1;
            this.boat.body.maxSpeed += loot.reward;

            loot.destroy();
        }
    }

    /**
     * Collision callback between player and rock
     * @param {Phaser.GameObjects.Sprite} boat
     * @param {Phaser.GameObjects.Sprite} rock
     */
    /**
     * TODO : play animation
     */
    handleTouchedRock(boat, rock) {
        console.log(`Player has touched a rock at ${rock.x}, ${rock.y}. (P Size : ${this.shield.length}, R breaks at : ${rock.breaksAt})`);

        if(this.shield.length >= rock.breaksAt) {
            rock.destroy();
        }
        else {
            this.scene.scene.stop();
            this.scene.scene.start('GameOver');
        }

    }
}
