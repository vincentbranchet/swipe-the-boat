export default class PlayerCharacter {
    constructor(scene) {
        this.scene = scene;
        this.boat = [];
        this.characters = [];
    }

    init() {
        this.boat = this.scene.physics.add.group();
        const raft = this.scene.physics.add.sprite(0, -100, 'beach', 20).refreshBody();
        this.boat.add(raft);
        this.boat.setDepth(1);
        this.boat.getChildren().forEach(b => b.setDrag(50));
        this.boat.getChildren().forEach(b => b.body.setMaxSpeed(this.maxSpeed));

        this.characters = this.scene.physics.add.group();
        const adam = this.scene.physics.add.sprite(0, -100, 'characters', 12).refreshBody();
        this.characters.add(adam);
        this.characters.setDepth(10);
    }
}