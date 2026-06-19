const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { generate } = require('../controllers/generate.controller');

// POST /api/v1/generate
router.post('/', requireAuth, generate);

module.exports = router;