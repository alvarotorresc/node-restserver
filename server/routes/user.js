const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/user');
const app = express();



app.get('/user', async (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 0;
    limit = Number(limit);


    User.find({}, 'name mail role state google img')
        .skip(from)
        .limit(limit)
        .exec(async (err, users) => {
            try {
                User.count({}, (err, count) => {
                    res.json({
                        ok: true,
                        users,
                        count
                    });
                })
            } catch (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        })
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

app.put('/user/:id', async (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'mail', 'password', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, async (err, userDB) => {
        try {
            res.json({
                ok: true,
                editUser: await userDB
            })
        } catch (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    });
});
app.delete('/user/:id', async (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id, async (err, deletedUser) => {
        if (deletedUser) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            })
        }

        try {

            res.json({
                ok: true,
                deleteUser: await deletedUser
            })
        } catch (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    });

});

module.exports = app;