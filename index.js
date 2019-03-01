const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("./models");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", require("./routes"));

const port = 5000;
app.listen(port, () => {
  console.log("Server eavesdropping on 5000");
});