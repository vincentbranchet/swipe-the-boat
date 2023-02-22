import PlayerBoat from "./PlayerBoat";
import PlayerBump from './PlayerBump';

export default class PlayerCharacter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'characters', 12);
        this.boat = null;
        this.bumps = [];
        this.maxSpeed = 100;
        this.debutWidth = 10;
        this.debutHeight = 20;
        this.size = 1;
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
     * Collision callback between player and debris
     * @param {Phaser.GameObjects.Sprite} boat
     * @param {Phaser.GameObjects.Sprite} debris
     */
    handleTouchedDebris(boat, debris) {
        console.log('Player has touched a debris.');
        
        if(debris.active) {
            const boat = this.boat;
            
            this.size = this.size + 1;

            const newBumpYOffset = this.bumps.length * 8 + 32;
            const newBump = new PlayerBump(this.scene, boat.body.x - 8, boat.body.y - newBumpYOffset);

            this.bumps.push(newBump);

            debris.destroy();
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
        console.log(`Player has touched a rock at ${rock.x}, ${rock.y}. (P Size : ${this.size}, R Size : ${rock.size})`);

        if(this.size > rock.size) {
            rock.destroy();
        }
        else {
            this.scene.scene.stop();
            this.scene.scene.start('GameOver');
        }
        
    }
}