const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const UserSchema = Schema(
    {
        full_name: { type: String, required: true },
        email: { type: String, default: null },
        phone_login: { type: String, default: null },
        method_login: {
            email: { type: Boolean, default: false },
            phone: { type: Boolean, default: false },
        },
        password: { type: String, required: true },
        address: { type: String, required: true },
        avatar: { type: Array },
        avatar_old: { type: Array },
        phone: { type: String, required: true },
        gender: { type: String },
        date_birth: { type: String },
        carts: { type: Array }, // id_product, quantity price --> xong
        list_orders: { type: Array }, // Object: id_order, total_pay  --> xong
        total_order: { type: Number, default: 0 },
        total_pay: { type: Number, default: 0 },
        total_point: { type: Number, default: 0 },
        rank: {
            diamond: { type: Boolean, default: false },
            gold: { type: Boolean, default: false },
            silver: { type: Boolean, default: false },
            bronze: { type: Boolean, default: false },
            member: { type: Boolean, default: true },
        },
        slug: { type: String, slug: "full_name", unique: true },
    },
    {
        timestamps: true,
    }
)
mongoose.plugin(slug);


UserSchema.post('updateOne', function (doc, next) {
    const conditions = this.getQuery();
    this.model.findOne(conditions)
        .then(user => {
            if (user) {
                totalPay = user.total_pay / 1000
                user.rank = {
                    diamond: totalPay >= 50000,
                    gold: totalPay >= 20000 && totalPay < 50000,
                    silver: totalPay >= 5000 && totalPay < 20000,
                    bronze: totalPay >= 2000 && totalPay < 5000,
                    member: totalPay >= 0 && totalPay < 2000,
                }
                return user.save();
            }
        })
        .then(() => {
            next();
        })
        .catch(error => {
            next(error);
        });
});

module.exports = mongoose.model("User", UserSchema);