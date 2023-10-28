const express = require('express')
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const port = 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var db=require('./Database/dbconnection');

db.connect()

const apiroutes = require("./Database/api/allapiroutes");

app.use("/api", apiroutes);

app.listen(port, () =>console.log("Site Running on http://localhost:" + port));



