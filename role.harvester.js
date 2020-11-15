const creepVisualizePathStyle = {
  strokeWidth: .05,
  opacity: 0.9,
  lineStyle: undefined
};

const roleHarvester = {

    /** @param {Creep} creep **/
    run: (creep) => {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);

            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#FFAF33'}});
            }
        }
        else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
