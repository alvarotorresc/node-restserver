const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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
        }, process.env.SEED, { expiresIn: process.env.CADUCITY_TOKEN })

        if (!bcrypt.compareSync(password, userDB.password)) {
            return res.status(500).json({
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

//google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        mail: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    User.findOne({ mail: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Use your normal credentials'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCITY_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            const user = new User();

            user.name = googleUser.name;
            user.mail = googleUser.mail;
            user.img = googleUser.picture;
            user.google = true;
            user.password = ':)';

            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCITY_TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            })
        }
    })
})

module.exports = app;