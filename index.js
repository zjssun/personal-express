const express = require("express");
const enter = require("./router/enter");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const port = 3000;
//process.env.PORT
enter(app);


app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
})

app.get("/", (req, res) => {
   res.send("Welcome to SamRol-express")
})