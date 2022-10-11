import Debris from './Debris';
import Rock from './Rock';

export default class ObjectController {
    constructor(chunk) {
        this.chunk = chunk;
    }

    spawnObstacleOrResource(x, y) {
         const debris = new Debris(this.chunk);
         const rock = new Rock(this.chunk);
         const prob = (Math.random() * 100);
         
         if(prob < debris.spawnRate) {
             debris.spawn(x, y);
         }
         else if(prob < rock.spawnRate) {
            rock.spawn(x, y);
         }
    }
}