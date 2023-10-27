const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const user = require("./route/user");

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", user);

module.exports = app;
