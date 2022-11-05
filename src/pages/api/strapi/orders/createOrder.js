import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";

import { API_URL } from "@/config/index";

export default withSessionRoute(async (req, res) => {
  if (req.method === "POST") {
    try {
      // Get the authenticated user's token from the session
      const user = req.session.user;

      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };

      // Destructure the body params from `request.body`
      const {
        // email,
        subscriptionId,
        customerId,
        monthlyPrice,
        currency,
        startDate,
        currentPeriodStart,
        currentPeriodEnd,
      } = req.body;

      // Body parameters to be sent to the backend
      const bodyParams = {
        data: {
          user: user.id,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          monthlyPrice,
          currency,
          startDate,
          currentPeriodStart,
          currentPeriodEnd,
          status: "Incomplete",
        },
      };

      // Define Strapi backend API url
      const createOrderURL = `${API_URL}/api/orders`;

      // Make our "POST" request
      const createOrderResponse = await axios.post(
        createOrderURL,
        bodyParams,
        config
      );

      // Strapi JSON response
      const order = await createOrderResponse.data;

      // If successful, send the created order to the frontend
      if (createOrderResponse.status === 200) {
        res.status(200).json({ order });
      }
    } catch (error) {
      // Send error repsonses to the frontend for user feedback
      res.status(error.response.data.error.status).json({
        message: error.response.data.error.message,
      });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["POST"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
