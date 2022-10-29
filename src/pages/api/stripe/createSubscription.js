import Stripe from "stripe";

import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "POST") {
    // Destructure the body params from `request.body`
    const { priceId, customerId } = req.body;

    // Get the authenticated user's token from the session
    const user = req.session.user;

    // Initialize Stripe
    // const stripe = new Stripe(`${process.env.STRIPE_SK}`);
    const stripe = new Stripe(process.env.STRIPE_SK, {
      apiVersion: "2020-08-27",
    });

    // Reformat Stripe amount data for Strapi | 1799 -> 17.99
    const stripeAmount = (amount) => amount / 100;
    // Reformat Stripe date format for Strapi
    const secondsToISOString = (seconds) => {
      const date = new Date(seconds * 1000);
      return date.toISOString();
    };

    try {
      // Create an inactive subscription in Stripe
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          token: user?.strapiToken,
        },
      });

      // If successful, send the `customerData` JSON response back to the frontend
      res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        currency: subscription.plan.currency,
        monthlyPrice: stripeAmount(subscription.plan.amount),
        startDate: secondsToISOString(subscription.start_date),
        currentPeriodStart: secondsToISOString(
          subscription.current_period_start
        ),
        currentPeriodEnd: secondsToISOString(subscription.current_period_end),
        collection_method: "charge_automatically",
      });
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
