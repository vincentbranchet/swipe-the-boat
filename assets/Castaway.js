export default class Castaway {

    constructor(chunk) {
        this.chunk = chunk;
        this.spawnRate = (1 / Math.round(Math.log(scene.difficulty) * 10));
    }

    spawn(x, y) {
        let people = this.chunk.scene.physics.add.sprite(x, y, 'characters', 12).refreshBody();
        this.chunk.people.add(people);
    }
}