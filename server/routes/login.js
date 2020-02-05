const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = express();



app.post('/login', async (req, res) => {
    let { mail, password } = req.body;

    User.findOne({ mail: mail }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User it´s incorrect'
                }
            });
        }
        if (!bcrypt.compareSync(password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Passwd it´s incorrect'
                }
            });
        }

        res.json({
            ok: true,
            user: userDB,
            token: '123'
        })


    })
});






module.exports = app;