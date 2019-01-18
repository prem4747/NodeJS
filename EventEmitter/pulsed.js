const Pulser = require('./pulser.js');

const pulser = new Pulser();

pulser.on('pulse', () => {
  console.log(`"2" + ${new Date().toISOString()} pulse received`);
});

pulser.start();
