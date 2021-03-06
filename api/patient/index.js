const express = require('express')
const router = express.Router();
const controller = require('./patient.controller');

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;