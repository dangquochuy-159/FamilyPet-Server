const express = require("express");
const adminRouter = express.Router()

// Middleware
const { uploadImageAdmin } = require('../middleware/upload')

// Controller
const {
    getListAdmins,
    getOneAdmin,
    getSearchEmailAdmin,
    addAdmin,
    checkLogin,
    removeAdmin,
    removeAvatarAdmin,
    updateOneAdmin,
    updateAvatarAdmin
} = require('../controllers/AdminController')

adminRouter
    .get('/', getListAdmins)
    .get('/search', getSearchEmailAdmin)
    .get('/:id', getOneAdmin)

    .post('/', uploadImageAdmin.single('avatar'), addAdmin)
    .post('/login', checkLogin)

    .delete('/:id', removeAdmin)
    .delete('/:id/avatar', removeAvatarAdmin)

    .put('/:id', uploadImageAdmin.single('avatar'), updateOneAdmin)
    .put('/:id/:idAvatar', updateAvatarAdmin)

module.exports = adminRouter