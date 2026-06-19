const prisma = require('../lib/prisma');
const { generateWebsite, refineWebsite } = require('../lib/gemini');

// GET all projects for logged in user
const getAllProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      prompt: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  res.json({ projects });
};

// GET single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id }
  });

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (project.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json({ project });
};

// PATCH update project title or status
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(status && { status })
    }
  });

  res.json({ project: updated });
};

// DELETE project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });

  await prisma.project.delete({ where: { id } });

  res.json({ message: 'Project deleted successfully' });
};

// POST regenerate website
const regenerateProject = async (req, res) => {
  const { id } = req.params;
  const { newPrompt } = req.body;

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
  if (req.user.credits <= 0) return res.status(403).json({ error: 'Insufficient credits' });

  const promptToUse = newPrompt || project.prompt;
  const generatedCode = await generateWebsite(promptToUse);

  const updated = await prisma.project.update({
    where: { id },
    data: {
      generatedCode,
      prompt: promptToUse,
      promptHistory: [...project.promptHistory, promptToUse]
    }
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { credits: { decrement: 1 } }
  });

  await prisma.creditTransaction.create({
    data: {
      userId: req.user.id,
      amount: -1,
      type: 'usage',
      description: `Regenerated: ${promptToUse.slice(0, 50)}`
    }
  });

  res.json({
    project: updated,
    remainingCredits: req.user.credits - 1
  });
};

// POST refine project with instruction
const refineProject = async (req, res) => {
  const { id } = req.params;
  const { instruction } = req.body;

  if (!instruction) return res.status(400).json({ error: 'Instruction is required' });

  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
  if (req.user.credits <= 0) return res.status(403).json({ error: 'Insufficient credits' });

  const refinedCode = await refineWebsite(project.generatedCode, instruction);

  const updated = await prisma.project.update({
    where: { id },
    data: {
      generatedCode: refinedCode,
      promptHistory: [...project.promptHistory, instruction]
    }
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { credits: { decrement: 1 } }
  });

  await prisma.creditTransaction.create({
    data: {
      userId: req.user.id,
      amount: -1,
      type: 'usage',
      description: `Refined: ${instruction.slice(0, 50)}`
    }
  });

  res.json({
    project: updated,
    remainingCredits: req.user.credits - 1
  });
};

module.exports = {
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  regenerateProject,
  refineProject
};