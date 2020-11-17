module.exports = {
  nearest: (creep) => {
    return creep.room
      .find(FIND_SOURCES)
      .map(target => {
        const path = creep.pos.findPathTo(target);
        target.pathLength = path.length;
        return target;
      })
      .sort((a, b) => a.pathLength - b.pathLength);
  }
};
