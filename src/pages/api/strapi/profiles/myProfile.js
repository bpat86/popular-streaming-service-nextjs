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

      // Destructure the body params from `request.body`
      const { name, autoPlayNextEpisode, autoPlayPreviews } = req.body;

      // Body parameters to be sent to the backend
      const bodyParams = {
        data: {
          publishedAt: new Date(),
          user: user.id,
          id,
          name,
          user,
          avatar,
          autoPlayNextEpisode,
          autoPlayPreviews,
          kid,
        },
      };

      // Define Strapi backend API url
      const createProfileURL = `${API_URL}/api/profiles/${id}`;

      // Make our "GET" request
      const createProfileResponse = await axios.get(
        createProfileURL,
        bodyParams,
        config
      );

      // Strapi JSON response
      const profile = await createProfileResponse.data;

      // If successful, send the created profile to the frontend
      if (createProfileResponse.status === 200) {
        res.status(200).json({ profile });
      }
    } catch (error) {
      // Send error repsonses to the frontend for user feedback
      res.status(error.response.status).json({
        message: error.response.data.message[0].messages[0].message,
      });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["GET"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
