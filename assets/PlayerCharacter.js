export default class PlayerCharacter {
    constructor(scene) {
        this.scene = scene;
        this.boat = [];
        this.characters = [];
        this.maxSpeed = 100;
        this.debutWidth = 10;
        this.debutHeight = 20;
        this.size = 1;
    }

    init() {
        this.boat = this.scene.physics.add.group();
        this.characters = this.scene.physics.add.group();

        const raft = this.scene.physics.add.sprite(0, -100, 'beach', 20).refreshBody();
        
        raft.body.setSize(this.debutWidth, this.debutHeight);
        
        this.boat.add(raft);
        this.boat.setDepth(1);
        this.boat.getChildren().forEach(b => b.setDrag(50));
        this.boat.getChildren().forEach(b => b.body.setMaxSpeed(this.maxSpeed));

        console.log(`Boat was created with body size (${raft.body.width}, ${raft.body.height}).`);
        
        const adam = this.scene.physics.add.sprite(0, -100, 'characters', 12).refreshBody();
        
        this.characters.add(adam);
        this.characters.setDepth(10);
    }

    /**
     * TODO : clean overlap callbacks code to fetch bodies properly
     */

    /**
     * Callback called when the player collides with a debris.
     * Context : Debris
     */
    handleTouchedDebris() {
        console.log('Player has touched a debris.');
        
        if(this.body.active) {
            const player = this.chunk.scene.player;
            const boat = player.boat.getChildren()[0];
            const newBodySize = {width: Math.round(boat.body.width * 1.1), height: Math.round(boat.body.height * 1.1)};
            const newDisplaySize = {width: Math.round(boat.width * 1.1), height: Math.round(boat.height * 1.1)};
            const currentZoom = this.chunk.scene.cameras.main.zoom;

            console.log(`Player body current size is ${boat.body.width} x ${boat.body.height}`);
            
            player.maxSpeed = player.maxSpeed + 20;
            player.size = player.size + 1;
            boat.body.setSize(newBodySize.width, newBodySize.width);
            boat.displayWidth = newDisplaySize.width;
            boat.displayHeight = newDisplaySize.height;
            boat.body.setMaxSpeed(player.maxSpeed);

            console.log(`Changed player body size to ${boat.body.width} x ${boat.body.height}`);

            this.chunk.scene.score++;
            this.chunk.scene.cameras.main.setZoom(currentZoom - 0.05);
            this.body.destroy();
        }
    }

    /**
     * Collision callback between player and rock
     * @param {Phaser.GameObjects.Sprite} boat
     * @param {Phaser.GameObjects.Sprite} rock 
     */
    /**
     * TODO : play animation
     * TODO : check player size from parameter (with player rewritten as instance of Sprite)
     */
    handleTouchedRock(boat, rock) {
        const player = this.chunk.scene.player;
        console.log(`Player has touched a rock at ${rock.x}, ${rock.y}. (P Size : ${player.size}, R Size : ${rock.size})`);

        if(player.size > rock.size) {
            rock.destroy();
        }
        else {
            this.chunk.scene.scene.stop();
            this.chunk.scene.scene.start('GameOver');
        }
        
    }
}