const express = require('express');
const router = express.Router();

const controller = require('../controllers/databases');

router.get('/', controller.getDatabases);

module.exports = router;
