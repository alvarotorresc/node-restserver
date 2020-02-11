const express = require('express');
const expressFileupload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');



app.use(expressFileupload())

app.put('/upload/:type/:id', (req, res) => {

    const type = req.params.type;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: { message: 'No file selected' }
        })
    }

    const validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: `Invalid type. Types available: ${validTypes.join(', ')}` }
        })
    }

    const sampleFile = req.files.sampleFile;
    const fileName = sampleFile.name.split('.');
    const fileExtension = fileName[fileName.length - 1].toLowerCase();


    const extensions = ['jpg', 'gif', 'gif', 'png', 'jpeg'];

    if (extensions.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: `Invalid file extension. Extensions available: ${extensions.join(', ')}` },
            extension: fileExtension
        })
    }

    const newFileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

    sampleFile.mv(`uploads/${type}/${newFileName}`, (err) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });


        if (type === "users") {
            userImg(id, res, newFileName);
        }else {
            productImg(id, res, newFileName);
        }
        
    })

});

const userImg = (id, res, newFileName) => {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(newFileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!userDB) {
            deleteFile(newFileName, 'users');
            return res.status(500).json({
                ok: false,
                err: { message: 'User not found' }
            })
        }



        deleteFile(userDB.img, 'users');

        userDB.img = newFileName;

        userDB.save((err, savedUser) => {
            res.json({
                ok: true,
                userDB: savedUser,
                img: newFileName
            })
        })
    })
}

const productImg = (id, res, newFileName) => {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(newFileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!productDB) {
            deleteFile(newFileName, 'products');
            return res.status(500).json({
                ok: false,
                err: { message: 'Product not found' }
            })
        }



        deleteFile(productDB.img, 'products');

        productDB.img = newFileName;

        productDB.save((err, savedProduct) => {
            res.json({
                ok: true,
                product: savedProduct,
                img: newFileName
            })
        })
    })
}

const deleteFile = (imgName, type) => {
    const pathUrl = path.resolve(__dirname, `../../uploads/${type}/${imgName}`);

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;