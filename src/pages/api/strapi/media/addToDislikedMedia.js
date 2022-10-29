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
      const { profileID, mediaID, mediaType, mediaItem } = req.body;
      const timestamp = Math.floor(new Date().getTime() / 1000).toString();

      // Body parameters to be sent to the backend
      const bodyParams = {
        data: {
          profile: profileID,
          user: user.id,
          profileID: profileID.toString(),
          mediaID: mediaID.toString(),
          mediaType,
          mediaItem,
          timestamp,
        },
      };

      // Define Strapi backend API url
      const addToDislikedMediaURL = `${API_URL}/api/disliked-medias`;

      // Make our "PUT" request
      const addToDislikedMediaResponse = await axios.post(
        addToDislikedMediaURL,
        bodyParams,
        config
      );

      // Strapi JSON response
      const { data } = await addToDislikedMediaResponse.data;
      // console.log("data: ", data);
      // Send to the frontend
      if (addToDislikedMediaResponse.status === 200) {
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
    res.setHeader("Allow", ["POST"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
