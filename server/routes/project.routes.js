const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  regenerateProject,
  refineProject
} = require('../controllers/project.controller');

router.get('/', requireAuth, getAllProjects);
router.get('/:id', requireAuth, getProjectById);
router.patch('/:id', requireAuth, updateProject);
router.delete('/:id', requireAuth, deleteProject);
router.post('/:id/regenerate', requireAuth, regenerateProject);
router.post('/:id/refine', requireAuth, refineProject);

module.exports = router;