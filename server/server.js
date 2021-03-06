
require('./config/config');



const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname + '/../public')))

//global routes conf
app.use(require('./routes/index'));

mongoose.connect('mongodb://localhost:27017/coffee', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log("Database Online")
});



app.listen(process.env.PORT, () => {
    console.log('Listening on port:' + process.env.PORT)
})