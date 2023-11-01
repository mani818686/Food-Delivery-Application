const express = require('express')
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const multer = require('multer');
const port = 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var db=require('./Database/dbconnection');
db.connect()

const storage = multer.diskStorage({
    destination: './frontend/public/uploads', 
    filename: (req, file, cb) => {
      cb(null,  file.originalname);
    },
  });

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).send('Image uploaded successfully');
});

const apiroutes = require("./Database/api/allapiroutes");



app.use("/api", apiroutes);

app.listen(port, () =>console.log("Site Running on http://localhost:" + port));



