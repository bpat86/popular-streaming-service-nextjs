import axios from "axios";

import { API_URL } from "@/config/index";
import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

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
      // Make the request to Strapi
      const url = `${API_URL}/api/media-lists`;
      const response = await axios.get(url, config);
      // Destructure the data from the response
      const { data } = await response.data;
      const mediaList: any[] = [];
      // Loop through the media list items and find the ones that match the active profile
      data.map(({ id, attributes }: { id: number; attributes: any }) => {
        if (attributes.profileID === activeProfileID) {
          mediaList.push({
            ...attributes.mediaItem,
            media_type: attributes.mediaItem.media_type,
            in_media_list: true,
            media_list_id: id,
          });
        }
        return;
      });
      // If media list items are found, return them
      if (response.status === 200) {
        if (mediaList && mediaList.length > 0) {
          res.status(200).json({ data: mediaList });
        }
        // If no media list items are found, return an empty array
        res.status(200).json({ data: [] });
      }
      res.status(400).json({ message: "Something went wrong" });
    } catch (error: any) {
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
