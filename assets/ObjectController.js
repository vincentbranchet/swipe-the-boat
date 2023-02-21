import Debris from './Debris';
import Rock from './Rock';

export default class ObjectController {
    constructor(chunk) {
        this.chunk = chunk;
        this.rocksData = [
            {id: 1, size: 1, key: 112, spawnRates: [
                {lv: 0, spawnRate: 0},
                {lv: 1, spawnRate: 0.01},
                {lv: 2, spawnRate: 0.02},
                {lv: 3, spawnRate: 0.03},
                {lv: 4, spawnRate: 0.04},
                {lv: 5, spawnRate: 0.05},
                {lv: 6, spawnRate: 0.04},
                {lv: 7, spawnRate: 0.03},
                {lv: 8, spawnRate: 0.02},
                {lv: 9, spawnRate: 0.01},
                {lv: 10, spawnRate: 0},
            ]},
            {id: 2, size: 2, key: 109, spawnRates: [
                {lv: 0, spawnRate: 0},
                {lv: 1, spawnRate: 0},
                {lv: 2, spawnRate: 0.01},
                {lv: 3, spawnRate: 0.02},
                {lv: 4, spawnRate: 0.03},
                {lv: 5, spawnRate: 0.04},
                {lv: 6, spawnRate: 0.05},
                {lv: 7, spawnRate: 0.04},
                {lv: 8, spawnRate: 0.03},
                {lv: 9, spawnRate: 0.02},
                {lv: 10, spawnRate: 0.01},
            ]},
            {id: 3, size: 3, key: 113, spawnRates: [
                {lv: 0, spawnRate: 0},
                {lv: 1, spawnRate: 0},
                {lv: 2, spawnRate: 0},
                {lv: 3, spawnRate: 0.01},
                {lv: 4, spawnRate: 0.02},
                {lv: 5, spawnRate: 0.03},
                {lv: 6, spawnRate: 0.04},
                {lv: 7, spawnRate: 0.05},
                {lv: 8, spawnRate: 0.04},
                {lv: 9, spawnRate: 0.03},
                {lv: 10, spawnRate: 0.02},
            ]},
            {id: 4, size: 4, key: 108, spawnRates: [
                {lv: 0, spawnRate: 0},
                {lv: 1, spawnRate: 0},
                {lv: 2, spawnRate: 0},
                {lv: 3, spawnRate: 0},
                {lv: 4, spawnRate: 0.01},
                {lv: 5, spawnRate: 0.02},
                {lv: 6, spawnRate: 0.03},
                {lv: 7, spawnRate: 0.04},
                {lv: 8, spawnRate: 0.05},
                {lv: 9, spawnRate: 0.04},
                {lv: 10, spawnRate: 0.03},
            ]},
            {id: 5, size: 5, key: 111, spawnRates: [
                {lv: 0, spawnRate: 0},
                {lv: 1, spawnRate: 0},
                {lv: 2, spawnRate: 0},
                {lv: 3, spawnRate: 0},
                {lv: 4, spawnRate: 0},
                {lv: 5, spawnRate: 0.01},
                {lv: 6, spawnRate: 0.02},
                {lv: 7, spawnRate: 0.03},
                {lv: 8, spawnRate: 0.04},
                {lv: 9, spawnRate: 0.05},
                {lv: 10, spawnRate: 0.04},
            ]},
            {id: 6, size: 6, key: 110, spawnRates: [
                {lv: 0, spawnRate: 0},
                {lv: 1, spawnRate: 0},
                {lv: 2, spawnRate: 0},
                {lv: 3, spawnRate: 0},
                {lv: 4, spawnRate: 0},
                {lv: 5, spawnRate: 0},
                {lv: 6, spawnRate: 0.01},
                {lv: 7, spawnRate: 0.02},
                {lv: 8, spawnRate: 0.03},
                {lv: 9, spawnRate: 0.04},
                {lv: 10, spawnRate: 0.05},
            ]},
        ];

        this.debrisData = {
            id: 1, 
            key: 139, 
            spawnRates: [
                {lv: 0, spawnRate: 0.001},
                {lv: 1, spawnRate: 0.001},
                {lv: 2, spawnRate: 0.001},
                {lv: 3, spawnRate: 0.001},
                {lv: 4, spawnRate: 0.001},
                {lv: 5, spawnRate: 0.001},
                {lv: 6, spawnRate: 0.001},
                {lv: 7, spawnRate: 0.001},
                {lv: 8, spawnRate: 0.001},
                {lv: 9, spawnRate: 0.001},
                {lv: 10, spawnRate: 0.001},
            ]};
    }

    /**
     * For each rock time, look for data for current level, runs a spawn check for each tile on chunk, and spawns rock on random chunk tiles
     * Called once on each loaded chunk
     * @param {*} chunk 
     */
    spawnRocks(chunk) {
        if(chunk) {
            const lv = chunk.scene.level.id;
            this.rocksData.forEach(rock => {
                const rockDataForLevel = rock.spawnRates.find(r => r.lv === lv);
                if(rockDataForLevel && rockDataForLevel.spawnRate) {
                    let toSpawn = 0;

                    for(let i = 0; i < (chunk.scene.chunkSize * chunk.scene.chunkSize); i++) {
                        const diceThrow = Math.random();

                        if(diceThrow < rockDataForLevel.spawnRate) {
                            toSpawn++;
                        }
                    }

                    if(toSpawn > 0) {
                        console.log(`Spawning ${toSpawn} rocks of id ${rock.id}`);
                    }
        
                    for(let i = 0; i < toSpawn; i++) {
                        const x = Math.floor(Math.random() * (chunk.maxX - chunk.minX) + chunk.minX);
                        const y = Math.floor(Math.random() * (chunk.maxY - chunk.minY) + chunk.minY);

                        const newRock = new Rock(chunk.scene, x, y, rock);
                        // If we don't add it to both physics and scene it doesn't show up on screen
                        chunk.scene.add.existing(newRock);
                        chunk.scene.physics.add.existing(newRock);
                        newRock.body.depth = 20;

                        chunk.scene.physics.add.overlap(chunk.scene.player.boat, newRock, chunk.scene.player.handleTouchedRock, null, chunk.scene.player);
                    }
                }
            });
        }
    }

    /**
     * Looks for debris data for current level, runs a spawn check for each tile on chunk, and spawns debris on random chunk tiles
     * Called once on each loaded chunk
     * @param {*} chunk 
     */
    spawnDebris(chunk) {
        if(chunk) {
            const lv = chunk.scene.level.id;
            
            const debrisDataForLevel = this.debrisData.spawnRates.find(d => d.lv === lv);
            if(debrisDataForLevel && debrisDataForLevel.spawnRate) {
                let toSpawn = 0;

                for(let i = 0; i < (chunk.scene.chunkSize * chunk.scene.chunkSize); i++) {
                    const diceThrow = Math.random();

                    if(diceThrow < debrisDataForLevel.spawnRate) {
                        toSpawn++;
                    }
                }

                if(toSpawn > 0) {
                    console.log(`Spawning ${toSpawn} debris of id ${this.debrisData.id}`);
                } 
    
                for(let i = 0; i < toSpawn; i++) {
                    const x = Math.floor(Math.random() * (chunk.maxX - chunk.minX) + chunk.minX);
                    const y = Math.floor(Math.random() * (chunk.maxY - chunk.minY) + chunk.minY);

                    const newDebris = new Debris(chunk.scene, x, y, this.debrisData.key);
                    chunk.scene.add.existing(newDebris);
                    chunk.scene.physics.add.existing(newDebris);
                    newDebris.body.depth = 20;

                    chunk.scene.physics.add.overlap(chunk.scene.player.boat, newDebris, chunk.scene.player.handleTouchedDebris, null, chunk.scene.player);
                }
            }
            
        }
    }
}