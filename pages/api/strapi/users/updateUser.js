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
        phone,
        password,
        plan,
        stripeCustomerId,
        subscriptionId,
        registrationStep,
        registrationComplete,
      } = req.body;

      // Body parameters to be sent to the backend
      const bodyParams = {
        firstName,
        lastName,
        email,
        phone,
        // password,
        plan,
        stripeCustomerId,
        stripeSubscriptionId: subscriptionId,
        registrationStep,
        registrationComplete,
      };

      // console.log("bodyParams: ", bodyParams);

      // Strapi backend `/api/users/me` API url
      const apiURL = `${API_URL}/api/users/update/me`;

      // Make our "PUT" request
      const strapiResponse = await axios.put(apiURL, bodyParams, config);

      // Strapi JSON response
      const userResponse = await strapiResponse.data;

      // console.log("userResponse: ", userResponse);

      // If successful, send the updated user session to the frontend
      if (strapiResponse.status === 200) {
        /**
         * Update the user's session
         */
        req.session.user = { ...user, ...userResponse };
        await req.session.save();

        res.status(200).json({ user: userResponse });
      }
    } catch (error) {
      console.log("updateUser error: ", error.response.data.error.message);
      // Send error response to the frontend for user feedback
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
