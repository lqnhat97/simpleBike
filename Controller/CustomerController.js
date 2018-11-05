var express = require('express');

var router = express.Router();

router.post('/', (req, res) => {
    var data=req.body;
    res.json(data);
})

module.exports = router;