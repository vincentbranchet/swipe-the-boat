export default class PlayerCharacter {
    constructor(scene) {
        this.scene = scene;
        this.boat = [];
        this.characters = [];
        this.maxSpeed = 100;
        this.debutWidth = 10;
        this.debutHeight = 20;
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
            boat.body.setSize(newBodySize.width, newBodySize.width);
            boat.displayWidth = newDisplaySize.width;
            boat.displayHeight = newDisplaySize.height;
            boat.body.setMaxSpeed(player.maxSpeed);

            console.log(`Changed player body size to ${boat.width} x ${boat.height}`);

            this.chunk.scene.score++;
            this.chunk.scene.cameras.main.setZoom(currentZoom - 0.05);
            this.body.destroy();
        }
    }

    handleTouchedRock() {
        console.log(`Player has touched a rock at ${this.body.x}, ${this.body.y}`);
        
        this.chunk.scene.scene.stop();
        this.chunk.scene.scene.start('GameOver');
    }
}