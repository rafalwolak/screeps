module.exports = {

    /**
     * @param {Spawn} spawn
     * @param {string} structureType
     */
    nearest: (spawn, structureType) => {
        return spawn.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: structureType ? { structureType: structureType } : {}
        })
            .map(target => {
                const path = spawn.pos.findPathTo(target);
                target.pathLength = path.length;

                return target;
            }).sort((a, b) => a.pathLength - b.pathLength);
    }
};