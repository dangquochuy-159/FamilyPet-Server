const express = require("express");
const productRouter = express.Router()

// Middleware
const {
    storageUploadMultiplePhoto,
    uploadImageProduct,
} = require('../middleware/upload')

const {
    getListProduct,
    searchProduct,
    filterProduct,
    getOneProduct,
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

    .post('/', uploadImageProduct.fields([{ name: 'photo' }, { name: 'photo_detail' }]), addProduct)

    .delete('/:id', removeProduct)

    .put('/quantity', updateQuantityProduct)
    .put('/:id', uploadImageProduct.fields([{ name: 'photo' }, { name: 'photo_detail' }]), updateProduct)

module.exports = productRouter;