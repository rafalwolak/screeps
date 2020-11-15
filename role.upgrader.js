const creepVisualizePathStyle = {
  strokeWidth: .05,
  opacity: 0.9,
  lineStyle: undefined
};

const roleUpgrader = {

    /** @param {Creep} creep **/
    run: (creep) => {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }

        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#ffffff'}});
            }
        } else {
          const sources = creep.room
            .find(FIND_SOURCES)
            .map(target => {
              const path = creep.pos.findPathTo(target);
              target.pathLength = path.length;
              return target;
            })
            .sort((a, b) => a.pathLength - b.pathLength);

            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {...creepVisualizePathStyle, stroke: '#6BFF33'}});
            }
        }
    }
};

module.exports = roleUpgrader;
