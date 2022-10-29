import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";
import { requests } from "@/utils/requests";

import { API_URL } from "@/config/index";

const apiKey = requests.API_KEY;

/**
 * Fetch the active profile's media list items.
 * This function will return an array of objects.
 * @param {Array} array
 * @returns
 */
async function getProfileMediaList(user) {
  // Get the active profile from the user session object
  const { activeProfile: activeProfileID } = user;
  // `Bearer` token must be included in authorization headers for Strapi requests
  const config = {
    headers: { Authorization: `Bearer ${user?.strapiToken}` },
  };
  const getMediaListURL = `${API_URL}/api/media-lists`;
  const getMediaListResponse = await axios.get(getMediaListURL, config);
  const mediaListResponse = await getMediaListResponse.data.data;
  if (getMediaListResponse.status === 200) {
    let mediaListArray = [];
    // Only take the items that belond to the active profile
    mediaListResponse.map(({ id, attributes }) => {
      if (attributes.profileID === activeProfileID) {
        mediaListArray.push({
          ...attributes.mediaItem,
          media_type: attributes.mediaItem.media_type,
          timestamp: attributes.timestamp,
          media_list_id: id,
          in_media_list: !!id,
        });
      }
      return;
    });
    // Using Set(), an instance of unique values will be created removing any duplicates
    mediaListArray = new Set(mediaListArray);
    // Convert the instance into a new array
    mediaListArray = [...mediaListArray];
    return {
      data: mediaListArray.length ? mediaListArray : null,
    };
  }
}

/**
 * Fetch the active profile's liked media items.
 * This function will return an array of objects.
 * @param {Array} array
 * @returns
 */
async function getProfileLikedItems(user) {
  // Get the active profile from the user session object
  const { activeProfile: activeProfileID } = user;
  // `Bearer` token must be included in authorization headers for Strapi requests
  const config = {
    headers: { Authorization: `Bearer ${user?.strapiToken}` },
  };
  const getLikedMediaURL = `${API_URL}/api/liked-medias`;
  const getLikedMediaResponse = await axios.get(getLikedMediaURL, config);
  const likedMediaResponse = await getLikedMediaResponse.data.data;
  if (getLikedMediaResponse.status === 200) {
    let likedMediaArray = [];
    // Only take the items that belond to the active profile
    likedMediaResponse.map(({ id, attributes }) => {
      if (attributes.profileID === activeProfileID) {
        likedMediaArray.push({
          ...attributes.mediaItem,
          media_type: attributes.mediaItem.media_type,
          timestamp: attributes.timestamp,
          liked_media_id: id,
          is_liked: !!id,
        });
      }
      return;
    });
    // Using Set(), an instance of unique values will be created removing any duplicates
    likedMediaArray = new Set(likedMediaArray);
    // Convert the instance into a new array
    likedMediaArray = [...likedMediaArray];
    return {
      data: likedMediaArray.length ? likedMediaArray : null,
    };
  }
}

/**
 * Fetch the active profile's disliked media items.
 * This function will return an array of objects.
 * @param {Array} array
 * @returns
 */
async function getProfileDislikedItems(user) {
  // Get the active profile from the user session object
  const { activeProfile: activeProfileID } = user;
  // `Bearer` token must be included in authorization headers for Strapi requests
  const config = {
    headers: { Authorization: `Bearer ${user?.strapiToken}` },
  };
  const getDislikedMediaURL = `${API_URL}/api/disliked-medias`;
  const getDislikedMediaResponse = await axios.get(getDislikedMediaURL, config);
  const dislikedMediaResponse = await getDislikedMediaResponse.data.data;
  if (getDislikedMediaResponse.status === 200) {
    let dislikedMediaArray = [];
    // Only take the items that belond to the active profile
    dislikedMediaResponse.map(({ id, attributes }) => {
      if (attributes.profileID === activeProfileID) {
        dislikedMediaArray.push({
          ...attributes.mediaItem,
          media_type: attributes.mediaItem.media_type,
          timestamp: attributes.timestamp,
          disliked_media_id: id,
          is_disliked: !!id,
        });
      }
      return;
    });
    // Using Set(), an instance of unique values will be created removing any duplicates
    dislikedMediaArray = new Set(dislikedMediaArray);
    // Convert the instance into a new array
    dislikedMediaArray = [...dislikedMediaArray];
    return {
      data: dislikedMediaArray.length ? dislikedMediaArray : null,
    };
  }
}

/**
 * Referenced in usePreviewModal hook
 */
export default withSessionRoute(async (req, res) => {
  // Get the current activeProfile from browser cookies
  const { activeProfile } = parseCookies(req);
  // Get the authenticated user from iron-session middleware
  const { id, type } = req.query;
  const userSessionObj = req.session.user;
  // Attach the current activeProfile ID to the user data object
  const user = {
    ...userSessionObj,
    activeProfile,
  };

  if (req.method === "GET") {
    try {
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
      const [getTitle, getCredits] = await Promise.all([
        axios.get(apiTitleURL.href),
        axios.get(apiCreditsURL.href),
      ]);

      // TMDB response
      const title = await getTitle.data;
      const credits = await getCredits.data;

      // Get user profile preferences
      const { data: mediaListArray } = await getProfileMediaList(user);
      const { data: likedMediaArray } = await getProfileLikedItems(user);
      const { data: dislikedMediaArray } = await getProfileDislikedItems(user);

      // If successful, send the media to the frontend
      if (getTitle.status === 200 && getCredits.status === 200) {
        // Determine if item appears in the media list. Returns a boolean
        const mediaListItem = mediaListArray?.find(
          (item) => item?.id === title?.id
        );
        // Determine if item appears in the liked media list. Returns a boolean
        const likedMediaItem = likedMediaArray?.find(
          (item) => item?.id === title?.id
        );
        // Determine if item appears in the disliked media list. Returns a boolean
        const dislikedMediaItem = dislikedMediaArray?.find(
          (item) => item?.id === title?.id
        );
        res.status(200).json({
          data: {
            ...title,
            ...credits,
            media_type: type,
            in_media_list: !!mediaListItem?.media_list_id,
            media_list_id: mediaListItem?.media_list_id || null,
            is_liked: !!likedMediaItem?.liked_media_id,
            liked_media_id: likedMediaItem?.liked_media_id || null,
            is_disliked: !!dislikedMediaItem?.disliked_media_id,
            disliked_media_id: dislikedMediaItem?.disliked_media_id || null,
          },
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
