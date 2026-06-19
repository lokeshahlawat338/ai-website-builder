const { generateWebsite } = require('../lib/gemini');
const prisma = require('../lib/prisma');

const generate = async (req, res) => {
  const { prompt } = req.body;

  // Validate prompt
  if (!prompt || prompt.trim().length < 10) {
    return res.status(400).json({ 
      error: 'Prompt must be at least 10 characters' 
    });
  }

  // Check credits
  if (req.user.credits <= 0) {
    return res.status(403).json({ 
      error: 'Insufficient credits. Please purchase more credits to continue.',
      credits: 0
    });
  }

  // Call Gemini API
  const generatedCode = await generateWebsite(prompt.trim());

  // Save project to database
  const project = await prisma.project.create({
    data: {
      userId: req.user.id,
      title: prompt.trim().slice(0, 60),
      prompt: prompt.trim(),
      generatedCode,
      promptHistory: [prompt.trim()]
    }
  });

  // Deduct 1 credit
  await prisma.user.update({
    where: { id: req.user.id },
    data: { credits: { decrement: 1 } }
  });

  // Log credit transaction
  await prisma.creditTransaction.create({
    data: {
      userId: req.user.id,
      amount: -1,
      type: 'usage',
      description: `Generated: ${prompt.trim().slice(0, 50)}`
    }
  });

  // Return project + remaining credits
  res.status(201).json({
    project: {
      id: project.id,
      title: project.title,
      generatedCode: project.generatedCode,
      createdAt: project.createdAt
    },
    remainingCredits: req.user.credits - 1
  });
};

module.exports = { generate };