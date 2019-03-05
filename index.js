require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const chalk = require("chalk");
require("./models");
const app = express();
require("./config/app-variables")(app);
MONGOURI = "mongodb://sagar:sagar5544@ds259820.mlab.com:59820/new-mario-db";
mongoose.Promise = global.Promise;
mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(chalk.yellow("Connected to Mlab.."));
  })
  .catch(err => {
    // console.log("Mlab connection error -- ", err);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(app.get("indexHTMLPath"));
});
app.use("/users", require("./routes/users"));
app.use("/levels", require("./routes/levels"));

const port = 5000;
app.listen(port, () => {
  //console.log(process.env.MONGOURI);
  console.log("Server eavesdropping on 5000");
});
