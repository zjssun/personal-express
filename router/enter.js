const bill = require('./bilibili');

module.exports = (app)=> {
   app.use("/bill",bill);
}