const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const Schema = mongoose.Schema;

const OrderSchema = Schema(
    {
        id_customer: { type: String, required: true },
        account: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        total_pay: { type: Number, required: true },
        detail: { type: Array }, // object: quantity, name_product, unit_price, into_money
        payments: {
            cod: { type: Boolean, default: true },
            shop: { type: Boolean, default: false },
        },
        status: {
            confirmed: { type: Boolean, default: false },
            wait_confirm: { type: Boolean, default: true }
        },
    },
    {
        timestamps: true,
    }
)
mongoose.plugin(slug);

module.exports = mongoose.model("Order", OrderSchema);



