import axios from "axios";

import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

import { API_URL } from "@/config/index";

function orderByLastAdded(array) {
  array.sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
  return array;
}

/**
 * Remove items if they don't have a backdrop images or overviews
 * @param {Array} array
 * @returns
 */
function makeMediaArray({
  srcArray = [],
  mediaType = null,
  profileMediaListArray = [],
  profileLikedMediaArray = [],
  profileDislikedMediaArray = [],
}) {
  if (!srcArray.length) return [];
  const mediaArray = new Array();
  // Construct a new array with new keys denoting the user's media preferences
  srcArray.map((item) => {
    if (
      item.overview &&
      item.backdrop_path &&
      !mediaArray?.some(({ id }) => id === item.id)
    ) {
      // Find item in media list
      const mediaListItem = profileMediaListArray?.find(
        ({ id }) => id === item.id
      );
      // Find item in liked media list
      const likedMediaItem = profileLikedMediaArray?.find(
        ({ id }) => id === item.id
      );
      // Find item in disliked media list
      const dislikedMediaItem = profileDislikedMediaArray?.find(
        ({ id }) => id === item.id
      );
      mediaArray.push({
        ...item,
        media_type: mediaType || item?.media_type,
        in_media_list: !!mediaListItem?.media_list_id,
        media_list_id: mediaListItem?.media_list_id || null,
        is_liked: !!likedMediaItem?.liked_media_id,
        liked_media_id: likedMediaItem?.liked_media_id || null,
        is_disliked: !!dislikedMediaItem?.disliked_media_id,
        disliked_media_id: dislikedMediaItem?.disliked_media_id || null,
      });
      return mediaArray;
    }
  });
  return mediaArray.length ? mediaArray : [];
}

/**
 * Fetch the active profile's media list items.
 * This function will return an array of objects.
 * @param {Object} profile
 * @returns
 */
function getProfileMediaList({ profile }) {
  const { mediaList } = profile;
  let profileMediaList = [];
  // Add the liked items into a new media array and assign new keys
  mediaList?.map(({ mediaItem, mediaType, timestamp, mediaID }) => {
    profileMediaList.push({
      ...mediaItem, // Refers to the `mediaItem` JSON collection field in Strapi
      media_type: mediaType, // Refers to the `mediaType` field in Strapi
      timestamp: timestamp, // Refers to the `timestamp` field in Strapi
      media_list_id: mediaID, // Refers to the `mediaID` field in Strapi
      in_media_list: !!mediaID, // Refers to the `mediaID` field in Strapi
    });
  });
  // Using Set(), an instance of unique values will be created removing any duplicates
  profileMediaList = new Set(profileMediaList);
  // Convert the instance into a new array
  profileMediaList = [...profileMediaList];
  // Sort by last added
  profileMediaList = orderByLastAdded(profileMediaList);
  return profileMediaList.length ? profileMediaList : [];
}

/**
 * Fetch the active profile's liked media items.
 * This function will return an array of objects.
 * @param {Object} profile
 * @returns
 */
function getProfileLikedMedia({ profile }) {
  const { likedMedia } = profile;
  let profileLikedMedia = [];
  // Add the liked items into a new media array and assign new keys
  likedMedia?.map(({ mediaItem, mediaType, timestamp, mediaID }) => {
    profileLikedMedia.push({
      ...mediaItem, // Refers to the `mediaItem` JSON collection field in Strapi
      media_type: mediaType, // Refers to the `mediaType` field in Strapi
      timestamp: timestamp, // Refers to the `timestamp` field in Strapi
      liked_media_id: mediaID, // Refers to the `mediaID` field in Strapi
      is_liked: !!mediaID, // Refers to the `mediaID` field in Strapi
    });
  });
  // Using Set(), an instance of unique values will be created removing any duplicates
  profileLikedMedia = new Set(profileLikedMedia);
  // Convert the instance into a new array
  profileLikedMedia = [...profileLikedMedia];
  return profileLikedMedia.length ? profileLikedMedia : [];
}

/**
 * Fetch the active profile's disliked media items.
 * This function will return an array of objects.
 * @param {Object} profile
 * @returns
 */
function getProfileDislikedMedia({ profile }) {
  const { dislikedMedia } = profile;
  let profileDislikedMedia = [];
  // Add the disliked items into a new media array and assign new keys
  dislikedMedia?.map(({ mediaItem, mediaType, timestamp, mediaID }) => {
    profileDislikedMedia.push({
      ...mediaItem, // Refers to the `mediaItem` JSON collection field in Strapi
      media_type: mediaType, // Refers to the `mediaType` field in Strapi
      timestamp: timestamp, // Refers to the `timestamp` field in Strapi
      disliked_media_id: mediaID, // Refers to the `mediaID` field in Strapi
      is_disliked: !!mediaID, // Refers to the `mediaID` field in Strapi
    });
  });
  // Using Set(), an instance of unique values will be created removing any duplicates
  profileDislikedMedia = new Set(profileDislikedMedia);
  // Convert the instance into a new array
  profileDislikedMedia = [...profileDislikedMedia];
  return profileDislikedMedia.length ? profileDislikedMedia : [];
}

export default withSessionRoute(async (req, res) => {
  // Get the current activeProfile from browser cookies
  const { activeProfile } = parseCookies(req);
  // Get the authenticated user from iron-session middleware
  const userSessionObj = req.session.user;
  // Attach the current activeProfile ID to the user data object
  const user = {
    ...userSessionObj,
    activeProfile,
  };

  if (req.method === "GET") {
    try {
      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };
      // User URL
      const userMeURL = `${API_URL}/api/users/me`;
      // Fetch all data concurrently
      const [getUserMe] = await Promise.all([axios.get(userMeURL, config)]);
      const profileMediaList = getProfileMediaList({
        profile: {
          ...(getUserMe.status === 200
            ? getUserMe.data.profiles?.find(
                (profile) => profile.id == activeProfile
              )
            : {}),
        },
      });
      const profileLikedMedia = getProfileLikedMedia({
        profile: {
          ...(getUserMe.status === 200
            ? getUserMe.data.profiles?.find(
                (profile) => profile.id == activeProfile
              )
            : {}),
        },
      });
      const profileDislikedMedia = getProfileDislikedMedia({
        profile: {
          ...(getUserMe.status === 200
            ? getUserMe.data.profiles?.find(
                (profile) => profile.id == activeProfile
              )
            : {}),
        },
      });
      // Build sliders
      const myMediaList = makeMediaArray({
        srcArray: profileMediaList,
        mediaType: null,
        profileMediaListArray: profileMediaList,
        profileLikedMediaArray: profileLikedMedia,
        profileDislikedMediaArray: profileDislikedMedia,
      });

      // Send the media data to the frontend
      res.status(200).json({
        data: {
          billboard: {
            data: {}, // billboardMedia
          },
          profileMediaList: profileMediaList ?? [],
          profileLikedMedia: profileLikedMedia ?? [],
          profileDislikedMedia: profileDislikedMedia ?? [],
          sliders: [
            {
              id: 0,
              type: "mixed",
              name: "My List",
              data: myMediaList ?? [],
            },
          ],
        },
      });
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
