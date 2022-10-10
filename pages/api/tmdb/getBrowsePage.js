import requests from "@/utils/requests";
import { API_URL } from "@/config/index";
import { getFetch } from "lib/getFetch";
import { getFetchConcurrently } from "lib/getFetchConcurrently";
import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

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
    if (
      srcItem?.backdrop_path !== null &&
      srcItem?.overview.length > 0 &&
      srcItem?.overview.length < 500
    ) {
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
        mediaArray.push(
          Object.assign(
            Object.assign({}, srcItem),
            {},
            {
              media_type: mediaType || srcItem?.media_type,
              in_media_list: !!mediaListItem?.media_list_id,
              media_list_id: mediaListItem?.media_list_id || null,
              is_liked: !!likedMediaItem?.liked_media_id,
              liked_media_id: likedMediaItem?.liked_media_id || null,
              is_disliked: !!dislikedMediaItem?.disliked_media_id,
              disliked_media_id: dislikedMediaItem?.disliked_media_id || null,
            }
          )
        );
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
  let filteredSrc = [];
  filteredSrc = new Set(srcArray);
  filteredSrc = [...filteredSrc];
  // const idsArray = [656663, 414906, 646380, 696806, 634649, 619979, 615904];
  const idsArray = filteredSrc.slice(0, 46);
  const randomItem = idsArray[pickRandomIdx(idsArray)];
  const params = {
    mediaType:
      randomItem.media_type || filteredSrc[pickRandomInt(6)].media_type,
    mediaID: randomItem.id || filteredSrc[pickRandomInt(6)].id,
  };
  const [getBillboardMedia, getBillboardMediaCredits] =
    await getFetchConcurrently([
      getFetch(makeMediaItemSingleURL(params)),
      getFetch(makeMediaItemSingleCreditsURL(params)),
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
    data: Object.assign({}, billboardMedia, billboardMediaCredits, {
      is_billboard: true,
      media_type: randomItem.media_type,
      in_media_list: !!mediaListItem?.media_list_id,
      media_list_id: mediaListItem?.media_list_id || null,
      is_liked: !!likedMediaItem?.liked_media_id,
      liked_media_id: likedMediaItem?.liked_media_id || null,
      is_disliked: !!dislikedMediaItem?.disliked_media_id,
      disliked_media_id: dislikedMediaItem?.disliked_media_id || null,
    }),
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
  mediaList?.map(({ id, mediaItem, mediaType, timestamp, mediaID }) => {
    profileMediaList.push(
      Object.assign(
        Object.assign({}, mediaItem), // Refers to the `mediaItem` JSON collection field in Strapi
        {
          media_type: mediaType, // Refers to the `mediaType` field in Strapi
          timestamp: timestamp, // Refers to the `timestamp` field in Strapi
          media_list_id: id, // Refers to the `mediaID` field in Strapi
          in_media_list: !!id, // Refers to the `mediaID` field in Strapi
        }
      )
    );
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
  console.log("likedMedia: ", likedMedia);
  let profileLikedMedia = [];
  // Add the liked items into a new media array and assign new keys
  likedMedia?.map(({ id, mediaItem, mediaType, timestamp, mediaID }) => {
    profileLikedMedia.push(
      Object.assign(
        Object.assign({}, mediaItem), // Refers to the `mediaItem` JSON collection field in Strapi
        {
          media_type: mediaType, // Refers to the `mediaType` field in Strapi
          timestamp: timestamp, // Refers to the `timestamp` field in Strapi
          liked_media_id: id, // Refers to the `mediaID` field in Strapi
          is_liked: !!id, // Refers to the `mediaID` field in Strapi
          strapi_id: id, // Refers to the item's id within Strapi
        }
      )
    );
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
  dislikedMedia?.map(({ id, mediaItem, mediaType, timestamp, mediaID }) => {
    profileDislikedMedia.push(
      Object.assign(
        Object.assign({}, mediaItem), // Refers to the `mediaItem` JSON collection field in Strapi
        {
          media_type: mediaType, // Refers to the `mediaType` field in Strapi
          timestamp: timestamp, // Refers to the `timestamp` field in Strapi
          disliked_media_id: id, // Refers to the `mediaID` field in Strapi
          is_disliked: !!id, // Refers to the `mediaID` field in Strapi
          strapi_id: id, // Refers to the item's id within Strapi
        }
      )
    );
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
      const upcomingMoviesUrl = requests.fetchUpcomingMovies.url;
      const popularMoviesUrl = requests.fetchPopularMovies.url;
      const trendingMoviesUrl = requests.fetchTrendingMovies.url;
      const comedyMoviesUrl = requests.fetchComedyMovies.url;
      const actionMoviesUrl = requests.fetchActionMovies.url;
      // const romanceMoviesUrl = requests.fetchRomanceMovies.url;
      const popularTVUrl = requests.fetchPopularTV.url;
      // const animatedMoviesUrl = requests.fetchAnimatedMovies.url;
      // const horrorMoviesUrl = requests.fetchHorrorMovies.url;
      // Fetch all data concurrently
      const [
        getUserMe,
        getUpcomingMoviesOne,
        getUpcomingMoviesTwo,
        getUpcomingMoviesThree,
        getPopularMoviesOne,
        getPopularMoviesTwo,
        getPopularMoviesThree,
        getPopularTVOne,
        getPopularTVTwo,
        getPopularTVThree,
        getTrendingMoviesOne,
        getTrendingMoviesTwo,
        getTrendingMoviesThree,
        getComedyMoviesOne,
        getComedyMoviesTwo,
        getComedyMoviesThree,
        getActionMoviesOne,
        getActionMoviesTwo,
        getActionMoviesThree,
        // getRomanceMoviesOne,
        // getRomanceMoviesTwo,
        // getRomanceMoviesThree,
        // getHorrorMoviesOne,
        // getHorrorMoviesTwo,
        // getHorrorMoviesThree,
        // getAnimatedMoviesOne,
        // getAnimatedMoviesTwo,
        // getAnimatedMoviesThree,
      ] = await getFetchConcurrently([
        getFetch(userMeURL, config),
        getFetch(makeMediaURL(upcomingMoviesUrl, 1)),
        getFetch(makeMediaURL(upcomingMoviesUrl, 2)),
        getFetch(makeMediaURL(upcomingMoviesUrl, 3)),
        getFetch(makeMediaURL(popularMoviesUrl, 1)),
        getFetch(makeMediaURL(popularMoviesUrl, 2)),
        getFetch(makeMediaURL(popularMoviesUrl, 3)),
        getFetch(makeMediaURL(popularTVUrl, 1)),
        getFetch(makeMediaURL(popularTVUrl, 2)),
        getFetch(makeMediaURL(popularTVUrl, 3)),
        getFetch(makeMediaURL(trendingMoviesUrl, 1)),
        getFetch(makeMediaURL(trendingMoviesUrl, 2)),
        getFetch(makeMediaURL(trendingMoviesUrl, 3)),
        getFetch(makeMediaURL(comedyMoviesUrl, 1)),
        getFetch(makeMediaURL(comedyMoviesUrl, 2)),
        getFetch(makeMediaURL(comedyMoviesUrl, 3)),
        getFetch(makeMediaURL(actionMoviesUrl, 1)),
        getFetch(makeMediaURL(actionMoviesUrl, 2)),
        getFetch(makeMediaURL(actionMoviesUrl, 3)),
        // getFetch(makeMediaURL(romanceMoviesUrl, 1)),
        // getFetch(makeMediaURL(romanceMoviesUrl, 2)),
        // getFetch(makeMediaURL(romanceMoviesUrl, 3)),
        // getFetch(makeMediaURL(horrorMoviesUrl, 1)),
        // getFetch(makeMediaURL(horrorMoviesUrl, 2)),
        // getFetch(makeMediaURL(horrorMoviesUrl, 3)),
        // getFetch(makeMediaURL(animatedMoviesUrl, 1)),
        // getFetch(makeMediaURL(animatedMoviesUrl, 2)),
        // getFetch(makeMediaURL(animatedMoviesUrl, 3)),
      ]);
      const profileMediaList = getProfileMediaList(
        Object.assign(
          Object.assign({
            profile: Object.assign(
              {},
              getUserMe.status === 200
                ? getUserMe.data.profiles?.find(
                    (profile) => profile.id == activeProfile
                  )
                : {}
            ),
          })
        )
      );
      const profileLikedMedia = getProfileLikedMedia(
        Object.assign(
          Object.assign({
            profile: Object.assign(
              {},
              getUserMe.status === 200
                ? getUserMe.data.profiles?.find(
                    (profile) => profile.id == activeProfile
                  )
                : {}
            ),
          })
        )
      );
      const profileDislikedMedia = getProfileDislikedMedia(
        Object.assign(
          Object.assign({
            profile: Object.assign(
              {},
              getUserMe.status === 200
                ? getUserMe.data.profiles?.find(
                    (profile) => profile.id == activeProfile
                  )
                : {}
            ),
          })
        )
      );
      // Build sliders
      const myMediaList = makeMediaArray(
        Object.assign(
          Object.assign({
            srcArray: profileMediaList,
            mediaType: null,
            profileMediaListArray: profileMediaList,
            profileLikedMediaArray: profileLikedMedia,
            profileDislikedMediaArray: profileDislikedMedia,
          })
        )
      );
      const upcomingMovies = makeMediaArray(
        Object.assign(
          Object.assign({
            srcArray: [
              ...(getUpcomingMoviesOne.status === 200
                ? getUpcomingMoviesOne.data.results
                : []),
              ...(getUpcomingMoviesTwo.status === 200
                ? getUpcomingMoviesTwo.data.results
                : []),
              ...(getUpcomingMoviesThree.status === 200
                ? getUpcomingMoviesThree.data.results
                : []),
            ],
            mediaType: "movie",
            profileMediaListArray: profileMediaList,
            profileLikedMediaArray: profileLikedMedia,
            profileDislikedMediaArray: profileDislikedMedia,
          })
        )
      );
      const popularMovies = makeMediaArray(
        Object.assign(
          Object.assign({
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
          })
        )
      );
      const popularTV = makeMediaArray(
        Object.assign(
          Object.assign({
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
          })
        )
      );
      const trendingMovies = makeMediaArray(
        Object.assign(
          Object.assign({
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
          })
        )
      );
      const comedyMovies = makeMediaArray(
        Object.assign(
          Object.assign({
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
          })
        )
      );
      const actionMovies = makeMediaArray(
        Object.assign(
          Object.assign({
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
          })
        )
      );
      // const romanceMovies = makeMediaArray({
      //   srcArray: [
      //     ...(getRomanceMoviesOne.status === 200
      //       ? getRomanceMoviesOne.data.results
      //       : []),
      //     ...(getRomanceMoviesTwo.status === 200
      //       ? getRomanceMoviesTwo.data.results
      //       : []),
      //     ...(getRomanceMoviesThree.status === 200
      //       ? getRomanceMoviesThree.data.results
      //       : []),
      //   ],
      //   mediaType: "movie",
      //   profileMediaListArray: profileMediaList,
      //   profileLikedMediaArray: profileLikedMedia,
      //   profileDislikedMediaArray: profileDislikedMedia,
      // });
      // const horrorMovies = makeMediaArray({
      //   srcArray: [
      //     ...(getHorrorMoviesOne.status === 200
      //       ? getHorrorMoviesOne.data.results
      //       : []),
      //     ...(getHorrorMoviesTwo.status === 200
      //       ? getHorrorMoviesTwo.data.results
      //       : []),
      //     ...(getHorrorMoviesThree.status === 200
      //       ? getHorrorMoviesThree.data.results
      //       : []),
      //   ],
      //   mediaType: "movie",
      //   profileMediaListArray: profileMediaList,
      //   profileLikedMediaArray: profileLikedMedia,
      //   profileDislikedMediaArray: profileDislikedMedia,
      // });
      // const animatedMovies = makeMediaArray({
      //   srcArray: [
      //     ...(getAnimatedMoviesOne.status === 200
      //       ? getAnimatedMoviesOne.data.results
      //       : []),
      //     ...(getAnimatedMoviesTwo.status === 200
      //       ? getAnimatedMoviesTwo.data.results
      //       : []),
      //     ...(getAnimatedMoviesThree.status === 200
      //       ? getAnimatedMoviesThree.data.results
      //       : []),
      //   ],
      //   mediaType: "movie",
      //   profileMediaListArray: profileMediaList,
      //   profileLikedMediaArray: profileLikedMedia,
      //   profileDislikedMediaArray: profileDislikedMedia,
      // });
      // Merge tv and movies to create a mixed content array
      const popularTVAndMovies = mergeSortedArrays([
        popularMovies.slice(0, 30 || Math.floor(popularMovies.length / 2)),
        popularTV.slice(0, 30 || Math.floor(popularTV.length / 2)),
      ]);
      // Get the Billboard component movie media
      const { data: billboardMedia } = await getBillboardMedia(
        Object.assign(
          Object.assign({
            srcArray: profileMediaList.length
              ? [
                  ...profileMediaList,
                  ...profileLikedMedia,
                  ...popularTVAndMovies,
                  ...upcomingMovies,
                ]
              : popularTVAndMovies,
            profileMediaListArray: profileMediaList,
            profileLikedMediaArray: profileLikedMedia,
            profileDislikedMediaArray: profileDislikedMedia,
          })
        )
      );

      // Send the media data to the frontend
      res.status(200).json({
        data: {
          billboard: {
            data: billboardMedia,
            listContext: "billboard",
          },
          profileMediaList,
          profileLikedMedia,
          profileDislikedMedia,
          upcomingMovies,
          popularMovies,
          trendingMovies,
          comedyMovies,
          actionMovies,
          // romanceMovies,
          // horrorMovies,
          // animatedMovies,
          sliders: [
            {
              id: 0,
              type: "mixed",
              name: "My List",
              listContext: "queue",
              data: myMediaList,
              isMyListRow: true,
            },
            {
              id: 1,
              type: "mixed",
              name: requests.fetchPopularMovies.title,
              listContext: requests.fetchPopularMovies.listContext,
              data: popularTVAndMovies,
              isMyListRow: false,
            },
            {
              id: 2,
              type: "movie",
              name: requests.fetchUpcomingMovies.title,
              listContext: requests.fetchUpcomingMovies.listContext,
              data: upcomingMovies,
              isMyListRow: false,
            },
            {
              id: 3,
              type: "movie",
              name: requests.fetchTrendingMovies.title,
              listContext: requests.fetchTrendingMovies.listContext,
              data: trendingMovies,
              isMyListRow: false,
            },
            {
              id: 4,
              type: "movie",
              name: requests.fetchComedyMovies.title,
              listContext: requests.fetchComedyMovies.listContext,
              data: comedyMovies,
              isMyListRow: false,
            },
            {
              id: 5,
              type: "movie",
              name: requests.fetchActionMovies.title,
              listContext: requests.fetchActionMovies.listContext,
              data: actionMovies,
              isMyListRow: false,
            },
            // {
            //   id: 6,
            //   type: "movie",
            //   name: requests.fetchRomanceMovies.title,
            //   listContext: requests.fetchRomanceMovies.listContext,
            //   data: romanceMovies,
            //   isMyListRow: false,
            // },
            // {
            //   id: 7,
            //   type: "movie",
            //   name: requests.fetchHorrorMovies.title,
            //   listContext: requests.fetchHorrorMovies.listContext,
            //   data: horrorMovies,
            //   isMyListRow: false,
            // },
            // {
            //   id: 8,
            //   type: "movie",
            //   name: requests.fetchAnimatedMovies.title,
            //   listContext: requests.fetchAnimatedMovies.listContext,
            //   data: animatedMovies,
            //   isMyListRow: false,
            // },
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
