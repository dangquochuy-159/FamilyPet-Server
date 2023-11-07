const bcrypt = require('bcrypt');
const fs = require('fs')
const appRoot = require('app-root-path');
const HashPassword = require('../utils/hashPassWord')
const ComparePassword = require('../utils/comparePassword')

const User = require('../models/UserModel');
const pathUser = '/src/api/public/uploads/users/'

// GET /api/users
const getListUsers = (req, res, next) => {
    User.find({})
        .then((users) => {
            res.json({
                data: users,
                message: 'success'
            })
        })
        .catch(next)
}

// GET /api/users/:id
const getOneUser = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            res.json({
                data: user,
                message: 'success'
            })
        })
        .catch(next)
}

// GET /api/users/search?email= or ?phone_login=
const getSearchAccountUser = async (req, res, next) => {
    let q = Object.keys(req.query).join()
    switch (q) {
        case 'email':
            const exitsEmail = await User.findOne({ email: req.query.email })
            res.status(200).json({
                exits: !!exitsEmail
            });
            break
        case 'phone_login':
            const exitsPhone = await User.findOne({ phone_login: req.query.phone_login })
            res.status(200).json({
                exits: !!exitsPhone
            });


            break
        default:
            break
    }
}

// GET /api/users/:id/:name_avt
const getAvatarUser = (req, res, next) => {
    let avatarPath = appRoot + pathUser + req.params.name_avt;
    res.sendFile(avatarPath);
}

// POST /api/users/login
const checkLogin = (req, res, next) => {
    let query = {}
    let keys = Object.keys(req.body)
    let checkEmail = keys.includes('email')
    checkEmail ? query['email'] = req.body.email : query['phone_login'] = req.body.phone_login
    // res.json(query)
    User.findOne(query)
        .then(async (user) => {
            if (user) {
                let comparePass = await ComparePassword(req.body.password, user.password)
                if (comparePass) {
                    res.status(200).json({
                        login: true,
                        message: 'Đăng nhập thành công',
                        user: user,
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

// POST /api/users
const addUser = async (req, res, next) => {
    let fileName, phone_login, email
    const { full_name, address, province, district, ward, phone, gender, date_birth } = req.body
    const password = await HashPassword(req.body.password)

    method_login = req.body.email ? { email: true, phone: false } : { email: false, phone: true }
    req.body.email ? email = req.body.email : phone_login = req.body.phone_login
    fileName = req.file ? req.file.filename : fileName

    const user = new User({
        phone_login,
        method_login,
        full_name,
        email: email,
        password,
        address: address + ' - ' + ward + ' - ' + district + ' - ' + province,
        phone,
        gender,
        date_birth,
        avatar: fileName ? fileName : null,
    })
        .save()
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })
        .catch(next)
}

// DELETE /api/users/:id
const removeUser = (req, res, next) => {
    User.findOneAndDelete({ _id: req.params.id })
        .then((user) => {
            const listAvt = []
            listAvt.push(user.avatar)
            user.avatar_old.map(avt => {
                listAvt.push(avt)
            })

            listAvt.map(avt => {
                let avatarPath = appRoot + pathUser + avt
                fs.unlink(avatarPath, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            })

            res.status(200).json({
                message: 'success',
            });
        })
        .catch(next)
}

// DELETE /api/users/:id/avatar
const removeAvatarUser = (req, res, next) => {
    User.findByIdAndUpdate({ _id: req.params.id }, {
        $set: { avatar: null }
    })
        .then((user) => {
            return User.updateOne({ _id: user._id }, { $push: { avatar_old: user.avatar } })
        })
        .then(() => {
            res.status(200).json({
                message: 'success',
            });
        })
        .catch(next)
}

// DELETE /api/users/:id/cart
const removeSomeProductCart = (req, res, next) => {
    let cartsReq = req.body
    User.findById(req.params.id)
        .then(user => {
            let cartsUser = user.carts
            cartsUser = cartsUser.filter(cartUser => {
                return !cartsReq.some(cartReq => {
                    return cartUser.id_product === cartReq;
                });
            });
            return User.updateOne({ _id: user._id }, { $set: { carts: cartsUser } })
                .then(() => {
                    res.status(200).json({
                        message: 'success',
                    });
                })
        })
}

// PUT /api/users/:id
const updateOneUser = async (req, res, next) => {
    const updateUser = {}

    for (let key in req.body) {
        if (req.body[key] !== '') {
            updateUser[key] = req.body[key];
        }
    }

    req.body.address ? updateUser.address = req.body.address + ' - ' + req.body.ward + ' - ' + req.body.district + ' - ' + req.body.province : updateUser
    User.findByIdAndUpdate(req.params.id, updateUser)
        .then((user) => {
            if (updateUser.avatar)
                return User.updateOne({ _id: user._id }, { $push: { avatar_old: user.avatar } })
        })
        .then(() => {
            res.status(200).json({
                message: 'success',
            });
        })
        .catch(next)

}

// PUT /api/users/:id/:name_avt
const updateAvatarUser = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            const updateAvtOld = []
            for (let i in user.avatar_old) {
                if (user.avatar_old[i] === req.params.name_avt) {
                    user.avatar !== null &&
                        updateAvtOld.push(user.avatar)
                } else {
                    updateAvtOld.push(user.avatar_old[i])
                }
            }
            return User.updateOne({ _id: user._id }, {
                $set: {
                    avatar_old: updateAvtOld,
                    avatar: req.params.name_avt,
                }
            })
        })
        .then(() => {
            res.status(200).json({
                message: 'success',
            });
        })
        .catch(next)
}

// PUT /api/users/:id/cart/:id_product?quantity=&price=
const updateCart = (req, res, next) => {
    let key_cart
    let exist
    let updateCart = {
        id_product: req.params.id_product,
        quantity: Number(req.query.quantity),
        price: Number(req.query.price),
    }
    User.findById(req.params.id)
        .then((user) => {
            for (let key in user.carts) {
                if (req.params.id_product == user.carts[key].id_product) {
                    key_cart = key
                    exist = true
                }
            }
            if (user.carts.length > 0 && exist) {
                return User.updateOne({ _id: user._id, "carts.id_product": req.params.id_product }, {
                    $set: {
                        "carts.$.quantity": Number(req.query.quantity) + user.carts[key_cart].quantity,
                        "carts.$.price": Number(req.query.price),
                    }
                })
            } else {
                return User.updateOne({ _id: user._id }, { $push: { carts: updateCart } })
            }
        })
        .then(() => {
            res.status(200).json({
                message: 'success',
            });
        })
        .catch(next)
}

// PUT /api/users/:id/change?point=&type=
const updatePoint = (req, res, next) => {
    let value
    value = req.query.type == 'up' ? req.query.point : - (req.query.point)
    User.updateOne({ _id: req.params.id }, { $inc: { total_point: value } })
        .then(() => {
            res.status(200).json({
                message: 'success',
            });
        })
        .catch(next)
}

module.exports = {
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
    updatePoint
}