require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const route = require("./api/routes");
const db = require("./config/db");
const app = express();
const port = process.env.PORT || 3000;

db.connect();


app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header({ "Access-Control-Allow-Origin": "*" });
    next();
})


route(app);
app.listen(port);
console.log(`Server started on port ${port}`);
