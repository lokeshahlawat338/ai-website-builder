const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// GET /api/v1/user/profile
router.get('/profile', requireAuth, async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    credits: req.user.credits,
    plan: req.user.plan,
    createdAt: req.user.createdAt
  });
});

// GET /api/v1/user/credits
router.get('/credits', requireAuth, async (req, res) => {
  res.json({
    credits: req.user.credits,
    plan: req.user.plan
  });
});

// PATCH /api/v1/user/profile
router.patch('/profile', requireAuth, async (req, res) => {
  const { name } = req.body;
  
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { name }
  });

  res.json({
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    credits: updatedUser.credits,
    plan: updatedUser.plan
  });
});

module.exports = router;