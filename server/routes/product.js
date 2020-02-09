const express = require('express');
const { verifyToken } = require('../middelwares/autentification');
const app = express();
const Product = require('../models/product');


app.post('/products', verifyToken, (req, res) => {
    let { name, priceUni, description, available, category } = req.body;

    let product = new Product({
        user: req.user._id,
        name,
        priceUni,
        description,
        available,
        category
    })

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: productDB
        })
    })
})

app.put('/products/:id', verifyToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    let id = req.params.id;
    let { name, priceUni, description, available, category } = req.body;
    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id not found'
                }
            });
        }

        productDB.name = name;
        productDB.priceUni = priceUni;
        productDB.description = description;
        productDB.available = available;
        productDB.category = category;

        productDB.save((err, savedProduct) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: savedProduct
            });

        });

    });


});



app.delete('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID not found'
                }
            });
        }

        productoDB.available = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productoBorrado,
                message: 'Product deleted'
            });

        })

    })


});



module.exports = app;