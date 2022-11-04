import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";
import { requests } from "@/utils/requests";

export default withSessionRoute(async (req, res) => {
  if (req.method === "GET") {
    try {
      const { id, type } = req.query;
      const apiKey = requests.API_KEY;

      // Get single media item URL
      const apiTitleURL = new URL(`https://api.themoviedb.org/3/${type}/${id}`);
      apiTitleURL.searchParams.set("api_key", apiKey);
      apiTitleURL.searchParams.set("append_to_response", "videos,images");

      // Get single media item credits URL
      const apiCreditsURL = new URL(
        `https://api.themoviedb.org/3/${type}/${id}/credits`
      );
      apiCreditsURL.searchParams.set("api_key", apiKey);
      apiCreditsURL.searchParams.set("append_to_response", "videos,images");

      // Get the title page media
      const [getShowTitle, getShowCredits] = await Promise.all([
        axios.get(apiTitleURL.href),
        axios.get(apiCreditsURL.href),
      ]);

      // TMDB response
      const title = getShowTitle.data;
      const credits = getShowCredits.data;

      // If successful, send the media to the frontend
      if (getShowTitle.status === 200 && getShowCredits.status === 200) {
        res.status(200).json({
          data: { ...title, ...credits },
        });
      }
    } catch (error) {
      // Send error repsonses to the frontend for user feedback
      res.status(error.response.status).json({
        message: error,
      });
    }
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["GET"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
});
