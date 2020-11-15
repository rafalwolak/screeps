module.exports = {

    /** @param {Spawn} spawn **/
    nearest: (spawn) => {
        return spawn.room.lookForAtArea(LOOK_CONSTRUCTION_SITES, 0, 0, 49, 49, true)
            .map(area => {
                const pos = spawn.room.getPositionAt(Number(area.x), Number(area.y));
                const path = spawn.room.findPath(spawn.pos, pos);

                area.pathLength = path.length;

                return area;
            }).sort((a, b) => a.pathLength - b.pathLength);
    }
};