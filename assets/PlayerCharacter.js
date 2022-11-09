export default class PlayerCharacter {
    constructor(scene) {
        this.scene = scene;
        this.boat = [];
        this.characters = [];
        this.maxSpeed = 100;
        this.debutWidth = 40;
        this.debutHeight = 40;
    }

    init() {
        this.boat = this.scene.physics.add.group();
        this.characters = this.scene.physics.add.group();

        const raft = this.scene.physics.add.sprite(0, -100, 'beach', 20).refreshBody();
        
        raft.width = this.debutWidth;
        raft.height = this.debutHeight;
        raft.displayWidth = this.debutWidth;
        raft.displayHeight = this.debutHeight;
        
        this.boat.add(raft);
        this.boat.setDepth(1);
        this.boat.getChildren().forEach(b => b.setDrag(50));
        this.boat.getChildren().forEach(b => b.body.setMaxSpeed(this.maxSpeed));

        console.log(`Boat was created with size (${raft.width}, ${raft.height}).`);
        
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
            const newSize = {width: Math.round(boat.width * 1.1), height: Math.round(boat.height * 1.1)};
            const currentZoom = this.chunk.scene.cameras.main.zoom;

            console.log(`Player current size is ${boat.width} x ${boat.height}`);
            
            player.maxSpeed = player.maxSpeed + 20;
            boat.width = boat.displayWidth = newSize.width;
            boat.height = boat.displayHeight = newSize.height;
            boat.body.setMaxSpeed(player.maxSpeed);

            console.log(`Changed player size to ${boat.width} x ${boat.height}`);

            this.chunk.scene.score++;
            this.chunk.scene.cameras.main.setZoom(currentZoom - 0.05);
            this.body.destroy();
        }
    }
}