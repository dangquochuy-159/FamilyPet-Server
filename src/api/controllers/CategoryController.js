const cloudinary = require('cloudinary').v2;
const Category = require('../models/CategoryModel');

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

// POST /api/categorys
const addCategory = (req, res, next) => {
    let arrPhoto = []
    if (req.file) {
        arrPhoto.push(req.file.path)
        arrPhoto.push(req.file.filename)
    }

    const category = new Category({
        name: req.body.name,
        photo: arrPhoto,
    })
        .save()
        .then(() => {
            res.status(200).json({
                message: 'success',
            });
        })
        .catch(next)
}

// DELETE /api/categorys/:id
const removeCategory = (req, res, next) => {
    Category.findOneAndDelete({ _id: req.params.id })
        .then((category) => {
            let public_id = category.photo[1]
            cloudinary.uploader.destroy(public_id).then();
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

// PUT /api/categorys/:id
const updateOneCategory = (req, res, next) => {

    const updateData = {}
    let arrPhoto = []
    if (req.file) {
        arrPhoto.push(req.file.path)
        arrPhoto.push(req.file.filename)
        updateData.photo = arrPhoto
    }
    req.body.name !== "" ? updateData.name = req.body.name : updateData

    Category.findByIdAndUpdate({ _id: req.params.id }, updateData)
        .then((category) => {
            if (updateData.photo) {
                let public_id = category.photo[1]
                cloudinary.uploader.destroy(public_id).then();
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
    addCategory,
    removeCategory,
    updateOneCategory
}