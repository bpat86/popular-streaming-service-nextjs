import axios from "axios";

import { API_URL } from "@/config/index";
import { withSessionRoute } from "@/middleware/withSession";

export default withSessionRoute(async (req, res) => {
  if (req.method === "DELETE") {
    try {
      // Get the authenticated user's token from the session
      const user = req.session.user;

      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };
      // Get the Strapi ID from the request body
      const { strapiID } = req.body;
      // Make the request to Strapi
      const url = `${API_URL}/api/media-lists/${strapiID}`;
      const response = await axios.delete(url, config);
      // Destructure the data from the response
      const { data } = await response.data;
      // If successful, send the data to the frontend
      if (response.status === 200) {
        res.status(200).json(data);
      } else {
        res.status(400).json({ message: "Something went wrong" });
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
