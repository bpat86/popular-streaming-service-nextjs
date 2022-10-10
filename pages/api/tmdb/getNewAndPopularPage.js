import axios from "axios";
import requests from "@/utils/requests";
import { API_URL } from "@/config/index";
import { parseCookies } from "@/utils/parseCookies";
import { withSessionRoute } from "@/middleware/withSession";

const apiKey = requests.API_KEY;
const apiBaseURL = requests.BASE_URL;

function orderByLastAdded(array) {
  array.sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
  return array;
}

/**
 * Return a random result from an array
 * @param {Array} array
 * @returns
 */
function pickRandomIdx(array) {
  const date = new Date();
  // const random = array[Math.floor(Math.random() * array.length)];
  const random =
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    array.length;
  return random;
}

/**
 * Return a random result integer
 * @param {Array} array
 * @returns
 */
const pickRandomInt = (max) => Math.floor(Math.random() * max);

/**
 * Remove items if they don't have a backdrop images or overviews
 * @param {Array} array
 * @returns
 */
function makeMediaArray(props) {
  const {
    srcArray,
    mediaType,
    profileMediaListArray,
    profileLikedMediaArray,
    profileDislikedMediaArray,
  } = props;
  let mediaArray = [];
  // Construct a new array with new keys denoting the user's media preferences
  srcArray?.map((srcItem) => {
    // Discard items that don't have images and overviews
    if (srcItem?.backdrop_path !== null && srcItem?.overview !== null) {
      const isDuplicate = mediaArray?.some(({ id }) => id === srcItem?.id);
      if (!isDuplicate) {
        // Find item in media list
        const mediaListItem = profileMediaListArray?.find(
          ({ id }) => id === srcItem?.id
        );
        // Find item in liked media list
        const likedMediaItem = profileLikedMediaArray?.find(
          ({ id }) => id === srcItem?.id
        );
        // Find item in disliked media list
        const dislikedMediaItem = profileDislikedMediaArray?.find(
          ({ id }) => id === srcItem?.id
        );
        mediaArray.push({
          ...srcItem,
          media_type: mediaType || srcItem?.media_type,
          in_media_list: !!mediaListItem?.media_list_id,
          media_list_id: mediaListItem?.media_list_id || null,
          is_liked: !!likedMediaItem?.liked_media_id,
          liked_media_id: likedMediaItem?.liked_media_id || null,
          is_disliked: !!dislikedMediaItem?.disliked_media_id,
          disliked_media_id: dislikedMediaItem?.disliked_media_id || null,
        });
      }
    }
  });
  // Using Set(), an instance of unique values will be created removing any duplicates
  mediaArray = new Set(mediaArray);
  // Convert the instance into a new array
  mediaArray = [...mediaArray];
  return mediaArray.length ? mediaArray : null;
}

/**
 * Return the maximum popularity value
 * @param {Array} items
 * @returns
 */
function getMaxValue(items) {
  let minValueIdx = 0;
  for (let i = 1; i < items.length; i++) {
    if (items[i].num.popularity > items[minValueIdx].num.popularity) {
      minValueIdx = i;
    }
  }
  return items[minValueIdx];
}

/**
 * Merge and sort by most popular
 * @param {Array} arrays
 * @returns
 */
function mergeSortedArrays(arrays) {
  const sortedList = [];
  const elementIdxs = arrays.map(() => 0);
  while (true) {
    const smallestItems = [];
    for (let arrayIdx = 0; arrayIdx < arrays.length; arrayIdx++) {
      const relevantArray = arrays[arrayIdx];
      const elementIdx = elementIdxs[arrayIdx];
      if (elementIdx === relevantArray.length) continue;
      smallestItems.push({
        arrayIdx,
        num: relevantArray[elementIdx],
      });
    }
    if (smallestItems.length === 0) break;
    const nextItem = getMaxValue(smallestItems);
    sortedList.push(nextItem.num);
    elementIdxs[nextItem.arrayIdx]++;
  }
  return sortedList;
}

/**
 * Format the URL to fetch media items
 * This function returns a URL string.
 * @param {String} mediaGenreUrl
 * @param {Number} pageNumber
 * @returns
 */
function makeMediaURL(mediaGenreUrl, pageNumber) {
  const url = apiBaseURL + mediaGenreUrl;
  const mediaURL = new URL(url);
  mediaURL.searchParams.set("page", pageNumber);
  return mediaURL.href;
}

/**
 * Format the URL to fetch a single media item.
 * This function returns a URL string.
 * @param {Object}
 * @returns
 */
function makeMediaItemSingleURL({ mediaType, mediaID }) {
  const url = apiBaseURL + `/${mediaType}/${mediaID}`;
  const mediaURL = new URL(url);
  mediaURL.searchParams.set("api_key", apiKey);
  mediaURL.searchParams.set("append_to_response", "videos,images");
  return mediaURL.href;
}

/**
 * Format the URL to fetch the media items credits.
 * This function returns a URL string.
 * @param {Object}
 * @returns
 */
function makeMediaItemSingleCreditsURL({ mediaType, mediaID }) {
  const url = apiBaseURL + `/${mediaType}/${mediaID}` + "/credits";
  const mediaURL = new URL(url);
  mediaURL.searchParams.set("api_key", apiKey);
  mediaURL.searchParams.set("append_to_response", "videos,images");
  return mediaURL.href;
}

/**
 * Fetch the media item to be displayed in the billboard component
 * @param {Array} array
 * @returns
 */
async function getBillboardMedia({
  srcArray,
  profileMediaListArray,
  profileLikedMediaArray,
  profileDislikedMediaArray,
}) {
  if (srcArray == null) return {};
  // const idsArray = [656663, 414906, 646380, 696806, 634649, 619979, 615904];
  const idsArray = [...srcArray.slice(0, 15)];
  const randomItem = idsArray[pickRandomIdx(idsArray)];
  const params = {
    mediaType: randomItem.media_type,
    mediaID: randomItem.id || srcArray[pickRandomInt(6)].id,
  };
  const [getBillboardMedia, getBillboardMediaCredits] = await Promise.all([
    axios.get(makeMediaItemSingleURL(params)),
    axios.get(makeMediaItemSingleCreditsURL(params)),
  ]);
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
      // Genres URLs
      const popularMoviesUrl = requests.fetchPopularMovies.url;
      const nowPlayingMoviesUrl = requests.fetchNowPlayingMovies.url;
      const trendingMoviesUrl = requests.fetchTrendingMovies.url;
      const popularTVUrl = requests.fetchPopularTV.url;
      const airingTodayTVUrl = requests.fetchAiringTodayTV.url;
      // Fetch all data concurrently
      const [
        getUserMe,
        getPopularMoviesOne,
        getPopularMoviesTwo,
        getPopularMoviesThree,
        getNowPlayingMoviesOne,
        getNowPlayingMoviesTwo,
        getNowPlayingMoviesThree,
        getTrendingMoviesOne,
        getTrendingMoviesTwo,
        getTrendingMoviesThree,
        getPopularTVOne,
        getPopularTVTwo,
        getPopularTVThree,
        getAiringTodayTVOne,
        getAiringTodayTVTwo,
        getAiringTodayTVThree,
      ] = await Promise.all([
        axios.get(userMeURL, config),
        axios.get(makeMediaURL(popularMoviesUrl, 1)),
        axios.get(makeMediaURL(popularMoviesUrl, 2)),
        axios.get(makeMediaURL(popularMoviesUrl, 3)),
        axios.get(makeMediaURL(nowPlayingMoviesUrl, 1)),
        axios.get(makeMediaURL(nowPlayingMoviesUrl, 2)),
        axios.get(makeMediaURL(nowPlayingMoviesUrl, 3)),
        axios.get(makeMediaURL(trendingMoviesUrl, 1)),
        axios.get(makeMediaURL(trendingMoviesUrl, 2)),
        axios.get(makeMediaURL(trendingMoviesUrl, 3)),
        axios.get(makeMediaURL(popularTVUrl, 1)),
        axios.get(makeMediaURL(popularTVUrl, 2)),
        axios.get(makeMediaURL(popularTVUrl, 3)),
        axios.get(makeMediaURL(airingTodayTVUrl, 1)),
        axios.get(makeMediaURL(airingTodayTVUrl, 2)),
        axios.get(makeMediaURL(airingTodayTVUrl, 3)),
      ]);
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
        srcArray: [...profileMediaList],
        mediaType: null,
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
      const nowPlayingMovies = makeMediaArray({
        srcArray: [
          ...(getNowPlayingMoviesOne.status === 200
            ? getNowPlayingMoviesOne.data.results
            : []),
          ...(getNowPlayingMoviesTwo.status === 200
            ? getNowPlayingMoviesTwo.data.results
            : []),
          ...(getNowPlayingMoviesThree.status === 200
            ? getNowPlayingMoviesThree.data.results
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
      // Merge tv and movies to create a mixed content array
      const tvAndMoviesArray = mergeSortedArrays([
        popularMovies.slice(0, 30 || Math.floor(popularMovies.length / 2)),
        popularTV.slice(0, 30 || Math.floor(popularTV.length / 2)),
      ]);
      // Get the Billboard component movie media
      const { data: billboardMedia } = await getBillboardMedia({
        srcArray: popularMovies,
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
          nowPlayingMovies,
          trendingMovies,
          airingTodayTV,
          sliders: [
            {
              id: 0,
              type: "mixed",
              name: "My List",
              data: myMediaList,
            },
            {
              id: 1,
              type: "tv",
              name: requests.fetchAiringTodayTV.title,
              data: airingTodayTV,
            },
            {
              id: 2,
              type: "movie",
              name: requests.fetchNowPlayingMovies.title,
              data: nowPlayingMovies,
            },
            {
              id: 3,
              type: "mixed",
              name: requests.fetchPopularMovies.title,
              data: tvAndMoviesArray,
            },
            {
              id: 4,
              type: "movie",
              name: requests.fetchTrendingMovies.title,
              data: trendingMovies,
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
