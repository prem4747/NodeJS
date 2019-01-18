var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('hello-world', {
    title: 'Express',
    sweets: [
        "Chocolate", "Strawberry", "Honey", "Kumquat"
    ]
  });
});

router.get('/foo', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

module.exports = router;
