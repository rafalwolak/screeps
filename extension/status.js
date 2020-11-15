module.exports = {
  /**
   * Check if any of extension is building now
   */
  isAnyInProgress: (spawn, top, left, bottom, right) => {
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
};
