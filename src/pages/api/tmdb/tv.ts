import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { API_URL } from "@/config/index";
import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";
import { requests } from "@/utils/requests";

import { IMediaItemWithUserPreferences } from "./types";
import {
  handleResults,
  makeMediaArray,
  makeMediaItemSingleCreditsURL,
  makeMediaItemSingleURL,
  makeMediaURL,
  orderByLastAdded,
  pickRandomIdx,
  pickRandomInt,
} from "./utils";

/**
 * Fetch the media item to be displayed in the billboard component
 */
async function getBillboardMedia({
  srcArray,
  profileMediaListArray,
  profileLikedMediaArray,
  profileDislikedMediaArray,
}: {
  srcArray: any[];
  profileMediaListArray: IMediaItemWithUserPreferences[];
  profileLikedMediaArray: IMediaItemWithUserPreferences[];
  profileDislikedMediaArray: IMediaItemWithUserPreferences[];
}) {
  if (!srcArray.length) return {};
  // const idsArray = [656663, 414906, 646380, 696806, 634649, 619979, 615904];
  const idsArray = srcArray.slice(0, 42);
  const randomItem = idsArray[pickRandomIdx(idsArray)];
  const params = {
    mediaType: randomItem.media_type || srcArray[pickRandomInt(6)].media_type,
    mediaID: randomItem.id || srcArray[pickRandomInt(6)].id,
  };
  const results = await Promise.allSettled([
    axios.get(makeMediaItemSingleURL(params)),
    axios.get(makeMediaItemSingleCreditsURL(params)),
  ]);
  const [getBillboardMedia, getBillboardMediaCredits] = handleResults(results);
  const billboardMedia = await getBillboardMedia?.data;
  const billboardMediaCredits = await getBillboardMediaCredits?.data;
  // Determine if item appears in the media list
  const mediaListItem = profileMediaListArray?.find(
    ({ id }) => id === billboardMedia?.id
  );
  // Determine if item appears in the liked media list
  const likedMediaItem = profileLikedMediaArray?.find(
    ({ id }) => id === billboardMedia?.id
  );
  // Determine if item appears in the disliked media list
  const dislikedMediaItem = profileDislikedMediaArray?.find(
    ({ id }) => id === billboardMedia?.id
  );
  return {
    data: {
      ...billboardMedia,
      ...billboardMediaCredits,
      is_billboard: true,
      media_type: randomItem.media_type,
      in_media_list: !!mediaListItem?.media_list_id,
      media_list_id: mediaListItem?.media_list_id || null,
      is_liked: !!likedMediaItem?.liked_media_id,
      liked_media_id: likedMediaItem?.liked_media_id || null,
      is_disliked: !!dislikedMediaItem?.disliked_media_id,
      disliked_media_id: dislikedMediaItem?.disliked_media_id || null,
    },
  };
}

/**
 * Fetch the active profile's media list items.
 * This function will return an array of objects.
 */
function getProfileMediaList({
  profile: { mediaList },
}: {
  profile: { mediaList: any };
}) {
  let profileMediaList = [] as IMediaItemWithUserPreferences[];
  // Add the liked items into a new media array and assign new keys
  mediaList?.map(
    ({
      id,
      mediaItem,
      mediaType,
      timestamp,
    }: {
      id: number;
      mediaItem: any;
      mediaType: string;
      timestamp: string;
    }) => {
      profileMediaList.push({
        ...mediaItem, // Refers to the `mediaItem` JSON collection field in Strapi
        media_type: mediaType, // Refers to the `mediaType` field in Strapi
        timestamp: timestamp, // Refers to the `timestamp` field in Strapi
        media_list_id: id, // Refers to the `mediaID` field in Strapi
        in_media_list: !!id, // Refers to the `mediaID` field in Strapi
      });
    }
  );
  // Sort by last added
  profileMediaList = orderByLastAdded(profileMediaList);
  return profileMediaList.length ? profileMediaList : [];
}

/**
 * Fetch the active profile's liked media items.
 * This function will return an array of objects.
 */
function getProfileLikedMedia({
  profile: { likedMedia },
}: {
  profile: { likedMedia: any };
}) {
  if (!likedMedia) return [];
  const profileLikedMedia = [] as IMediaItemWithUserPreferences[];
  // Add the liked items into a new media array and assign new keys
  likedMedia.forEach(
    ({
      id,
      mediaItem,
      mediaType,
      timestamp,
    }: {
      id: number;
      mediaItem: any;
      mediaType: string;
      timestamp: string;
    }) => {
      profileLikedMedia.push({
        ...mediaItem, // Refers to the `mediaItem` JSON collection field in Strapi
        media_type: mediaType, // Refers to the `mediaType` field in Strapi
        timestamp: timestamp, // Refers to the `timestamp` field in Strapi
        liked_media_id: id, // Refers to the `mediaID` field in Strapi
        is_liked: !!id, // Refers to the `mediaID` field in Strapi
        strapi_id: id, // Refers to the item's id within Strapi
      });
    }
  );
  return profileLikedMedia;
}

/**
 * Fetch the active profile's disliked media items.
 * This function will return an array of objects.
 */
function getProfileDislikedMedia({
  profile: { dislikedMedia },
}: {
  profile: { dislikedMedia: any };
}) {
  if (!dislikedMedia) return [];
  const profileDislikedMedia = [] as IMediaItemWithUserPreferences[];
  // Add the disliked items into a new media array and assign new keys
  dislikedMedia.map(
    ({
      id,
      mediaItem,
      mediaType,
      timestamp,
    }: {
      id: number;
      mediaItem: any;
      mediaType: string;
      timestamp: string;
    }) => {
      profileDislikedMedia.push({
        ...mediaItem, // Refers to the `mediaItem` JSON collection field in Strapi
        media_type: mediaType, // Refers to the `mediaType` field in Strapi
        timestamp: timestamp, // Refers to the `timestamp` field in Strapi
        disliked_media_id: id, // Refers to the `mediaID` field in Strapi
        is_disliked: !!id, // Refers to the `mediaID` field in Strapi
        strapi_id: id, // Refers to the item's id within Strapi
      });
    }
  );
  return profileDislikedMedia;
}

export default withSessionRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
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
      // `Bearer` token must be included in authorization headers for Strapi requests
      const config = {
        headers: { Authorization: `Bearer ${user?.strapiToken}` },
      };
      // User URL
      const userMeURL = `${API_URL}/api/users/me`;
      // Genres URLs
      const popularTVUrl = requests.fetchPopularTV.url;
      const trendingTVUrl = requests.fetchTrendingTV.url;
      const airingTodayTVUrl = requests.fetchAiringTodayTV.url;
      // Fetch all data concurrently
      try {
        const results = await Promise.allSettled([
          axios.get(userMeURL, config),
          axios.get(makeMediaURL(popularTVUrl, "1")),
          axios.get(makeMediaURL(popularTVUrl, "2")),
          axios.get(makeMediaURL(popularTVUrl, "3")),
          axios.get(makeMediaURL(trendingTVUrl, "1")),
          axios.get(makeMediaURL(trendingTVUrl, "2")),
          axios.get(makeMediaURL(trendingTVUrl, "3")),
          axios.get(makeMediaURL(airingTodayTVUrl, "1")),
          axios.get(makeMediaURL(airingTodayTVUrl, "2")),
          axios.get(makeMediaURL(airingTodayTVUrl, "3")),
        ]);
        // Destructure the results
        const [
          getUserMe,
          getPopularTVOne,
          getPopularTVTwo,
          getPopularTVThree,
          getTrendingTVOne,
          getTrendingTVTwo,
          getTrendingTVThree,
          getAiringTodayTVOne,
          getAiringTodayTVTwo,
          getAiringTodayTVThree,
        ] = handleResults(results);
        const profileMediaList = getProfileMediaList({
          profile: {
            ...(getUserMe.status === 200
              ? getUserMe.data.profiles?.find(
                  (profile: any) => profile.id == activeProfile
                )
              : {}),
          },
        });
        const profileLikedMedia = getProfileLikedMedia({
          profile: {
            ...(getUserMe.status === 200
              ? getUserMe.data.profiles?.find(
                  (profile: any) => profile.id == activeProfile
                )
              : {}),
          },
        });
        const profileDislikedMedia = getProfileDislikedMedia({
          profile: {
            ...(getUserMe.status === 200
              ? getUserMe.data.profiles?.find(
                  (profile: any) => profile.id == activeProfile
                )
              : {}),
          },
        });
        // Build sliders
        const myMediaList = makeMediaArray({
          srcArray: profileMediaList,
          mediaType: "",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const popularTV = makeMediaArray({
          srcArray: [
            ...(getPopularTVOne.status === 200
              ? getPopularTVOne.data.results
              : []),
            ...(getPopularTVTwo.status === 200
              ? getPopularTVTwo.data.results
              : []),
            ...(getPopularTVThree.status === 200
              ? getPopularTVThree.data.results
              : []),
          ],
          mediaType: "tv",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const trendingTV = makeMediaArray({
          srcArray: [
            ...(getTrendingTVOne.status === 200
              ? getTrendingTVOne.data.results
              : []),
            ...(getTrendingTVTwo.status === 200
              ? getTrendingTVTwo.data.results
              : []),
            ...(getTrendingTVThree.status === 200
              ? getTrendingTVThree.data.results
              : []),
          ],
          mediaType: "tv",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const airingTodayTV = makeMediaArray({
          srcArray: [
            ...(getAiringTodayTVOne.status === 200
              ? getAiringTodayTVOne.data.results
              : []),
            ...(getAiringTodayTVTwo.status === 200
              ? getAiringTodayTVTwo.data.results
              : []),
            ...(getAiringTodayTVThree.status === 200
              ? getAiringTodayTVThree.data.results
              : []),
          ],
          mediaType: "tv",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        // Get the Billboard component tv media
        const profileMediaListTV = profileMediaList.filter(
          (media) => media.media_type === "tv"
        );
        const { data: billboardMedia } = await getBillboardMedia({
          srcArray: profileMediaListTV.length ? profileMediaListTV : popularTV,
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });

        // Send the media data to the frontend
        res.status(200).json({
          data: {
            billboard: {
              data: billboardMedia,
            },
            profileMediaList,
            profileLikedMedia,
            profileDislikedMedia,
            popularTV,
            trendingTV,
            airingTodayTV,
            sliders: [
              {
                id: 0,
                type: "mixed",
                name: "My List",
                data: myMediaList,
              },
              {
                id: 2,
                type: "tv",
                name: requests.fetchPopularTV.title,
                data: popularTV,
              },
              {
                id: 3,
                type: "tv",
                name: requests.fetchTrendingTV.title,
                data: trendingTV,
              },
              {
                id: 4,
                type: "tv",
                name: requests.fetchAiringTodayTV.title,
                data: airingTodayTV,
              },
            ],
          },
        });
      } catch (error: any) {
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
  }
);
