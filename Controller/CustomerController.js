var express = require('express');

var router = express.Router();

router.post('/', (req, res) => {
    res.json(req.body);
})

module.exports = router;