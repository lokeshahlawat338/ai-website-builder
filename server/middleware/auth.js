const { createClerkClient } = require('@clerk/clerk-sdk-node');
const prisma = require('../lib/prisma');

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const requireAuth = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token with Clerk
    const payload = await clerkClient.verifyToken(token);
    const clerkId = payload.sub;

    // 3. Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      // First time this user hits our API — create them
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await prisma.user.create({
        data: {
          clerkId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          credits: 5
        }
      });

      // Log the free credits transaction
      await prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: 5,
          type: 'free',
          description: 'Signup bonus credits'
        }
      });
    }

    // 4. Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { requireAuth };