const visualizePathStyle = require('../utils/visualizePathStyle');
const findSource = require('../utils/findSource');

const creep = {

  /** @param {Spawn} spawn **/
  add: (spawn, x, y) => {
    const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'extension' && creep.memory.targetX == x && creep.memory.targetY == y);
    console.log('Extension Builders: ' + creeps.length);

    if (creeps.length < 3) {
      // get spawn capacity
      const spawnCapacity = spawn.store.getCapacity(RESOURCE_ENERGY) || 300;

      const newName = 'Extension Builder ' + Game.time;
      console.log('Spawning new extension builder: ' + newName);

      if (spawnCapacity > 300) {
        spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
          {memory: {role: 'extension', targetX: x, targetY: y}});
      } else {
        spawn.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
          {memory: {role: 'extension', targetX: x, targetY: y}});
      }
    }
  },

  /** @param {Creep} creep **/
  move: (creep) => {

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say('🔄 harvest');
    }

    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if (creep.memory.building) {
      const pos = creep.room.getPositionAt(creep.memory.targetX, creep.memory.targetY);
      const target = pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {...visualizePathStyle, stroke: '#F933FF'}});
        }
      }
    } else {
      const sources = findSource.nearest(creep);

      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {...visualizePathStyle, stroke: '#FFFFFF'}});
      }
    }
  }
};

module.exports = creep;
