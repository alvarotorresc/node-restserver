const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = express();



app.get('/user', function (req, res) {
    res.json('get user')
});

app.post('/user', async (req, res) => {
    let { name, mail, password, role } = req.body;

    const user = new User({
        name,
        mail,
        password: bcrypt.hashSync(password, 10),
        role
    });

    try {
        res.json({
            ok: true,
            saveUser: await user.save()
        })
    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
});

app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
});
app.delete('/user', function (req, res) {
    res.json('delete user')
});

module.exports = app;