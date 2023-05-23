import Loot from './Loot.js';
import Rock from './Rock.js';

export default class ObjectController {
        static rocksData = [
            {id: 1, size: 16, key: 112, maxPerChunk: 35, breaksAt: 2, spawnMin: 0.0050, spawnFactor: 1.5},
            {id: 1, size: 24, key: 109, maxPerChunk: 25, breaksAt: 3, spawnMin: 0.0010, spawnFactor: 2},
            {id: 1, size: 32, key: 113, maxPerChunk: 15, breaksAt: 4, spawnMin: 0.0005, spawnFactor: 2.5},
            {id: 1, size: 40, key: 108, maxPerChunk: 10, breaksAt: 5, spawnMin: 0.0001, spawnFactor: 3},
            {id: 1, size: 48, key: 111, maxPerChunk: 5, breaksAt: 6, spawnMin: 0.00005, spawnFactor: 4},
            {id: 1, size: 16, key: 110, maxPerChunk: 3, breaksAt: 7, spawnMin: 0.00001, spawnFactor: 5},
        ];
        static lootData = {
            id: 1,
            key: 153,
            reward: 5, 
            spawnRates: [
                {lv: 0, spawnRate: 0.0005},
                {lv: 1, spawnRate: 0.0005},
                {lv: 2, spawnRate: 0.0005},
                {lv: 3, spawnRate: 0.0005},
                {lv: 4, spawnRate: 0.0005},
                {lv: 5, spawnRate: 0.0005},
                {lv: 6, spawnRate: 0.0005},
                {lv: 7, spawnRate: 0.0005},
                {lv: 8, spawnRate: 0.0005},
                {lv: 9, spawnRate: 0.0005},
                {lv: 10, spawnRate: 0.0005},
            ]};
    

    /**
     * For each rock time, look for data for current level, runs a spawn check for each tile on chunk, and spawns rock on random chunk tiles
     * Called once on each loaded chunk
     * @param {*} chunk
     */
    static spawnRocks(chunk) {
        if(chunk) {
            this.rocksData.forEach(rock => {
                for(let i = 0; i < rock.maxPerChunk; i++) {
                    const distanceFromStart = Phaser.Math.Distance.Between(chunk.x, chunk.y, 0, 0); // TODO : set as Chunk prop
                    const diceThrow = Math.random();

                    if(diceThrow < (rock.spawnMin)) { // TODO : add spawn factor (higher rate with higher distance)
                        console.log(`Spawning a rock of id ${rock.id} at ${distanceFromStart} from start`);

                        const x = Math.floor(Math.random() * ((chunk.maxX - rock.size) - (chunk.minX + rock.size)) + (chunk.minX + rock.size));
                        const y = Math.floor(Math.random() * ((chunk.maxY - rock.size) - (chunk.minY + rock.size)) + (chunk.minY + rock.size));
    
                        const newRock = new Rock(chunk.scene, x, y, rock);
                        chunk.scene.add.existing(newRock);
                        chunk.scene.physics.add.existing(newRock);
                        chunk.scene.rocks.add(newRock);
                        newRock.body.depth = 20;
                        newRock.body.size = rock.size
    
                        chunk.scene.physics.add.overlap(chunk.scene.player.boat, newRock, chunk.scene.player.handleTouchedRock, null, chunk.scene.player);
                        const shield = chunk.scene.player.shield;
                        for(let i = 0; i < shield.length; i++) {
                            chunk.scene.physics.add.overlap(shield[i], newRock, chunk.scene.player.handleTouchedRock, null, chunk.scene.player);
                        }
                    }

                }
            })
        }
    }

    /**
     * Looks for loot data for current level, runs a spawn check for each tile on chunk, and spawns loot on random chunk tiles
     * Called once on each loaded chunk
     * @param {*} chunk
     */
    static spawnLoot(chunk) {
        if(chunk) {
            const lv = chunk.scene.level.id;

            const lootDataForLevel = this.lootData.spawnRates.find(d => d.lv === lv);
            if(lootDataForLevel && lootDataForLevel.spawnRate) {
                let toSpawn = 0;

                for(let i = 0; i < (chunk.scene.chunkSize * chunk.scene.chunkSize); i++) {
                    const diceThrow = Math.random();

                    if(diceThrow < lootDataForLevel.spawnRate) {
                        toSpawn++;
                    }
                }

                if(toSpawn > 0) {
                    console.log(`Spawning ${toSpawn} loots of id ${this.lootData.id}`);
                }

                for(let i = 0; i < toSpawn; i++) {
                    const x = Math.floor(Math.random() * (chunk.maxX - chunk.minX) + chunk.minX);
                    const y = Math.floor(Math.random() * (chunk.maxY - chunk.minY) + chunk.minY);

                    const newLoot = new Loot(chunk.scene, x, y, this.lootData.key, this.lootData.reward);
                    chunk.scene.add.existing(newLoot);
                    chunk.scene.physics.add.existing(newLoot);
                    chunk.scene.loots.add(newLoot);
                    newLoot.body.depth = 20;

                    chunk.scene.physics.add.overlap(chunk.scene.player.boat, newLoot, chunk.scene.player.handleTouchedLoot, null, chunk.scene.player);
                }
            }

        }
    }
}
