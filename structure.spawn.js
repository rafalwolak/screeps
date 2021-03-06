const Spawn = {
  message: (spawn) => {
    if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
    
        spawn.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            {align: 'left', opacity: 0.8});
    }
  }
};

const Extension = {
  building: (spawn, top, left, bottom, right) => {
    const look = spawn.room.lookAtArea(top || 0, left || 0, bottom || 49, right || 49);

    return Object.keys(look).find(y => !!Object.keys(look[y]).find(x => {
        const area = look[y][x];

        if (area) {
          const constructionSite = area.find(t => t.type == 'constructionSite');

          if (constructionSite
              && constructionSite.constructionSite
              && constructionSite.constructionSite.structureType == 'extension'
              && constructionSite.constructionSite.progress !== constructionSite.constructionSite.progressTotal) {
            return true;
          }

          return false;
        }
      })
    );
  },
  creep: (spawn, x, y) => {
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
  }
};

const Upgrader = {
  creep: (spawn) => {
    const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + creeps.length);

    if (creeps.length < 3) {
      // get spawn capacity
      const spawnCapacity = spawn.store.getCapacity(RESOURCE_ENERGY) || 300;

      const newName = 'Upgrader ' + Game.time;
      console.log('Spawning new upgrader: ' + newName);

      if (spawnCapacity > 300) {
        spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
          {memory: {role: 'upgrader'}});
      } else {
        spawn.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
          {memory: {role: 'upgrader'}});
      }
    }
  }
};

const Builder = {
  creep: (spawn) => {
    const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + creeps.length);

    if (creeps.length < 3) {
      // get spawn capacity
      const spawnCapacity = spawn.store.getCapacity(RESOURCE_ENERGY) || 300;

      const newName = 'Builder ' + Game.time;
      console.log('Spawning new builder: ' + newName);

      if (spawnCapacity > 300) {
        spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
          {memory: {role: 'builder'}});
      } else {
        spawn.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
          {memory: {role: 'builder'}});
      }
    }
  }
};

const Harvester = {
  creep: (spawn) => {
    const creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + creeps.length);

    if (creeps.length < 3) {
      // get spawn capacity
      const spawnCapacity = spawn.store.getCapacity(RESOURCE_ENERGY) || 300;

      const newName = 'Harvester ' + Game.time;
      console.log('Spawning new harvester: ' + newName);

      if (spawnCapacity > 300) {
        spawn.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
          {memory: {role: 'harvester'}});
      } else {
        spawn.spawnCreep([WORK, WORK, CARRY, MOVE], newName,
          {memory: {role: 'harvester'}});
      }
    }
  }
};

const structureSpawn = {
  run: (spawn) => {

    // get spawn position
    const position = spawn.pos;
    const roomLevel = spawn.room.controller.level;
    console.log('Room level: ' + roomLevel);

    // get extensions
    const extensions = spawn.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION }
    });
    const extensionsLimit = CONTROLLER_STRUCTURES.extension[roomLevel];
    console.log('Spawn has ' + extensions.length + ' extensions available (limit: ' + extensionsLimit + ')');

    // look for free terrain
    const top = spawn.pos.y - extensionsLimit;
    const left = spawn.pos.x - extensionsLimit;
    const bottom = top + extensionsLimit * 2;
    const right = left + extensionsLimit * 2;

    console.log(top, left, bottom, right);
    const lookTerrain = spawn.room
      .lookAtArea(top, left, bottom, right);
    let blockBuildTick = 0;

    Object.keys(lookTerrain).forEach(y => {
      const extensionBuilding = Extension.building(spawn, top, left, bottom, right);
      const findY = y;
      const findX = Object.keys(lookTerrain[y]).find(x => {
        const terrain = lookTerrain[y][x];

        if (terrain && terrain.length == 1 && terrain[0].type == 'terrain' && terrain[0].terrain == 'plain') {
          return true;
        }

        return false;
      });

      if (findX && !extensionBuilding && !blockBuildTick) {
        spawn.room.createConstructionSite(Number(findX), Number(findY), STRUCTURE_EXTENSION);

        blockBuildTick++;
      }

      Extension.creep(spawn, Number(findX), Number(findY));

      if (blockBuildTick == 5) {
        blockBuildTick = 0;
      }
    });

    Upgrader.creep(spawn);

    Builder.creep(spawn);

    Harvester.creep(spawn);

    Spawn.message(spawn);
  }
}

module.exports = structureSpawn;
