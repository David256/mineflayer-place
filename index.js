const events = require('events');

const TIME_LOOP = 100;
module.exports = inject;

function inject(bot) {
  bot.place = new PlaceManager(bot);
}

class PlaceManager extends events.EventEmitter {
  constructor(bot, delay) {
    super();
    this.bot = bot;
    this.delay = delay || TIME_LOOP;
    this.places = new Map();
    this.entityStates = new Map();
    this.bot.on('spawn', () => {
      this.mainloop();
    });
  }

  register(name, v1, v2) {
    this.places.set(name, {v1:v1, v2:v2});
  }

  mainloop() {
    for (let key in this.bot.entities) {
      let entity = this.bot.entities[key];
      if (!entity) continue;
      for (let placename of this.places.keys()) {
        let place = this.places.get(placename);
        if (this.isEntityInPlace(entity, place)) {
          if (this.entityStates.has(entity.uuid)) {
            let map = this.entityStates.get(entity.uuid);
            let isIn = map.get(placename);
            if (!isIn) {
              map.set(placename, true);
              this.entityStates.set(entity.uuid, map);
              this.emit('enter', entity, placename, place);
            }
          } else {
            let map = new Map();
            map.set(placename, true);
            this.entityStates.set(entity.uuid, map);
            this.emit('enter', entity, placename, place);
          }
        } else {
          if (this.entityStates.has(entity.uuid)) {
            let map = this.entityStates.get(entity.uuid);
            let isIn = map.get(placename);
            if (isIn) {
              map.set(placename, false);
              this.entityStates.set(entity.uuid, map);
              this.emit('leave', entity, placename, place);
            }
          }
        }
      }
    }
    setTimeout(() => {
      this.mainloop();
    }, this.delay);
  }

  isEntityInPlace(entity, place) {
    let p = entity.position;
    if (!(Math.max(place.v1.x, place.v2.x)+1 > p.x && Math.min(place.v1.x, place.v2.x) <= p.x)) return false;
    if (!(Math.max(place.v1.y, place.v2.y)+1 > p.y && Math.min(place.v1.y, place.v2.y) <= p.y)) return false;
    if (!(Math.max(place.v1.z, place.v2.z)+1 > p.z && Math.min(place.v1.z, place.v2.z) <= p.z)) return false;
    return true;
  }
}
