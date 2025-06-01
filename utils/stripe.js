import axios from 'axios';

export const createSubscription = async (email, paymentMethodId) => {
  try {
    const response = await axios.post('http://localhost:3000/create-subscription', {
      email,
      paymentMethodId,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error.response?.data || error.message);
    throw error;
  }
};