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
      const { profileID, mediaID, mediaType } = req.body;

      // Body parameters to be sent to the backend
      const bodyParams = {
        data: {
          user: user.id,
          mediaList: [
            {
              mediaID,
              mediaType,
            },
          ],
        },
      };

      // Define Strapi backend API url
      const addMediaToListURL = `${API_URL}/api/profiles/${profileID}`;

      // Make our "PUT" request
      const addMediaToListResponse = await axios.put(
        addMediaToListURL,
        bodyParams,
        config
      );

      // Strapi JSON response
      const profile = await addMediaToListResponse.data;

      // If successful, send the edited profile to the frontend
      if (addMediaToListResponse.status === 200) {
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
    res.setHeader("Allow", ["PUT"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
