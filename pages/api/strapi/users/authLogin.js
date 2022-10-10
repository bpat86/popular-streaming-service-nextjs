import axios from "axios";
import { API_URL } from "@/config/index";
import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "POST") {
    try {
      // Destructure the form input data from the request body
      const { identifier, password } = req.body;

      // Define the post request body parameters
      const bodyParams = { identifier, password };

      // Define the Strapi login api route
      const loginURL = `${API_URL}/api/auth/local`;

      // Send the request to our backend
      const strapiResponse = await axios.post(loginURL, bodyParams);

      // If the response is good, we get back a jwt (json web token) along with the user object
      const userResponse = await strapiResponse.data;

      // Set an http cookie with the value of the jwt
      if (strapiResponse.status === 200) {
        // Iron session params
        const user = {
          isLoggedIn: true,
          strapiToken: userResponse.jwt,
          ...userResponse.user,
        };

        // Create a session
        req.session.user = user;
        await req.session.save();

        // Send the user to the frontend
        res.status(200).json({ user: userResponse.user });
      }
    } catch (error) {
      console.log("error.response: ", error.response);
      // Send error response to the frontend for user feedback
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
