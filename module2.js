const util = require('util');
const A = "World";
const B = "Rocks";

const m1 = require('./module-export.js');

console.log(`A=${A} B=${B} values=${util.inspect(m1.values())}`);
console.log(`${m1.A} ${m1.B}`);
const vals = m1.values();

vals.B = "Sucks";
console.log(util.inspect(vals));
console.log(util.inspect(m1.values()));
