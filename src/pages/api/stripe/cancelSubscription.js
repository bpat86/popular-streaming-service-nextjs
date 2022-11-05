import Stripe from "stripe";

import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "POST") {
    // Destructure the body params from `request.body`
    // const { priceId, customerId } = req.body;

    // Initialize Stripe
    // const stripe = new Stripe(`${process.env.STRIPE_SK}`);
    const stripe = new Stripe(process.env.STRIPE_SK, {
      apiVersion: "2020-08-27",
    });

    try {
      // Create an inactive subscription in Stripe
      // Delete the subscription
      const deletedSubscription = await stripe.subscriptions.del(
        req.body.subscriptionId
      );
      res.send(deletedSubscription);

      // If successful, send the `customerData` JSON response back to the frontend
      res.status(200).json(deletedSubscription);
    } catch (error) {
      res.status(error.status).json({ error: { message: error.message } });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["POST"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
