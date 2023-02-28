import PlayerBoat from "./PlayerBoat.js";
import WaveTile from "./WaveTile.js";

export default class PlayerCharacter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'characters', 12);
        this.boat = null;
        this.shield = [];
        this.maxSpeed = 100;
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
        this.boat.body.maxSpeed = this.maxSpeed;

        console.log(`Boat was created with body size (${this.boat.body.width}, ${this.boat.body.height}).`);
    }

    /**
     * Collision callback between player and loot
     * @param {Phaser.GameObjects.Sprite} boat
     * @param {Phaser.GameObjects.Sprite} loot
     */
    handleTouchedLoot(boat, loot) {
        console.log('Player has touched a loot.');

        if(loot.active) {
            const boat = this.boat;

            const newShieldYOffset = 34;
            const newShieldXOffset = (this.shield.length * 8 + 12) + (this.shield.length / 2 * 8);
            const shieldWidth = this.shield.length === 0 ? 16 : 8;
            const shieldHeight = 16;

            const newShield = new WaveTile(this.scene, boat.body.x - newShieldXOffset, boat.body.y - newShieldYOffset);

            newShield.body.size = shieldWidth;
            newShield.displayWidth = shieldWidth;
            newShield.displayHeight = shieldHeight;

            this.shield.push(newShield);

            this.loot += 1;

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
