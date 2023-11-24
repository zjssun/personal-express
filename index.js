const express = require("express");
const enter = require("./router/enter");
const app = express();

app.use(express.json());
const port = 3000;

enter(app);

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
})

app.get("/", (req, res) => {
   res.send("personal-express")
})