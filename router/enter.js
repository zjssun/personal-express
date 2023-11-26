const bill = require('./bilibili');
const douban = require('./douban');

module.exports = (app)=> {
   app.use("/bill",bill);
   app.use("/douban",douban);
}