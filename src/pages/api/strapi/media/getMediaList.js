import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

import { API_URL } from "@/config/index";

export default withSessionRoute(async (req, res) => {
  if (req.method === "GET") {
    try {
      // Get the current activeProfile from browser cookies
      const { activeProfile } = parseCookies(req);
      // Get the authenticated user from iron-session middleware
      const userSessionObj = req.session.user;
      // Attach the current activeProfile ID to the user data object
      const user = {
        ...userSessionObj,
        activeProfile,
      };
      // Get the active profile from the user session object
      const { activeProfile: activeProfileID } = user;
      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };
      const getMediaListURL = `${API_URL}/api/media-lists`;
      const getMediaListResponse = await axios.get(getMediaListURL, config);
      const mediaListResponse = await getMediaListResponse.data.data;
      let mediaListArray = [];
      // Only take the items that belond to the active profile
      mediaListResponse.map(({ id, attributes }) => {
        if (attributes.profileID === activeProfileID) {
          mediaListArray.push({
            ...attributes.mediaItem,
            media_type: attributes.mediaItem.media_type,
            in_media_list: true,
            media_list_id: id,
          });
        }
        return;
      });
      // Using Set(), an instance of unique values will be created removing any duplicates
      mediaListArray = new Set(mediaListArray);
      // Convert the instance into a new array
      mediaListArray = [...mediaListArray];
      // console.log("mediaListResponse.status: ", mediaListResponse);
      res.status(200).json({
        data: mediaListArray.length ? mediaListArray : null,
      });
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
