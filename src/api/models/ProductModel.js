const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    des: { type: String, required: true },
    photo: { type: Array, required: true },
    origin: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    sale_price: { type: Number },
    photo_detail: { type: Array, required: true },
    outstand: { type: Boolean },
    status: {
        in_stock: { type: Boolean, default: false },
        out_stock: { type: Boolean, default: false },
        low_stock: { type: Boolean, default: false },
    },
    star: { type: Number, default: 0 },
    total_eval: { type: Number, default: 0 },
    slug: { type: String, slug: "name", unique: true },
},
    {
        timestamps: true,
    }
)

mongoose.plugin(slug);

module.exports = mongoose.model("Product", ProductSchema);