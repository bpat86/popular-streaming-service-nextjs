import axios from "axios";
import { API_URL } from "@/config/index";
import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "PUT") {
    try {
      // Get the authenticated user's token from the session
      const user = req.session.user;

      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };

      // Destructure the body params from `request.body`
      const {
        firstName,
        lastName,
        email,
        plan,
        orderId,
        customerId,
        subscriptionId,
        currency,
        monthlyPrice,
        startDate,
        currentPeriodStart,
        currentPeriodEnd,
        status,
      } = req.body;

      // Body parameters to be sent to the backend
      const bodyParams = {
        data: {
          firstName,
          lastName,
          orderId,
          monthlyPrice,
          status,
        },
      };

      // Define Strapi api url
      const updateOrderURL = `${API_URL}/api/orders/${orderId}`;

      // Make our "PUT" request
      const updateOrderResponse = await axios.put(
        updateOrderURL,
        bodyParams,
        config
      );

      // Strapi JSON response
      const updatedOrder = await updateOrderResponse.data;

      // If successful, send the updated order to the frontend
      if (updateOrderResponse.status === 200) {
        res.status(200).json({ updatedOrder });
      }
    } catch (error) {
      // Send error repsonses to the frontend for user feedback
      res.status(error.response.data.error.status).json({
        message: error.response.data.error.message,
      });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["PUT"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
