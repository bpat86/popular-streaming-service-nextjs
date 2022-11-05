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
      const { strapiID } = req.body;

      // Define Strapi backend API url
      const removeFromDislikedMediaURL = `${API_URL}/api/disliked-medias/${strapiID}`;

      // Make our "DELETE" request
      const removeFromDislikedMediaResponse = await axios.delete(
        removeFromDislikedMediaURL,
        config
      );

      // Strapi JSON response
      const { data } = await removeFromDislikedMediaResponse.data;
      // Send to the frontend
      if (removeFromDislikedMediaResponse.status === 200) {
        res.status(200).json(data);
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
