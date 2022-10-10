import axios from "axios";
import Stripe from "stripe";
import { API_URL } from "@/config/index";
import { parseCookies } from "@/utils/parseCookies";
import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  const { activeProfile, netflix } = parseCookies(req);
  const user = req.session.user;
  if (user) {
    if (req.method === "GET") {
      try {
        // Update the user's session with the current active profile
        req.session.user = {
          ...user,
          activeProfile: activeProfile || undefined,
        };
        await req.session.save();

        /**
         * In a real world application you might read the user id from the session and
         * then do a database request to get more information on the user if needed.
         */

        // `Bearer` token must be included in authorization headers for Strapi requests
        const config = {
          headers: { Authorization: `Bearer ${user?.strapiToken}` },
        };

        // Define the Strapi `get logged in user` api url
        const isLoggedInURL = `${API_URL}/api/users/me`; /** ?populate=%2A */

        // Initialize Stripe
        const stripe = new Stripe(process.env.STRIPE_SK, {
          apiVersion: "2020-08-27",
        });

        // Get subscriptions
        const [strapiUserResponse, subscriptions, paymentMethods, setupIntent] =
          await Promise.all([
            axios.get(isLoggedInURL, config),
            stripe.subscriptions.list({
              customer: user?.stripeCustomerId,
              status: "all",
              expand: ["data.default_payment_method"],
            }),
            // Get user payment methods
            stripe.paymentMethods.list({
              customer: user?.stripeCustomerId,
              type: "card",
            }),
            // Setup intent
            stripe.setupIntents.create({
              customer: user?.stripeCustomerId,
              payment_method_types: ["card"],
            }),
          ]);

        const clientSecret = setupIntent.client_secret;

        // If an authenticated user exists, we'll receive the user object from the response
        const strapiUser = strapiUserResponse.data;
        if (strapiUserResponse.status === 200) {
          res.json({
            clientSecret: clientSecret,
            subscriptions: subscriptions.data[0],
            paymentMethods: paymentMethods,
            isActive: subscriptions.data[0].status === "active",
            isLoggedIn: true,
            activeProfile,
            netflix,
            ...user,
            ...strapiUser,
          });
        }
      } catch (error) {
        console.log("error: ", error.response.data.error.message);
        // Send error response to the frontend for user feedback
        res.status(error.response.data.error.status).json({
          message: error.response.data.error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ message: `Method ${req.method} is not allowed` });
    }
  } else {
    res.json({
      clientSecret: null,
      subscriptions: null,
      paymentMethods: null,
      isActive: false,
      isLoggedIn: false,
      activeProfile: null,
      ...user,
    });
  }
});
