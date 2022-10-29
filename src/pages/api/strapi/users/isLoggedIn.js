import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

import { API_URL } from "@/config/index";

export default withSessionRoute(async (req, res) => {
  const { activeProfile } = parseCookies(req);
  const user = req.session.user;
  // Update the user's session with the current active profile
  req.session.user = {
    ...user,
    activeProfile: activeProfile || undefined,
  };
  await req.session.save();

  if (user) {
    if (req.method === "GET") {
      try {
        // `Bearer` token must be included in authorization headers for Strapi requests
        const config = {
          headers: { Authorization: `Bearer ${user?.strapiToken}` },
        };

        // Define the Strapi `get logged in user` api url
        const isLoggedInURL = `${API_URL}/api/users/me`; // ?populate=%2A

        // Send the request to our backend
        const strapiResponse = await axios.get(isLoggedInURL, config);

        // If an authenticated user exists, we'll receive the user object from the response
        const strapiUser = await strapiResponse.data;

        // If successful, send the user to the frontend
        if (strapiResponse.status === 200) {
          res
            .status(200)
            .json({ user: { ...user, ...strapiUser }, isLoggedIn: true });
        }
      } catch (error) {
        // Send error response to the frontend for user feedback
        res.status(error.status).json({
          message: error.message,
        });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ message: `Method ${req.method} is not allowed` });
    }
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
});
