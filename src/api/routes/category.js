const express = require("express");
const categoryRouter = express.Router()

// Middleware
const { uploadImageCategory } = require('../middleware/upload')

// Controller
const {
    getListCategorys,
    getSearchCategory,
    getOneCategory,
    addCategory,
    removeCategory,
    updateOneCategory
} = require('../controllers/CategoryController')

categoryRouter
    .get('/', getListCategorys)
    .get('/search', getSearchCategory)
    .get('/:id', getOneCategory)

    .post('/', uploadImageCategory.single('photo'), addCategory)

    .delete('/:id', removeCategory)

    .put('/:id', uploadImageCategory.single('photo'), updateOneCategory)

module.exports = categoryRouter