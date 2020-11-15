const creepVisualizePathStyle = {
  strokeWidth: .05,
  opacity: 0.9,
  lineStyle: undefined
};

const roleBuilder = {

    /** @param {Creep} creep **/
    run: (creep) => {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest builder');
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#ffffff'}});
                }
            }
        }
        else {
          const sources = creep.room
            .find(FIND_SOURCES)
            .map(target => {
              const path = creep.pos.findPathTo(target);
              target.pathLength = path.length;
              return target;
            })
            .sort((a, b) => a.pathLength - b.pathLength);

            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;
