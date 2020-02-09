const express = require('express');

let { verifyToken, verifyAdminRole } = require('../middelwares/autentification');

let app = express();

let Category = require('../models/category');


app.get('/category', verifyToken, (req, res) => {
    //all categories
    Category.find({})
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categories
            })
        })

});

app.get('/category/:id', verifyToken, (req, res) => {
    //one category by id
    const id = req.params.id;

    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
});


app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    });
});

app.put('/category/:id', (req, res) => {

    const id = req.params.id;
    const body = req.body;

    const descCategory = {
        description: body.description
    }

    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    })


});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    const id = req.params.id;
    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'id not found'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categorie deleted'
        })
    })
});




module.exports = app;