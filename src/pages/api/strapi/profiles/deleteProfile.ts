import axios from "axios";

import { API_URL } from "@/config/index";
import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "DELETE") {
    try {
      // Get the authenticated user's token from the session
      const { user } = req.session;
      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };
      // Destructure the profile ID from `request.body`
      const { id } = req.body;
      // Define Strapi backend API url
      const url = `${API_URL}/api/profiles/${id}`;
      // Make our "DELETE" request
      const response = await axios.delete(url, config);
      // Strapi JSON response
      const { data } = response.data;
      // If successful, send the deleted profile to the frontend
      if (response.status === 200) {
        res.status(200).json({ profile: data });
      }
    } catch (error: any) {
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
