const creepVisualizePathStyle = {
  strokeWidth: .05,
  opacity: 0.9,
  lineStyle: undefined
};

const roleExtension = {

    /** @param {Creep} creep **/
    run: (creep) => {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest extension');
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build extension');
        }

        if (creep.memory.building) {
            const pos = creep.room.getPositionAt(creep.memory.targetX, creep.memory.targetY);
            const target = pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#F933FF', }});
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
                creep.moveTo(sources[0], {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#FFFFFF'}});
            }
        }
    }
};

module.exports = roleExtension;
