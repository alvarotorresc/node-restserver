const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

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
            token
        })


    })
});






module.exports = app;