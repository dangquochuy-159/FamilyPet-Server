const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluateSchema = Schema(
    {
        name_user: { type: String, required: true },
        id_customer: { type: String, required: true },
        id_product: { type: String, required: true },
        name_product: { type: String, required: true },
        content: { type: String },
        star: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Evaluate", EvaluateSchema);



