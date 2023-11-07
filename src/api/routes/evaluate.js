const express = require("express");
const evaluateRouter = express.Router();

const {
    getListEvaluate,
    getFilterEvaluate,
    addEvaluate,
    removeEvaluate,
    updateEvaluate,
} = require('../controllers/EvaluateController')

evaluateRouter
    .get('/', getListEvaluate)
    .get('/filter', getFilterEvaluate)

    .post('/', addEvaluate)

    .delete('/:id', removeEvaluate)

    .put('/:id', updateEvaluate)


module.exports = evaluateRouter