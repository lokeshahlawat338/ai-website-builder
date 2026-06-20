const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { createCheckoutSession, handleWebhook } = require('../controllers/payment.controller');

// POST /api/v1/payment/checkout
router.post('/checkout', requireAuth, createCheckoutSession);

// POST /api/v1/payment/webhook (no auth — Stripe calls this)
router.post('/webhook', handleWebhook);

module.exports = router;