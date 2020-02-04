require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/user'));

mongoose.connect('mongodb+srv://admin:admin@coffee-p2asi.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log("Database Online")
});



app.listen(process.env.PORT, () => {
    console.log('Listening on port:' + process.env.PORT)
})