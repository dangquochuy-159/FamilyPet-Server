const fs = require('fs')
const appRoot = require('app-root-path');

const Category = require('../models/CategoryModel');
const pathCategory = '/src/api/public/uploads/categorys/'

// GET /api/categorys
const getListCategorys = (req, res, next) => {
    Category.find()
        .then(categorys => {
            res.json({
                data: categorys,
                message: 'success',
            })
        })
        .catch(next);
}

// GET /api/categorys/search?name=
const getSearchCategory = (req, res, next) => {
    Category.find({ name: req.query.name })
        .then(category => {
            res.json({
                data: category
            })
        })
}

// GET /api/categorys/:id
const getOneCategory = (req, res, next) => {
    Category.findById(req.params.id)
        .then(category => {
            res.json({
                data: category,
                message: 'success',
            })
        })
        .catch(next);
}

// GET /api/categorys/:id/:photo
const getPhotoCategory = (req, res, next) => {
    Category.findById(req.params.id)
        .then(() => {
            let photoPath = appRoot + pathCategory + req.params.photo;
            res.sendFile(photoPath);
        })
        .catch(next);
}

// POST /api/categorys
const addCategory = (req, res, next) => {
    const category = new Category({
        name: req.body.name,
        photo: req.file ? req.file.filename : null,
    })
        .save()
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

// DELETE /api/categorys/:id
const removeCategory = (req, res, next) => {
    Category.findOneAndDelete({ _id: req.params.id })
        .then((category) => {
            let photoPath = appRoot + pathCategory + category.photo

            fs.unlink(photoPath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

// PUT /api/categorys/:id
const updateOneCategory = (req, res, next) => {

    const updateData = {}

    req.body.name !== "" ? updateData.name = req.body.name : updateData
    req.file ? updateData.photo = req.file.filename : updateData

    Category.findByIdAndUpdate({ _id: req.params.id }, updateData)
        .then((category) => {
            if (updateData.photo) {
                let photoPath = appRoot + pathCategory + category.photo

                fs.unlink(photoPath, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            }

            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

module.exports = {
    getListCategorys,
    getSearchCategory,
    getOneCategory,
    getPhotoCategory,
    addCategory,
    removeCategory,
    updateOneCategory
}