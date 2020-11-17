module.exports = {

    /**
     * @param {Spawn} spawn
     */
    nearest: (spawn) => {

        const roomLevel = spawn.room.controller.level;
        const extensionsLimit = CONTROLLER_STRUCTURES.extension[roomLevel];

        const top = spawn.pos.y - extensionsLimit;
        const left = spawn.pos.x - extensionsLimit;
        const bottom = top + extensionsLimit * 2;
        const right = left + extensionsLimit * 2;

        const look = spawn.room.lookAtArea(top, left, bottom, right, true);
        const areas = [];

        Object.keys(look).forEach(y => {
            const findY = y;
            const findX = Object.keys(look[y]).find(x => {
                const area = look[y][x];

                if (area && area.length == 1 && area[0].type == 'terrain' && area[0].terrain == 'plain') {
                    return true;
                }

                return false;
            });

            if (findX) {
                const pos = spawn.room.getPositionAt(Number(findX), Number(findY));
                const path = spawn.room.findPath(spawn.pos, pos);

                areas.push({
                    x: Number(findX),
                    y: Number(findY),
                    pathLength = path.length
                })
            }
        });

        return areas.sort((a, b) => a.pathLength - b.pathLength);
    }
};