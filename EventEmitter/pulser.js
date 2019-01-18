const EventEmitter = require('events');

class Pulser extends EventEmitter {
  start() {
    setInterval(() => {
      console.log(`"1" + "Hello" >>>> pulse`);
      this.emit(`pulse`);
      console.log(`"3" + ${new Date().toISOString()} <<<< pulse`);
    }, 1000);
  }
}

module.exports = Pulser;
