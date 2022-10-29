import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";

import { API_URL } from "@/config/index";

export default withSessionRoute(async (req, res) => {
  if (req.method === "DELETE") {
    try {
      // Get the authenticated user's token from the session
      const user = req.session.user;

      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };

      // Destructure the body params from `request.body`
      const { profileID } = req.body;

      // Define Strapi backend API url
      const deleteProfileURL = `${API_URL}/api/profiles/${profileID}`;

      // Make our "DELETE" request
      const deleteProfileResponse = await axios.delete(
        deleteProfileURL,
        config
      );

      // Strapi JSON response
      const profile = await deleteProfileResponse.data;

      // If successful, send the deleted profile to the frontend
      if (deleteProfileResponse.status === 200) {
        res.status(200).json({ profile });
      }
    } catch (error) {
      // Send error repsonses to the frontend for user feedback
      res.status(error.response.data.error.status).json({
        message: error.response.data.error.message,
      });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["DELETE"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
