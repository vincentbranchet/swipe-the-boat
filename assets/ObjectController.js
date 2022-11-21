import Debris from './Debris';
import Rock from './Rock';

export default class ObjectController {
    constructor(chunk) {
        this.chunk = chunk;
        this.rocksSpawnRanges = [
            {id: 1, key: 112, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 1},
                {lv: 2, min: 0, max: 2},
                {lv: 3, min: 1, max: 3},
                {lv: 4, min: 2, max: 5},
                {lv: 5, min: 3, max: 7},
            ]},
            {id: 2, key: 109, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 3, key: 113, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 4, key: 108, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 5, key: 111, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
            {id: 6, key: 110, ranges: [
                {lv: 0, min: 0, max: 0},
                {lv: 1, min: 0, max: 0},
                {lv: 2, min: 0, max: 0},
                {lv: 3, min: 0, max: 0},
                {lv: 4, min: 0, max: 0},
                {lv: 5, min: 0, max: 0},
            ]},
        ];
    }

    spawnObstacleOrResource(x, y) {
         const debris = new Debris(this.chunk);
         const rock = new Rock(this.chunk);
         const prob = (Math.random() * 100);
         
         if(prob < debris.spawnRate) {
             debris.spawn(x, y);
         }
    }

    spawnRocks(chunk) {
        if(chunk) {
            const lv = chunk.scene.difficulty;
            console.log(`Checking for rocks to spawn in chunk (${chunk.x}, ${chunk.y}) (level ${lv})`);
             // Each rock has a range based on difficulty level
             // For each rock, spawn in their range on random (x, y) belonging to chunk
            this.rocksSpawnRanges.forEach(rock => {
                const ranges = rock.ranges.find(r => r.lv === lv);
                if(ranges && (ranges.min !== 0 && ranges.max !== 0)) {
                    const toSpawn = Math.round(Math.random() * (ranges.max - ranges.min) + ranges.min);
                    console.log(`Spawning ${toSpawn} rocks of id ${rock.id}`);
        
                    for(let i = 0; i < toSpawn; i++) {
                        const newRock = new Rock(chunk, rock.key);
                        const x = Math.floor(Math.random() * (chunk.maxX - chunk.minX) + chunk.minX);
                        const y = Math.floor(Math.random() * (chunk.maxY - chunk.minY) + chunk.minY);
                        newRock.spawn(x, y);
                    }
                }
            });
        }
    }
}