require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCredits() {
  const result = await prisma.user.updateMany({
    data: { credits: 50 }
  });
  console.log('Credits updated for', result.count, 'users');
  await prisma.$disconnect();
}

addCredits();