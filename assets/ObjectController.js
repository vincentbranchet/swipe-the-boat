import Debris from './Debris';
import Rock from './Rock';

export default class ObjectController {
    constructor(chunk) {
        this.chunk = chunk;
        this.rocksSpawnRanges = [
            {id: 1, size: 1, key: 112, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 3},
                {lv: 4, min: 2, max: 5},
                {lv: 5, min: 3, max: 7},
            ]},
            {id: 2, size: 2, key: 109, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 3, size: 3, key: 113, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 4, size: 4, key: 108, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 5, size: 5, key: 111, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 6, size: 6, key: 110, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
        ];

        this.debrisSpawnRanges = [
            {id: 1, key: 139, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 2},
                {lv: 4, min: 1, max: 3},
                {lv: 5, min: 1, max: 3},
            ]},
            {id: 2, key: 139, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 2},
                {lv: 4, min: 1, max: 3},
                {lv: 5, min: 1, max: 3},
            ]},
            {id: 3, key: 139, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 2},
                {lv: 4, min: 1, max: 3},
                {lv: 5, min: 1, max: 3},
            ]},
            {id: 4, key: 139, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 2},
                {lv: 4, min: 1, max: 3},
                {lv: 5, min: 1, max: 3},
            ]},
            {id: 5, key: 139, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 2},
                {lv: 4, min: 1, max: 3},
                {lv: 5, min: 1, max: 3},
            ]},
            {id: 6, key: 139, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 2},
                {lv: 4, min: 1, max: 3},
                {lv: 5, min: 1, max: 3},
            ]},
        ];
    }

    spawnRocks(chunk) {
        if(chunk) {
            const lv = chunk.scene.level;
             // Each rock has a range based on difficulty level
             // For each rock, spawn in their range on random (x, y) belonging to chunk
            this.rocksSpawnRanges.forEach(rock => {
                const ranges = rock.ranges.find(r => r.lv === lv);
                if(ranges && (ranges.min !== 0 && ranges.max !== 0)) {
                    const toSpawn = Math.round(Math.random() * (ranges.max - ranges.min) + ranges.min);
                    console.log(`Spawning ${toSpawn} rocks of id ${rock.id}`);
        
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

    spawnDebris(chunk) {
        if(chunk) {
            const lv = chunk.scene.difficulty;
            this.debrisSpawnRanges.forEach(debris => {
                const ranges = debris.ranges.find(d => d.lv === lv);
                if(ranges && (ranges.min !== 0 && ranges.max !== 0)) {
                    const toSpawn = Math.round(Math.random() * (ranges.max - ranges.min) + ranges.min);
                    console.log(`Spawning ${toSpawn} debris of id ${debris.id}`);
        
                    for(let i = 0; i < toSpawn; i++) {
                        const x = Math.floor(Math.random() * (chunk.maxX - chunk.minX) + chunk.minX);
                        const y = Math.floor(Math.random() * (chunk.maxY - chunk.minY) + chunk.minY);

                        const newDebris = new Debris(chunk.scene, x, y, debris.key);
                        chunk.scene.add.existing(newDebris);
                        chunk.scene.physics.add.existing(newDebris);
                        newDebris.body.depth = 20;

                        chunk.scene.physics.add.overlap(chunk.scene.player.boat, newDebris, chunk.scene.player.handleTouchedDebris, null, chunk.scene.player);
                    }
                }
            });
        }
    }
}