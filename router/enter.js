const bill = require('./bilibili');
const douban = require('./douban');
const juejin = require('./juejin');

module.exports = (app)=> {
   app.use("/bill",bill);
   app.use("/douban",douban);
   app.use("/juejin",juejin);
}