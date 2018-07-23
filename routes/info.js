var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/cities', function(req, res, next) {
  res.render('cities');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
