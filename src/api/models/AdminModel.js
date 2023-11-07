const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const AdminSchema = Schema(
    {
        full_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        gender: { type: String, required: true },
        date_birth: { type: String, required: true },
        avatar: { type: String },
        avatar_old: { type: Array },
        phone: { type: String, required: true },
        add_admin: { type: Boolean, default: false },
        delete_admin: { type: Boolean, default: false },
        slug: { type: String, slug: "full_name", unique: true },
    },
    {
        timestamps: true,
    }
)
mongoose.plugin(slug);

module.exports = mongoose.model("Admin", AdminSchema);



