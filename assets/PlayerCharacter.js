import PlayerBoat from "./PlayerBoat";

export default class PlayerCharacter extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'characters', 12);
        this.boat = null;
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
            const newBodySize = {width: Math.round(boat.body.width * 1.1), height: Math.round(boat.body.height * 1.1)};
            const newDisplaySize = {width: Math.round(boat.displayWidth * 1.1), height: Math.round(boat.displayHeight * 1.1)};
            const currentZoom = this.scene.cameras.main.zoom;

            console.log(`Player body current size is ${boat.body.width} x ${boat.body.height}`);
            console.log(`Player sprite current size is ${boat.displayWidth} x ${boat.displayHeight}`);
            
            this.maxSpeed = this.maxSpeed + 20;
            this.size = this.size + 1;
            boat.body.setSize(newBodySize.width, newBodySize.width);
            boat.displayWidth = newDisplaySize.width;
            boat.displayHeight = newDisplaySize.height;
            boat.body.setMaxSpeed(this.maxSpeed);

            console.log(`Player body current size is ${boat.body.width} x ${boat.body.height}`);
            console.log(`Player sprite current size is ${boat.displayWidth} x ${boat.displayHeight}`);
            
            this.scene.score++;
            this.scene.cameras.main.setZoom(currentZoom - 0.05);
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