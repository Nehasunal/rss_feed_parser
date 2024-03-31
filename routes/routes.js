// importing packages
const express = require('express');
const router = express.Router();
const rssController = require('../controller/controller');

router.get(`/rss`, rssController.getRssFeed);

module.exports = router;