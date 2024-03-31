// importing packages
const express = require('express');
const router = express.Router();
const rssController = require('../controller/controller');

router.post(`/rss`, rssController.getRssFeed);

module.exports = router;