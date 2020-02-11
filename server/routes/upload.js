const express = require('express');
const expressFileupload = require('express-fileupload');
const app = express();
const User = require('../models/user');


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



        userImg(id, res, newFileName);
    })

});

const userImg = (id, res, newFileName) => {
    User.findById(id, (err, userDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })

        if (!userDB) return res.status(500).json({
            ok: false,
            err: { message: 'User not found' }
        })

        

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

const productImg = () => {

}

module.exports = app;