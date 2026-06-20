const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../lib/prisma');

const PACKAGES = {
  starter: { credits: 10, amount: 499, name: 'Starter Pack - 10 Credits' },
  popular: { credits: 50, amount: 1499, name: 'Popular Pack - 50 Credits' },
  pro: { credits: 150, amount: 3499, name: 'Pro Pack - 150 Credits' }
};

const createCheckoutSession = async (req, res) => {
  const { packageId } = req.body;

  if (!PACKAGES[packageId]) {
    return res.status(400).json({ error: 'Invalid package' });
  }

  const pkg = PACKAGES[packageId];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: pkg.name },
        unit_amount: pkg.amount,
      },
      quantity: 1,
    }],
    metadata: {
      userId: req.user.id,
      credits: pkg.credits.toString(),
      packageId
    },
    success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/pricing?payment=cancelled`,
  });

  res.json({ url: session.url });
};

const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, credits } = session.metadata;

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: parseInt(credits) } }
    });

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount: parseInt(credits),
        type: 'purchase',
        description: `Purchased ${credits} credits`,
        stripePaymentId: session.id
      }
    });
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };