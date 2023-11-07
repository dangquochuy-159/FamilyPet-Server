const Evaluate = require('../models/EvaluateModel')
const Product = require('../models/ProductModel')

// GET /api/evaluates
const getListEvaluate = (req, res, next) => {
    Evaluate.find()
        .then((evaluates) => {
            res.json({
                data: evaluates,
                message: 'success',
            })
        })
        .catch(next)
}

//GET /api/evaluates/filter?filter=&value=
const getFilterEvaluate = (req, res, next) => {
    let filters = [];
    let values = [];

    filters = filters.concat(req.query.filter);
    values = values.concat(req.query.value);

    const query = {};
    for (let i = 0; i < filters.length; i++) {
        query[filters[i]] = values[i]
    }


    Evaluate.find(query)

        .then((evaluateFilter) => {
            res.json({
                data: evaluateFilter,
                page: Number(req.query.page),
                message: 'success',
            })
        })
}

// POST /api/evaluates
const addEvaluate = (req, res, next) => {
    const evaluate = new Evaluate({
        name_user: req.body.name_user,
        name_product: req.body.name_product,
        id_customer: req.body.id_customer,
        id_product: req.body.id_product,
        content: req.body.content,
        star: Number(req.body.star),
    })
        .save()
        .then(() => {
            Product.updateOne({ _id: req.body.id_product }, {
                $inc: {
                    star: Number(req.body.star),
                    total_eval: 1
                }
            })
                .then(() => {
                    res.status(200).json({
                        message: 'success'
                    });
                })
        })

}

// DELETE /api/evaluates/:id
const removeEvaluate = (req, res, next) => {
    Evaluate.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: 'success'
            });
        })
}

//PUT /api/evaluates/:id
const updateEvaluate = (req, res, next) => {
    Evaluate.findByIdAndUpdate(req.params.id, {
        $set: {
            content: req.body.content,
            star: Number(req.body.star)
        }
    })
        .then((evaluate) => {
            let starChange = Number(req.body.star) - evaluate.star
            return Product.updateOne({ _id: evaluate.id_product }, { $inc: { star: starChange } })
                .then(() => {
                    res.status(200).json({
                        message: 'success'
                    });
                })

        })
}
module.exports = {
    getListEvaluate,
    getFilterEvaluate,
    addEvaluate,
    removeEvaluate,
    updateEvaluate,
}