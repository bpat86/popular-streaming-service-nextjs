import { NextApiRequest, NextApiResponse } from "next";

import { API_URL } from "@/config/index";
import { getFetch } from "@/lib/getFetch";
import { getFetchConcurrently } from "@/lib/getFetchConcurrently";
import { withSessionRoute } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

import { IMediaItemWithUserPreferences, IProfileMediaList } from "./types";
import {
  makeMediaItemSingleCreditsURL,
  makeMediaItemSingleURL,
  orderByLastAdded,
} from "./utils";

/**
 * Fetch the active profile's media list items.
 * This function will return an array of objects.
 */
function getProfileMediaList({ profile }: { profile: any }) {
  const { mediaList } = profile;
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
 * @param {Object} profile
 * @returns
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
 * @param {Object} profile
 * @returns
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
    const { id, type } = req.query;
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
        const params = {
          mediaType: type as string,
          mediaID: Number(id) as number,
        };

        // Get single media item credits URL
        const userMeURL = `${API_URL}/api/users/me`;

        // Get the title page media
        const [getUserMe, getTitle, getCredits] = await getFetchConcurrently([
          getFetch(userMeURL, config),
          getFetch(makeMediaItemSingleURL(params)),
          getFetch(makeMediaItemSingleCreditsURL(params)),
        ]);

        // TMDB response
        const title = getTitle.data;
        const credits = getCredits.data;

        // Get user profile preferences
        const profileMediaList = getProfileMediaList({
          profile: Object.assign(
            {},
            getUserMe.status === 200
              ? getUserMe.data.profiles?.find(
                  (profile: IProfileMediaList) =>
                    profile.id.toString() === activeProfile // Don't forget to convert to string :(
                )
              : {}
          ),
        });
        const profileLikedMedia = getProfileLikedMedia({
          profile: Object.assign(
            {},
            getUserMe.status === 200
              ? getUserMe.data.profiles?.find(
                  (profile: any) => profile.id.toString() === activeProfile
                )
              : {}
          ),
        });
        const profileDislikedMedia = getProfileDislikedMedia({
          profile: Object.assign(
            {},
            getUserMe.status === 200
              ? getUserMe.data.profiles?.find(
                  (profile: any) => profile.id.toString() === activeProfile
                )
              : {}
          ),
        });

        // If successful, send the media to the frontend
        if (getTitle.status === 200 && getCredits.status === 200) {
          // Determine if item appears in the media list. Returns a boolean
          const mediaListItem = profileMediaList?.find(
            (item) => item?.id === title?.id
          );
          // Determine if item appears in the liked media list. Returns a boolean
          const likedMediaItem = profileLikedMedia?.find(
            (item) => item?.id === title?.id
          );
          // Determine if item appears in the disliked media list. Returns a boolean
          const dislikedMediaItem = profileDislikedMedia?.find(
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
