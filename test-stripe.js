const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

(async () => {
  try {
    const customer = await stripe.customers.create({
      email: 'test@stripe.com',
    });
    console.log('Customer created:', customer.id);
  } catch (err) {
    console.error('Stripe error:', err);
  }
})();