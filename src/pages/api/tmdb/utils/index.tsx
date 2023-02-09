import { IMediaItemWithUserPreferences } from "@/pages/api/tmdb/types";

import requests from "../../../../utils/requests";

const apiKey = requests.API_KEY as string;
const apiBaseURL = requests.BASE_URL as string;

/**
 * Sort an array by last added
 */
export function orderByLastAdded(array: any[]) {
  array.sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
  return array;
}

/**
 * Return a random result from an array
 */
export function pickRandomIdx(array: any[]) {
  const date = new Date();
  // const random = array[Math.floor(Math.random() * array.length)];
  const random =
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    array.length;
  return random;
}

/**
 * Return a random result integer
 */
export function pickRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/**
 * Remove items if they don't have a backdrop images or overviews
 */
export function makeMediaArray({
  srcArray,
  mediaType,
  profileMediaListArray,
  profileLikedMediaArray,
  profileDislikedMediaArray,
}: {
  srcArray: IMediaItemWithUserPreferences[];
  mediaType: string; // TODO: Upgrade Strapi to v4.3+ for TypeScript support
  profileMediaListArray: IMediaItemWithUserPreferences[];
  profileLikedMediaArray: IMediaItemWithUserPreferences[];
  profileDislikedMediaArray: IMediaItemWithUserPreferences[];
}) {
  // If the array is empty, return an empty array
  if (!srcArray.length) return [];
  const mediaArray = [] as IMediaItemWithUserPreferences[];
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
 * Return the maximum popularity value
 * @param {Array} items
 * @returns
 */
export function getMaxValue(items: any[]) {
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
export function mergeSortedArrays(arrays: any[]) {
  const sortedList = [];
  const elementIdxs = arrays.map(() => 0);
  const isTrue = true;
  while (isTrue) {
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
 * This export function returns a URL string.
 * @param {String} mediaGenreUrl
 * @param {Number} pageNumber
 * @returns
 */
export function makeMediaURL(mediaGenreUrl: string, pageNumber: string) {
  const url = apiBaseURL + mediaGenreUrl;
  const mediaURL = new URL(url);
  mediaURL.searchParams.set("page", pageNumber);
  return mediaURL.href;
}

/**
 * Format the URL to fetch a single media item.
 * This export function returns a URL string.
 * @param {Object}
 * @returns
 */
export function makeMediaItemSingleURL({
  mediaType,
  mediaID,
}: {
  mediaType: string;
  mediaID: number;
}) {
  const url = apiBaseURL + `/${mediaType}/${mediaID}`;
  const mediaURL = new URL(url);
  mediaURL.searchParams.set("api_key", apiKey);
  mediaURL.searchParams.set("append_to_response", "videos,images");
  return mediaURL.href;
}

/**
 * Format the URL to fetch the media items credits.
 * This export function returns a URL string.
 * @param {Object}
 * @returns
 */
export function makeMediaItemSingleCreditsURL({
  mediaType,
  mediaID,
}: {
  mediaType: string;
  mediaID: number;
}) {
  const url = apiBaseURL + `/${mediaType}/${mediaID}` + "/credits";
  const mediaURL = new URL(url);
  mediaURL.searchParams.set("api_key", apiKey);
  mediaURL.searchParams.set("append_to_response", "videos,images");
  return mediaURL.href;
}
