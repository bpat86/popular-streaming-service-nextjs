import Stripe from "stripe";

import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "GET") {
    // Destructure the body params from `request.body`
    const { priceId, customerId } = req.body;

    // Get the authenticated user's token from the session
    const user = req.session.user;

    // Initialize Stripe
    // const stripe = new Stripe(`${process.env.STRIPE_SK}`);
    const stripe = new Stripe(process.env.STRIPE_SK, {
      apiVersion: "2020-08-27",
    });

    try {
      // Get subscription informatin
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "all",
        expand: ["data.default_payment_method"],
      });
      // Get user payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: "card",
      });

      // If successful, send the `customerData` JSON response back to the frontend

      res.status(200).json({
        subscriptions,
        paymentMethods,
      });
    } catch (error) {
      res.status(error.status).json({ error: { message: error.message } });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["GET"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
