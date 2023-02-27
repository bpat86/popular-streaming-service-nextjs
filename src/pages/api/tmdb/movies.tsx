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
      const popularMoviesUrl = requests.fetchPopularMovies.url;
      const trendingMoviesUrl = requests.fetchTrendingMovies.url;
      const comedyMoviesUrl = requests.fetchComedyMovies.url;
      const actionMoviesUrl = requests.fetchActionMovies.url;
      const romanceMoviesUrl = requests.fetchRomanceMovies.url;
      const animatedMoviesUrl = requests.fetchAnimatedMovies.url;
      const horrorMoviesUrl = requests.fetchHorrorMovies.url;
      try {
        // Fetch all data concurrently
        const results = await Promise.allSettled([
          axios.get(userMeURL, config),
          axios.get(makeMediaURL(popularMoviesUrl, "1")),
          axios.get(makeMediaURL(popularMoviesUrl, "2")),
          axios.get(makeMediaURL(popularMoviesUrl, "3")),
          axios.get(makeMediaURL(trendingMoviesUrl, "1")),
          axios.get(makeMediaURL(trendingMoviesUrl, "2")),
          axios.get(makeMediaURL(trendingMoviesUrl, "3")),
          axios.get(makeMediaURL(comedyMoviesUrl, "1")),
          axios.get(makeMediaURL(comedyMoviesUrl, "2")),
          axios.get(makeMediaURL(comedyMoviesUrl, "3")),
          axios.get(makeMediaURL(actionMoviesUrl, "1")),
          axios.get(makeMediaURL(actionMoviesUrl, "2")),
          axios.get(makeMediaURL(actionMoviesUrl, "3")),
          axios.get(makeMediaURL(romanceMoviesUrl, "1")),
          axios.get(makeMediaURL(romanceMoviesUrl, "2")),
          axios.get(makeMediaURL(romanceMoviesUrl, "3")),
          axios.get(makeMediaURL(horrorMoviesUrl, "1")),
          axios.get(makeMediaURL(horrorMoviesUrl, "2")),
          axios.get(makeMediaURL(horrorMoviesUrl, "3")),
          axios.get(makeMediaURL(animatedMoviesUrl, "1")),
          axios.get(makeMediaURL(animatedMoviesUrl, "2")),
          axios.get(makeMediaURL(animatedMoviesUrl, "3")),
        ]);
        const [
          getUserMe,
          getPopularMoviesOne,
          getPopularMoviesTwo,
          getPopularMoviesThree,
          getTrendingMoviesOne,
          getTrendingMoviesTwo,
          getTrendingMoviesThree,
          getComedyMoviesOne,
          getComedyMoviesTwo,
          getComedyMoviesThree,
          getActionMoviesOne,
          getActionMoviesTwo,
          getActionMoviesThree,
          getRomanceMoviesOne,
          getRomanceMoviesTwo,
          getRomanceMoviesThree,
          getHorrorMoviesOne,
          getHorrorMoviesTwo,
          getHorrorMoviesThree,
          getAnimatedMoviesOne,
          getAnimatedMoviesTwo,
          getAnimatedMoviesThree,
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
        const popularMovies = makeMediaArray({
          srcArray: [
            ...(getPopularMoviesOne.status === 200
              ? getPopularMoviesOne.data.results
              : []),
            ...(getPopularMoviesTwo.status === 200
              ? getPopularMoviesTwo.data.results
              : []),
            ...(getPopularMoviesThree.status === 200
              ? getPopularMoviesThree.data.results
              : []),
          ],
          mediaType: "movie",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const trendingMovies = makeMediaArray({
          srcArray: [
            ...(getTrendingMoviesOne.status === 200
              ? getTrendingMoviesOne.data.results
              : []),
            ...(getTrendingMoviesTwo.status === 200
              ? getTrendingMoviesTwo.data.results
              : []),
            ...(getTrendingMoviesThree.status === 200
              ? getTrendingMoviesThree.data.results
              : []),
          ],
          mediaType: "movie",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const comedyMovies = makeMediaArray({
          srcArray: [
            ...(getComedyMoviesOne.status === 200
              ? getComedyMoviesOne.data.results
              : []),
            ...(getComedyMoviesTwo.status === 200
              ? getComedyMoviesTwo.data.results
              : []),
            ...(getComedyMoviesThree.status === 200
              ? getComedyMoviesThree.data.results
              : []),
          ],
          mediaType: "movie",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const actionMovies = makeMediaArray({
          srcArray: [
            ...(getActionMoviesOne.status === 200
              ? getActionMoviesOne.data.results
              : []),
            ...(getActionMoviesTwo.status === 200
              ? getActionMoviesTwo.data.results
              : []),
            ...(getActionMoviesThree.status === 200
              ? getActionMoviesThree.data.results
              : []),
          ],
          mediaType: "movie",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const romanceMovies = makeMediaArray({
          srcArray: [
            ...(getRomanceMoviesOne.status === 200
              ? getRomanceMoviesOne.data.results
              : []),
            ...(getRomanceMoviesTwo.status === 200
              ? getRomanceMoviesTwo.data.results
              : []),
            ...(getRomanceMoviesThree.status === 200
              ? getRomanceMoviesThree.data.results
              : []),
          ],
          mediaType: "movie",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const horrorMovies = makeMediaArray({
          srcArray: [
            ...(getHorrorMoviesOne.status === 200
              ? getHorrorMoviesOne.data.results
              : []),
            ...(getHorrorMoviesTwo.status === 200
              ? getHorrorMoviesTwo.data.results
              : []),
            ...(getHorrorMoviesThree.status === 200
              ? getHorrorMoviesThree.data.results
              : []),
          ],
          mediaType: "movie",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        const animatedMovies = makeMediaArray({
          srcArray: [
            ...(getAnimatedMoviesOne.status === 200
              ? getAnimatedMoviesOne.data.results
              : []),
            ...(getAnimatedMoviesTwo.status === 200
              ? getAnimatedMoviesTwo.data.results
              : []),
            ...(getAnimatedMoviesThree.status === 200
              ? getAnimatedMoviesThree.data.results
              : []),
          ],
          mediaType: "movie",
          profileMediaListArray: profileMediaList,
          profileLikedMediaArray: profileLikedMedia,
          profileDislikedMediaArray: profileDislikedMedia,
        });
        // Get the Billboard component movie media
        const { data: billboardMedia } = await getBillboardMedia({
          srcArray: profileMediaList.length ? profileMediaList : popularMovies,
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
            popularMovies,
            trendingMovies,
            comedyMovies,
            actionMovies,
            romanceMovies,
            horrorMovies,
            animatedMovies,
            sliders: [
              {
                id: 0,
                type: "mixed",
                name: "My List",
                data: myMediaList,
              },
              {
                id: 1,
                type: "movie",
                name: requests.fetchTrendingMovies.title,
                data: trendingMovies,
              },
              {
                id: 2,
                type: "movie",
                name: requests.fetchPopularMovies.title,
                data: popularMovies,
              },
              {
                id: 3,
                type: "movie",
                name: requests.fetchComedyMovies.title,
                data: comedyMovies,
              },
              {
                id: 4,
                type: "movie",
                name: requests.fetchActionMovies.title,
                data: actionMovies,
              },
              {
                id: 5,
                type: "movie",
                name: requests.fetchRomanceMovies.title,
                data: romanceMovies,
              },
              {
                id: 6,
                type: "movie",
                name: requests.fetchHorrorMovies.title,
                data: horrorMovies,
              },
              {
                id: 7,
                type: "movie",
                name: requests.fetchAnimatedMovies.title,
                data: animatedMovies,
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
