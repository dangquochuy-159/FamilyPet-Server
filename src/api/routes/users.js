const express = require("express");
const userRouter = express.Router()

// Middleware
const { uploadImageUer } = require('../middleware/upload')

// Controller
const {
    getListUsers,
    getOneUser,
    getSearchAccountUser,

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


    .post('/', uploadImageUer.single('avatar'), addUser)
    .post('/login', checkLogin)

    .delete('/:id', removeUser)
    .delete('/:id/avatar', removeAvatarUser)
    .delete('/:id/cart', removeSomeProductCart)

    .put('/:id/change', updatePoint)
    .put('/:id', uploadImageUer.single('avatar'), updateOneUser)
    .put('/:id/cart/:id_product', updateCart)
    .put('/:id/:idAvatar', updateAvatarUser)

module.exports = userRouter