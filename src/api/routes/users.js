const express = require("express");
const userRouter = express.Router()

// Middleware
const { storageUploadSinglePhoto } = require('../middleware/upload')

// Controller
const {
    getListUsers,
    getOneUser,
    getSearchAccountUser,
    getAvatarUser,
    addUser,
    checkLogin,
    removeUser,
    removeAvatarUser,
    removeSomeProductCart,
    updateOneUser,
    updateAvatarUser,
    updateCart,
    updatePoint,
} = require('../controllers/UserController')

userRouter
    .get('/', getListUsers)
    .get('/search', getSearchAccountUser)
    .get('/:id', getOneUser)
    .get('/:id/:name_avt', getAvatarUser)

    .post('/', storageUploadSinglePhoto('avatar', 'user'), addUser)
    .post('/login', checkLogin)

    .delete('/:id', removeUser)
    .delete('/:id/avatar', removeAvatarUser)
    .delete('/:id/cart', removeSomeProductCart)

    .put('/:id/change', updatePoint)
    .put('/:id', storageUploadSinglePhoto('avatar', 'user'), updateOneUser)
    .put('/:id/cart/:id_product', updateCart)
    .put('/:id/:name_avt', updateAvatarUser)

module.exports = userRouter