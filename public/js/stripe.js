const axios = require('axios');

/* eslint-disable */

export const bookTour = async tourId => {
  const stripe = Stripe(
    'pk_test_51M5sbtEtnSsZ3xUzkwY5SusFRBT77HTq6oe2jWo4wGk4tZrAdJREejfrNdOYq726zJ7z7D3hksipOgygEbj7veV600GtLQ4CQ4'
  );

  try {
    // 1. Get checkout session from the API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
};
