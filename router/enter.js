const bill = require('./bilibili');
const douban = require('./douban');
const juejin = require('./juejin');
const kr = require('./36kr'); 

module.exports = (app)=> {
   app.use("/bill",bill);
   app.use("/douban",douban);
   app.use("/juejin",juejin);
   app.use("/kr",kr);
}