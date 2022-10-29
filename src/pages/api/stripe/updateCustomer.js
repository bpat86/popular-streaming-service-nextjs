import Stripe from "stripe";

import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "POST") {
    // Destructure the body params from `request.body`
    const { name, email, phone, shipping, invoiceSettings } = req.body;

    // Get the authenticated user's token from the session
    const user = req.session.user;
    // Initialize Stripe
    // const stripe = new Stripe(`${process.env.STRIPE_SK}`);
    const stripe = new Stripe(process.env.STRIPE_SK, {
      apiVersion: "2020-08-27",
    });

    try {
      // Update Stripe customer data
      const customer = await stripe.customers.update({
        name: name,
        email: email,
        phone: phone,
        shipping: shipping,
        invoice_settings: invoiceSettings,
        metadata: {
          token: user?.strapiToken,
        },
      });

      // If successful, send the `customer` JSON response back to the frontend
      res.status(200).json({ customer });
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
