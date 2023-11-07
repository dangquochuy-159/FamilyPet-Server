const bcrypt = require('bcrypt');
const fs = require('fs')
const appRoot = require('app-root-path');
const HashPassword = require('../utils/hashPassWord')
const ComparePassword = require('../utils/comparePassword')

const Admin = require('../models/AdminModel');
const pathAdmin = '/src/api/public/uploads/admins/'

// GET /api/admins
const getListAdmins = (req, res, next) => {
    Admin.find({})
        .then((admins) => {
            res.status(200).json({
                data: admins,
                message: 'success',
            })
        })
        .catch(next)
}

// GET /api/admins/:id
const getOneAdmin = (req, res, next) => {
    Admin.findById(req.params.id)
        .then((admin) => {
            res.status(200).json({
                data: admin,
                message: 'success',
            })
        })
        .catch(next)
}

// GET /api/admins/:id/:name_avt
const getAvatarAdmin = async (req, res, next) => {
    let avatarPath = appRoot + pathAdmin + req.params.name_avt;
    res.sendFile(avatarPath);
}

// GET /api/admins/search?email=
const getSearchEmailAdmin = async (req, res, next) => {
    const exits = await Admin.findOne({ email: req.query.email })
    res.status(200).json({
        exits: !!exits
    });

}

// POST /api/admins
const addAdmin = async (req, res, next) => {

    const { full_name, email, address, province, district, ward, phone, gender, date_birth, add_admin, delete_admin } = req.body
    const password = await HashPassword(req.body.password)

    const admin = new Admin({
        full_name,
        email,
        password,
        address: address + ' - ' + ward + ' - ' + district + ' - ' + province,
        phone,
        gender,
        date_birth,
        add_admin,
        delete_admin,
        avatar: req.file ? req.file.filename : null,
    })
        .save()
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

// POST /api/admins/login
const checkLogin = (req, res, next) => {
    Admin.findOne({ email: req.body.email })
        .then(async (admin) => {
            if (admin) {
                let comparePass = await ComparePassword(req.body.password, admin.password)
                if (comparePass) {
                    res.status(200).json({
                        login: true,
                        message: 'Đăng nhập thành công',
                        admin: admin,
                        token: '112'
                    })
                } else {
                    res.status(200).json({
                        password: false,
                        message: 'Mật khẩu không chính xác',
                    })
                }
            } else {
                res.status(200).json({
                    email: false,
                    message: 'Tài khoản chưa được đăng kí'
                })
            }
        })
        .catch(next)
}

// DELETE /api/admins/:id
const removeAdmin = (req, res, next) => {
    Admin.findOneAndDelete({ _id: req.params.id })
        .then((admin) => {
            const listAvt = []
            listAvt.push(admin.avatar)
            admin.avatar_old.map(avt => {
                listAvt.push(avt)
            })

            listAvt.map(avt => {
                let avatarPath = appRoot + pathAdmin + avt
                fs.unlink(avatarPath, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            })
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

// DELETE /api/admins/:id/avatar
const removeAvatarAdmin = (req, res, next) => {
    Admin.findByIdAndUpdate({ _id: req.params.id }, {
        $set: { avatar: null }
    })
        .then((admin) => {
            return Admin.updateOne({ _id: admin._id }, { $push: { avatar_old: admin.avatar } })
        })
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

// PUT /api/admins/:id
const updateOneAdmin = async (req, res, next) => {
    const updateAdmin = {}

    for (let key in req.body) {
        if (req.body[key] !== '') {
            updateAdmin[key] = req.body[key];
        }
    }
    req.body.address ? updateAdmin.address = req.body.address + ' - ' + req.body.ward + ' - ' + req.body.district + ' - ' + req.body.province : updateAdmin
    Admin.findByIdAndUpdate(req.params.id, updateAdmin)
        .then((admin) => {
            if (updateAdmin.avatar)
                return Admin.updateOne({ _id: admin._id }, { $push: { avatar_old: admin.avatar } })
        })
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })

        .catch(next)

}

// PUT /api/admins/:id/:name_avt
const updateAvatarAdmin = (req, res, next) => {
    Admin.findById(req.params.id)
        .then((admin) => {
            const updateAvtOld = []
            for (let i in admin.avatar_old) {
                if (admin.avatar_old[i] === req.params.name_avt) {
                    admin.avatar !== null &&
                        updateAvtOld.push(admin.avatar)
                } else {
                    updateAvtOld.push(admin.avatar_old[i])
                }
            }
            return Admin.updateOne({ _id: admin._id }, {
                $set: {
                    avatar_old: updateAvtOld,
                    avatar: req.params.name_avt,
                }
            })
        })
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

module.exports = {
    getListAdmins,
    getOneAdmin,
    getAvatarAdmin,
    getSearchEmailAdmin,
    addAdmin,
    checkLogin,
    removeAdmin,
    removeAvatarAdmin,
    updateOneAdmin,
    updateAvatarAdmin
}