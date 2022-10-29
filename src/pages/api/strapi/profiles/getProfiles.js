import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";

import { API_URL } from "@/config/index";

export default withSessionRoute(async (req, res) => {
  if (req.method === "GET") {
    try {
      // Get the authenticated user's token from the session
      const user = req.session.user;

      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };

      // Define Strapi backend API url
      const getProfilesURL = `${API_URL}/api/profiles`;

      // Make our "GET" request
      const getProfilesResponse = await axios.get(getProfilesURL, config);

      // Strapi JSON response
      const profiles = await getProfilesResponse.data;

      // If successful, send the profile to the frontend
      if (getProfilesResponse.status === 200) {
        res.status(200).json({ profiles });
      }
    } catch (error) {
      // Send error repsonses to the frontend for user feedback
      res.status(error.response.data.error.status).json({
        message: error.response.data.error.message,
      });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["GET"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
