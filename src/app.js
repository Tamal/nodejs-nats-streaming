const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const pubsub = require('./controllers/pubsub');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/pub', pubsub);
 
app.listen(3000);