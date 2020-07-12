const Vec3 = require('vec3');
const mineflayer = require('mineflayer');
const placePlugin = require('../');

const bot = mineflayer.createBot({
  username: 'Bot'
});

placePlugin(bot);

bot.place.on('enter', (entity, placename, place) => {
  bot.chat(`enter: ${entity.uuid} type=${entity.type}`);
});

bot.place.on('leave', (entity, placename, place) => {
  bot.chat(`leave: ${entity.uuid} type=${entity.type}`);
});

bot.on('spawn', () => {
  let v1 = new Vec3(5, 65, -3);
  let v2 = new Vec3(11, 67, 1);
  bot.place.register('near', v1, v2);
  console.log('Place registered');
  console.log('Move around me');
});
