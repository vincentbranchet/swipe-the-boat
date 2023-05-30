export default class ShieldController {
    static lengths = [
        {size: 1, minSpeed: 110},
        {size: 2, minSpeed: 130},
        {size: 3, minSpeed: 150},
        {size: 4, minSpeed: 180},
        {size: 5, minSpeed: 220},
        {size: 6, minSpeed: 260},
        {size: 7, minSpeed: 300},
    ];
    static width = 8;
    static height = 16;

    static getShieldLength(playerSpeed) {
        let size = 0;
        for(let i in this.lengths) {
            if(this.lengths[i].minSpeed <= playerSpeed) size = this.lengths[i].size;
        }
        return size;
    }

    static offDirectionOffset() {
        return 34;
    }

    static directionOffset(size = 0) {
        return size * this.width + this.width;
    }

    static getCoords(size, directionAngle) {
        const coords = []

        if(directionAngle === 180) {
            for(let i = 0; i < size; i++) {
                coords.push({
                    x: 0 - ShieldController.directionOffset(i) + (size / 2 * ShieldController.width),
                    y: 0 + ShieldController.offDirectionOffset()
                })
            }
        } else if(directionAngle === 90) {
            for(let i = 0; i < size; i++) {
                coords.push({
                    x: 0 + ShieldController.offDirectionOffset(),
                    y: 0 - ShieldController.directionOffset(i) + (size / 2 * ShieldController.width)
                })
            }
        } else if(directionAngle === -90) {
            for(let i = 0; i < size; i++) {
                coords.push({
                    x: 0 - ShieldController.offDirectionOffset(),
                    y: 0 - ShieldController.directionOffset(i) + (size / 2 * ShieldController.width)
                })
            }
        } else {
            for(let i = 0; i < size; i++) {
                coords.push({
                    x: 0 - ShieldController.directionOffset(i) + (size / 2 * ShieldController.width),
                    y: 0 - ShieldController.offDirectionOffset()
                })
            }
        }

        return coords;
    }
}
