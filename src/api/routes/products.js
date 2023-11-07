const express = require("express");
const productRouter = express.Router()

// Middleware
const {
    storageUploadMultiplePhoto,
} = require('../middleware/upload')

const {
    getListProduct,
    searchProduct,
    filterProduct,
    getOneProduct,
    getPhotoProduct,
    addProduct,
    removeProduct,
    updateProduct,
    updateQuantityProduct,
} = require('../controllers/ProductController')

productRouter
    .get('/', getListProduct)
    .get('/search', searchProduct)
    .get('/filter', filterProduct)
    .get('/:id', getOneProduct)
    .get('/:id/:photo', getPhotoProduct)

    .post('/', storageUploadMultiplePhoto('product', 'photo', 'photo_detail'), addProduct)

    .delete('/:id', removeProduct)

    .put('/quantity', updateQuantityProduct)
    .put('/:id', storageUploadMultiplePhoto('product', 'photo', 'photo_detail'), updateProduct)

module.exports = productRouter;