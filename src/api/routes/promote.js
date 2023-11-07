const express = require("express");
const promoteRouter = express.Router()

const {
    getListPromote,
    getSearchPromote,
    getFilterPromote,
    getPromote,
    addPromote,
    removePromote,
    updatePromote,
} = require('../controllers/PromoteController')


promoteRouter
    .get('/', getListPromote)
    .get('/search', getSearchPromote)
    .get('/filter', getFilterPromote)
    .get('/:id', getPromote)

    .post('/', addPromote)

    .delete('/:id', removePromote)

    .put('/:id', updatePromote)
module.exports = promoteRouter