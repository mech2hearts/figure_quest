const express= require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const scraper = require('./scraper.js')
const config = require('./config.json')

const app = express();






// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());





//DB config
const db = 'mongodb://'+config.user+':'+config.password+'@ds351107.mlab.com:51107/fighunt';

//connect to mongodb
mongoose
	.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));



app.use("/search", scraper);

const port = process.env.PORT || 5000;

var server = app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = server
