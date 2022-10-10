import { createContext, useState, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import assign from "lodash.assign";
import axios from "axios";
import Cookies from "js-cookie";

import { useRouter } from "next/router";
import { NEXT_URL } from "@/config/index";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  // Avatar selection state
  const [defaultAvatar, setDefaultAvatar] = useState("yellow"); // Default yellow smiley
  const [currentAvatar, setCurrentAvatar] = useState(null); // Most recently clicked before final selection
  const [previousAvatar, setPreviousAvatar] = useState(null); // Previously selected before final selection

  const [name, setName] = useState("");
  const [kid, setKid] = useState(null);
  const [autoPlayNextEpisode, setAutoPlayNextEpisode] = useState(null);
  const [autoPlayPreviews, setAutoPlayPreviews] = useState(null);
  const [profileNames, setProfileNames] = useState([]);
  const [profileID, setProfileID] = useState(null);

  // Form state
  const [formDataContext, setFormDataContext] = useState({
    name: name || "",
    avatar: currentAvatar || defaultAvatar,
    kid: kid || false,
    autoPlayNextEpisode: autoPlayNextEpisode || true,
    autoPlayPreviews: autoPlayPreviews || true,
  });

  const [avatar, setAvatar] = useState(false);
  const [addNewProfile, setAddNewProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [manageProfiles, setManageProfiles] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);

  const [selectAvatarPrompt, setSelectAvatarPrompt] = useState(false);
  const [avatarConfirmPrompt, setAvatarConfirmPrompt] = useState(false);
  const [deleteProfilePrompt, setDeleteProfilePrompt] = useState(false);

  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  /**
   * Run when the page loads or refreshes
   */
  useEffect(() => {
    checkSessionStorage();
  }, []);

  /**
   * Check to see if a profile exists in session storage
   */
  const checkSessionStorage = () => {
    const getSessionItem = window.sessionStorage.getItem("activeProfile");
    const activeProfileSession = JSON.parse(getSessionItem);
    // If session exists, save the selected profile to state
    if (activeProfileSession) {
      setActiveProfile(activeProfileSession);
    }
  };

  /**
   * Set a new avatar in the form context
   * @param {String} avatar
   */
  const updateAvatar = async (avatar) => {
    setFormDataContext({ avatar });
  };

  /**
   * Return to who's watching screen
   */
  const closeSelectAvatarPrompt = () => {
    setSelectAvatarPrompt(false);
    setAddNewProfile(false);
    setEditProfile(false);
    setManageProfiles(false);
    setDeleteProfilePrompt(false);
  };

  /**
   * Return the avatar values to initial state
   */
  const resetAvatarSelection = () => {
    setCurrentAvatar(null);
    setPreviousAvatar(null);
  };

  /**
   * Return to Add Profile screen
   */
  const closeAvatarConfirmPrompt = () => {
    setSelectAvatarPrompt(false);
    setAvatarConfirmPrompt(false);
  };

  /**
   *
   * @param {Object} props
   */
  const createProfile = async (props) => {
    const { name, avatar, kid, autoPlayNextEpisode, autoPlayPreviews } = props;
    const body = {
      name,
      avatar,
      kid,
      autoPlayNextEpisode,
      autoPlayPreviews,
    };
    setLoading(true);

    try {
      // Define the Strapi api url
      const createProfileURL = `${NEXT_URL}/api/strapi/profiles/createProfile`;

      // Create a customer in Strapi
      const createProfileResponse = await axios.post(createProfileURL, body);

      // Strapi JSON response
      const userProfileData = await createProfileResponse.data;

      // If successful, update the `user` state and redirect to the next step
      if (createProfileResponse.status === 200) {
        setLoading(false);
        setUserProfile(userProfileData.profile);
        setFormDataContext(userProfileData.profile);
        // Updates the Who's Watching screen to show the newly added profile
        mutate("/api/strapi/profiles/getProfiles");
        // Close Add New Profile prompt and return to the Who's Watching screen
        setAddNewProfile(false);
        // Reset all form input state
        resetFormState();
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   *
   * @param {Object} props
   */
  const updateProfile = async (props, profileID, config) => {
    const { name, avatar, kid, autoPlayNextEpisode, autoPlayPreviews } = props;
    const body = {
      profileID,
      config,
      name,
      avatar,
      kid,
      autoPlayNextEpisode,
      autoPlayPreviews,
    };
    setLoading(true);

    try {
      // Define the Strapi api url
      const editProfileURL = `${NEXT_URL}/api/strapi/profiles/editProfile`;

      // Edit a customer in Strapi
      const editProfileResponse = await axios.put(editProfileURL, body);

      // Strapi JSON response
      const userProfileData = await editProfileResponse.data;

      // If successful, update the `user` state and redirect to the next step
      if (editProfileResponse.status === 200) {
        setLoading(false);
        setUserProfile(userProfileData.profile);
        setFormDataContext(userProfileData.profile);
        // Updates the Who's Watching screen to show the newly added profile
        mutate("/api/strapi/profiles/getProfiles");
        // Close Add New Profile prompt and return to the Who's Watching screen
        setManageProfiles(false);
        setEditProfile(false);
        // Reset all form input state
        resetFormState();
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a profile
   * @param {Object} props
   */
  const deleteProfile = async ({ profileID }) => {
    const bodyParams = {
      data: {
        profileID,
      },
    };
    setLoading(true);

    try {
      // Define the Strapi api url
      const deleteProfileURL = `${NEXT_URL}/api/strapi/profiles/deleteProfile`;

      // Delete a customer in Strapi
      const deleteProfileResponse = await axios.delete(
        deleteProfileURL,
        bodyParams
      );

      // Strapi JSON response
      await deleteProfileResponse.data;

      // If successful, update the `user` state and redirect to the next step
      if (deleteProfileResponse.status === 200) {
        setLoading(false);
        // Updates the Who's Watching screen to and reflect the updated profiles data
        mutate("/api/strapi/profiles/getProfiles");
        // Close Delete Profile prompt and return to the Who's Watching screen
        setDeleteProfilePrompt(false);
        setManageProfiles(false);
        setEditProfile(false);
        // Reset all form input state
        resetFormState();
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   *
   * @param {Object} user
   * @param {String} id
   * @returns
   */
  const getUpdatedProfile = ({ attributes }) => {
    setDefaultAvatar(attributes.avatar);
    setFormDataContext({
      name: attributes.name,
      avatar: attributes.avatar,
      kid: attributes.kid,
      autoPlayNextEpisode: attributes.autoPlayNextEpisode,
      autoPlayPreviews: attributes.autoPlayPreviews,
    });
  };

  /**
   * Toggle the Manage Profiles state
   */
  const manageProfilesHandler = () => {
    setActiveProfile(null);
    window.sessionStorage.removeItem("activeProfile");
    manageProfiles ? setManageProfiles(false) : setManageProfiles(true);
  };

  /**
   * Set profile as active
   */
  const makeProfileActive = (newActiveProfile) => {
    const activeProfileSession = JSON.stringify(newActiveProfile);
    console.log("activeProfileSession: ", activeProfileSession);
    // Save active profile ID as cookie
    Cookies.remove("activeProfile");
    Cookies.set("activeProfile", newActiveProfile.id);
    // Save the selected profile to session storage
    window.sessionStorage.removeItem("activeProfile");
    window.sessionStorage.setItem("activeProfile", activeProfileSession);
    // Save the selected profile to state
    setActiveProfile(null);
    setActiveProfile(newActiveProfile);
    // Save the selected profile to context
    setFormDataContext({
      name: newActiveProfile.attributes.name,
      avatar: newActiveProfile.attributes.avatar,
      kid: newActiveProfile.attributes.kid,
      autoPlayNextEpisode: newActiveProfile.attributes.autoPlayNextEpisode,
      autoPlayPreviews: newActiveProfile.attributes.autoPlayPreviews,
    });
    // Re-fetch current profile data
    mutate("/api/strapi/users/me");
    mutate("/api/strapi/profiles/myProfile");
  };

  /**
   * Reset all form data to it's initial state
   */
  const resetFormState = () => {
    setDefaultAvatar("yellow");
    setCurrentAvatar(null);
    setPreviousAvatar(null);
    setError(null);
    setName("");
    setKid(null);
    setAutoPlayNextEpisode(null);
    setAutoPlayPreviews(null);
    setProfileNames(null);
    setFormDataContext({
      name: "",
      avatar: defaultAvatar,
      kid: false,
      autoPlayNextEpisode: true,
      autoPlayPreviews: true,
    });
  };

  /**
   * Media Mutations
   * Add media item to "My List" and mutate/revalidate the data
   * @param {Object}
   */
  const addMediaToListMutations = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      /**
       * Mutate the page media data when user adds a title to their list.
       */
      await mutateSliderData(({ data: mediaCache }) => {
        const { media_list_id } = mediaData;
        const profileMediaList =
          mediaCache?.profileMediaList !== null
            ? [
                { ...mediaData, media_list_id, in_media_list: true },
                ...mediaCache?.profileMediaList,
              ]
            : [{ ...mediaData, media_list_id, in_media_list: true }];

        return {
          data: {
            ...mediaCache,
            profileMediaList,
            billboard: mediaData?.is_billboard
              ? {
                  data: {
                    ...mediaData,
                    media_list_id,
                    in_media_list: true,
                  },
                }
              : {
                  data: {
                    ...mediaCache.billboard.data,
                  },
                },
            sliders: mediaCache?.sliders?.map((slider) => {
              return slider.name === "My List"
                ? {
                    ...slider,
                    data: profileMediaList,
                  }
                : {
                    ...slider,
                    data: slider.data.map((item) => {
                      if (item.id === mediaData.id) {
                        return {
                          ...item,
                          media_list_id,
                          in_media_list: true,
                        };
                      } else {
                        return item;
                      }
                    }),
                  };
            }),
          },
        };
      }, options);
      /**
       * Mutate preview modal data
       */
      await mutateModalData(({ data: modal }) => {
        const { media_list_id } = mediaData;
        return {
          data: {
            ...modal,
            media_list_id,
            in_media_list: true,
          },
        };
      }, options);
    } catch (e) {
      console.log("Data mutation errors occured: ", e);
    }
  };

  /**
   * Remove media item from "My List" and mutate/revalidate the data
   * @param {Object}
   */
  const removeMediaFromListMutations = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateSliderData(({ data: mediaCache }) => {
        const profileMediaList =
          mediaCache?.profileMediaList !== null
            ? mediaCache?.profileMediaList.filter(
                (item) => item.id !== mediaData.id
              )
            : [];
        return {
          data: {
            ...mediaCache,
            profileMediaList,
            billboard: mediaData?.is_billboard
              ? {
                  data: {
                    ...mediaData,
                    media_list_id: null,
                    in_media_list: false,
                  },
                }
              : {
                  data: {
                    ...mediaCache.billboard.data,
                  },
                },
            sliders: mediaCache?.sliders?.map((slider) => {
              return slider.name === "My List"
                ? {
                    ...slider,
                    data: profileMediaList,
                  }
                : {
                    ...slider,
                    data: slider.data.map((item) => {
                      if (item.id === mediaData.id) {
                        return {
                          ...item,
                          media_list_id: null,
                          in_media_list: false,
                        };
                      } else {
                        return item;
                      }
                    }),
                  };
            }),
          },
        };
      }, options);
      /**
       * Mutate preview modal data
       */
      await mutateModalData(({ data: modal }) => {
        const { media_list_id } = mediaData;
        return {
          data: {
            ...modal,
            media_list_id: null,
            in_media_list: false,
          },
        };
      }, options);
    } catch (e) {
      console.log("Data mutation errors occured: ", e);
    }
  };

  /**
   * Like / rate media item and mutate/revalidate the data
   * @param {Object}
   */
  const mutateAddToLikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateSliderData(({ data: mediaCache }) => {
        console.log("mediaCache: ", mediaCache);
        const { liked_media_id } = mediaData;
        const profileLikedMedia =
          mediaCache?.profileLikedMedia !== null
            ? [
                { ...mediaData, liked_media_id, is_liked: true },
                ...mediaCache?.profileLikedMedia,
              ]
            : [{ ...mediaData, liked_media_id, is_liked: true }];
        return {
          data: {
            ...mediaCache,
            profileLikedMedia,
            billboard: mediaData?.is_billboard
              ? {
                  data: {
                    ...mediaData,
                    liked_media_id,
                    is_liked: true,
                    is_disliked: false,
                  },
                }
              : {
                  data: {
                    ...mediaCache.billboard.data,
                  },
                },
            sliders: mediaCache?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaData.id) {
                    return {
                      ...item,
                      liked_media_id,
                      is_liked: true,
                      is_disliked: false,
                    };
                  } else {
                    return item;
                  }
                }),
              };
            }),
          },
        };
      }, options);

      /**
       * Mutate preview modal data
       */
      await mutateModalData(({ data: modalMediaCache }) => {
        const { liked_media_id } = mediaData;
        return {
          data: {
            ...modalMediaCache,
            liked_media_id,
            is_liked: true,
            is_disliked: false,
          },
        };
      }, options);
    } catch (e) {
      console.log("Data mutation errors occured: ", e);
    }
  };

  /**
   * Like or rate a media title
   * Mutate the media data
   * @param {Object}
   */
  const mutateRemoveFromLikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateSliderData(({ data: mediaCache }) => {
        const profileLikedMedia =
          mediaCache?.profileLikedMedia !== null
            ? mediaCache?.profileLikedMedia.filter(
                (item) => item.id !== mediaData.id
              )
            : [];
        return {
          data: {
            ...mediaCache,
            profileLikedMedia,
            billboard: mediaData?.is_billboard
              ? {
                  data: {
                    ...mediaData,
                    liked_media_id: null,
                    is_liked: false,
                  },
                }
              : {
                  data: {
                    ...mediaCache.billboard.data,
                  },
                },
            sliders: mediaCache?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaData.id) {
                    return {
                      ...item,
                      liked_media_id: null,
                      is_liked: false,
                    };
                  } else {
                    return item;
                  }
                }),
              };
            }),
          },
        };
      }, options);
      /**
       * Mutate preview modal data
       */
      await mutateModalData(({ data: modalMediaCache }) => {
        const { liked_media_id } = mediaData;
        return {
          data: {
            ...modalMediaCache,
            liked_media_id,
            is_liked: false,
          },
        };
      }, options);
    } catch (e) {
      console.log("Data mutation errors occured: ", e);
    }
  };

  /**
   * Dislike / unrate media item and mutate/revalidate the data
   * @param {Object}
   */
  const mutateAddToDislikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateSliderData(({ data: mediaCache }) => {
        console.log("mediaCache: ", mediaCache);
        const { disliked_media_id } = mediaData;
        const profileDislikedMedia =
          mediaCache?.profileDislikedMedia !== null
            ? [
                { ...mediaData, disliked_media_id, is_disliked: true },
                ...mediaCache?.profileDislikedMedia,
              ]
            : [{ ...mediaData, disliked_media_id, is_disliked: true }];
        return {
          data: {
            ...mediaCache,
            profileDislikedMedia,
            billboard: mediaData?.is_billboard
              ? {
                  data: {
                    ...mediaData,
                    disliked_media_id,
                    is_disliked: true,
                    is_liked: false,
                  },
                }
              : {
                  data: {
                    ...mediaCache.billboard.data,
                  },
                },
            sliders: mediaCache?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaData.id) {
                    return {
                      ...item,
                      disliked_media_id,
                      is_disliked: true,
                      is_liked: false,
                    };
                  } else {
                    return item;
                  }
                }),
              };
            }),
          },
        };
      }, options);

      /**
       * Mutate preview modal data
       */
      await mutateModalData(({ data: modalMediaCache }) => {
        const { disliked_media_id } = mediaData;
        return {
          data: {
            ...modalMediaCache,
            disliked_media_id,
            is_liked: false,
            is_disliked: true,
          },
        };
      }, options);
    } catch (e) {
      console.log("Data mutation errors occured: ", e);
    }
  };

  /**
   * Unlike or unrate a media title
   * Mutate the media data
   * @param {Object}
   */
  const mutateRemoveFromDislikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateSliderData(({ data: mediaCache }) => {
        const profileDislikedMedia =
          mediaCache?.profileDislikedMedia !== null
            ? mediaCache?.profileDislikedMedia.filter(
                (item) => item.id !== mediaData.id
              )
            : [];
        return {
          data: {
            ...mediaCache,
            profileDislikedMedia,
            billboard: mediaData?.is_billboard
              ? {
                  data: {
                    ...mediaData,
                    disliked_media_id: null,
                    is_disliked: false,
                  },
                }
              : {
                  data: {
                    ...mediaCache.billboard.data,
                  },
                },
            sliders: mediaCache?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaData.id) {
                    return {
                      ...item,
                      disliked_media_id: null,
                      is_disliked: false,
                    };
                  } else {
                    return item;
                  }
                }),
              };
            }),
          },
        };
      }, options);
      /**
       * Mutate preview modal data
       */
      await mutateModalData(({ data: modalMediaCache }) => {
        const { liked_media_id } = mediaData;
        return {
          data: {
            ...modalMediaCache,
            liked_media_id,
            is_liked: false,
          },
        };
      }, options);
    } catch (e) {
      console.log("Data mutation errors occured: ", e);
    }
  };

  /**
   * Get a user profile's media list / queue
   * @returns {JSX.Element}
   */
  const getMediaList = async () => {
    setLoading(true);
    try {
      const getMediaListURL = `${NEXT_URL}/api/strapi/media/getMediaList`;
      const { data } = await axios.get(getMediaListURL);
      const mediaListItem = await data.mediaList.data.data;
      if (mediaListItem) {
        setLoading(false);
        console.log("data:", mediaListItem);
        return mediaListItem;
      }
      return;
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a media item to "My List"
   * @param {Object}
   */
  const addMediaToList = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { id, mediaType, reference } = mediaData;
    const bodyParams = {
      profileID: activeProfile.id,
      mediaID: id,
      mediaType,
      mediaItem: {
        ...reference,
      },
    };
    setLoading(true);
    try {
      const addMediaToListURL = `${NEXT_URL}/api/strapi/media/addToMediaList`;
      const [newMediaListItem] = await Promise.all([
        axios.post(addMediaToListURL, bodyParams),
      ]);
      const newMediaListItemData = await newMediaListItem.data;
      // Mutate media data
      addMediaToListMutations({
        mediaData: {
          ...mediaData,
          ...mediaData?.reference,
          media_list_id: newMediaListItemData.id,
        },
        mutateModalData,
        mutateSliderData,
      });
      if (newMediaListItem.status === 200) {
        setLoading(false);
        const profileMediaList =
          mediaData?.profileMediaList !== null
            ? [
                {
                  ...newMediaListItemData.attributes.mediaItem,
                  media_list_id: newMediaListItemData.id,
                  in_media_list: true,
                },
                ...mediaData?.profileMediaList,
              ]
            : [
                {
                  ...newMediaListItemData.attributes.mediaItem,
                  media_list_id: newMediaListItemData.id,
                  in_media_list: true,
                },
              ];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    media_list_id: newMediaListItemData.id,
                    in_media_list: true,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileMediaList,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileMediaList,
                    }
                  : { ...slider };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a media item from "My List"
   * @param {Object}
   */
  const removeMediaFromList = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { mediaListId, reference } = mediaData;
    const bodyParams = {
      data: {
        strapiID: mediaListId,
      },
    };
    setLoading(true);
    try {
      const removeMediaFromListURL = `${NEXT_URL}/api/strapi/media/removeFromMediaList`;
      const [removedMediaListItem] = await Promise.all([
        axios.delete(removeMediaFromListURL, bodyParams),
      ]);
      const removedMediaListItemData = await removedMediaListItem.data;
      // Mutate media data
      removeMediaFromListMutations({
        mediaData: {
          ...mediaData,
          ...mediaData?.reference,
          media_list_id: removedMediaListItemData.id,
        },
        mutateModalData,
        mutateSliderData,
      });
      if (removedMediaListItem.status === 200) {
        setLoading(false);
        const profileMediaList =
          mediaData?.profileMediaList !== null
            ? mediaData?.profileMediaList.filter(
                (item) =>
                  item.id !== removedMediaListItemData.attributes.mediaItem.id
              )
            : [];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    media_list_id: null,
                    in_media_list: false,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileMediaList,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileMediaList,
                    }
                  : {
                      ...slider,
                    };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Like / rate a media item
   * @param {Object}
   */
  const addToLikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { id, mediaType, reference } = mediaData;
    const isDisliked = mediaData?.isDisliked;
    const isLiked = mediaData?.isLiked;
    // Params to sent to Strapi
    const bodyParams = {
      profileID: activeProfile.id,
      mediaID: id,
      mediaType,
      mediaItem: {
        ...reference,
      },
    };
    setLoading(true);
    try {
      if (isDisliked) {
        await removeFromDislikedMedia({
          mediaData,
          mutateModalData,
          mutateSliderData,
        });
      }
      const addToLikedMediaURL = `${NEXT_URL}/api/strapi/media/addToLikedMedia`;
      const [newLikedMediaItem] = await Promise.all([
        axios.post(addToLikedMediaURL, bodyParams),
      ]);
      const newLikedMediaItemData = await newLikedMediaItem.data;
      // Mutate media data
      mutateAddToLikedMedia({
        mediaData: {
          ...mediaData,
          ...mediaData?.reference,
          liked_media_id: newLikedMediaItemData.id,
        },
        mutateModalData,
        mutateSliderData,
      });
      if (newLikedMediaItem.status === 200) {
        setLoading(false);
        const profileLikedMedia =
          mediaData?.profileLikedMedia !== null
            ? [
                {
                  ...newLikedMediaItemData.attributes.mediaItem,
                  liked_media_id: newLikedMediaItemData.id,
                  is_liked: true,
                },
                ...mediaData?.profileLikedMedia,
              ]
            : [
                {
                  ...newLikedMediaItemData.attributes.mediaItem,
                  liked_media_id: newLikedMediaItemData.id,
                  is_liked: true,
                },
              ];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    liked_media_id: newLikedMediaItemData.id,
                    is_liked: true,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileLikedMedia,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileLikedMedia,
                    }
                  : { ...slider };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unlike / unrate a media title
   * @param {Object}
   */
  const removeFromLikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { likedMediaId, reference } = mediaData;
    const bodyParams = {
      data: {
        strapiID: likedMediaId,
      },
    };
    setLoading(true);
    try {
      const removeFromLikedMediaURL = `${NEXT_URL}/api/strapi/media/removeFromLikedMedia`;
      const [removedLikedMediaItem] = await Promise.all([
        axios.delete(removeFromLikedMediaURL, bodyParams),
      ]);
      const removedLikedMediaItemData = await removedLikedMediaItem.data;
      // Mutate media data
      mutateRemoveFromLikedMedia({
        mediaData: {
          ...mediaData,
          ...mediaData?.reference,
          liked_media_id: removedLikedMediaItemData.id,
        },
        mutateModalData,
        mutateSliderData,
      });
      if (removedLikedMediaItem.status === 200) {
        setLoading(false);
        const profileLikedMedia =
          mediaData?.profileLikedMedia !== null
            ? mediaData?.profileLikedMedia.filter(
                (liked) =>
                  liked.id !== removedLikedMediaItemData.attributes.mediaItem.id
              )
            : [];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    liked_media_id: null,
                    is_liked: false,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileLikedMedia,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileLikedMedia,
                    }
                  : { ...slider };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dislike / unrate a media title
   * Mutate the media data
   * @param {Object}
   */
  const addToDislikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { id, mediaType, reference } = mediaData;
    const isDisliked = mediaData?.isDisliked;
    const isLiked = mediaData?.isLiked;
    // Params to sent to Strapi
    const bodyParams = {
      profileID: activeProfile.id,
      mediaID: id,
      mediaType,
      mediaItem: {
        ...reference,
      },
    };
    setLoading(true);
    try {
      if (isLiked) {
        await removeFromLikedMedia({
          mediaData,
          mutateModalData,
          mutateSliderData,
        });
      }
      const addToDislikedMediaURL = `${NEXT_URL}/api/strapi/media/addToDislikedMedia`;
      const [newDislikedMediaItem] = await Promise.all([
        axios.post(addToDislikedMediaURL, bodyParams),
      ]);
      const newDislikedMediaItemData = await newDislikedMediaItem.data;
      // Mutate media data
      mutateAddToDislikedMedia({
        mediaData: {
          ...mediaData,
          ...mediaData?.reference,
          disliked_media_id: newDislikedMediaItemData.id,
        },
        mutateModalData,
        mutateSliderData,
      });
      if (newDislikedMediaItem.status === 200) {
        setLoading(false);
        const profileDislikedMedia =
          mediaData?.profileDislikedMedia !== null
            ? [
                {
                  ...newDislikedMediaItemData.attributes.mediaItem,
                  disliked_media_id: newDislikedMediaItemData.id,
                  is_disliked: true,
                },
                ...mediaData?.profileDislikedMedia,
              ]
            : [
                {
                  ...newDislikedMediaItemData.attributes.mediaItem,
                  disliked_media_id: newDislikedMediaItemData.id,
                  is_disliked: true,
                },
              ];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    disliked_media_id: newDislikedMediaItemData.id,
                    is_disliked: true,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileDislikedMedia,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileDislikedMedia,
                    }
                  : { ...slider };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unlike / unrate a media title
   * @param {Object}
   */
  const removeFromDislikedMedia = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { dislikedMediaId, reference } = mediaData;
    const bodyParams = {
      data: {
        strapiID: dislikedMediaId,
      },
    };
    setLoading(true);
    try {
      const removeFromDislikedMediaURL = `${NEXT_URL}/api/strapi/media/removeFromDislikedMedia`;
      const [removedDislikedMediaItem] = await Promise.all([
        axios.delete(removeFromDislikedMediaURL, bodyParams),
      ]);
      const removedDislikedMediaItemData = await removedDislikedMediaItem.data;
      // Mutate media data
      mutateRemoveFromDislikedMedia({
        mediaData: {
          ...mediaData,
          ...mediaData?.reference,
          disliked_media_id: removedDislikedMediaItemData.id,
        },
        mutateModalData,
        mutateSliderData,
      });
      if (removedDislikedMediaItem.status === 200) {
        setLoading(false);
        const profileLikedMedia =
          mediaData?.profileDislikedMedia !== null
            ? mediaData?.profileDislikedMedia.filter(
                (disliked) =>
                  disliked.id !==
                  removedDislikedMediaItemData.attributes.mediaItem.id
              )
            : [];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    disliked_media_id: null,
                    is_disliked: false,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileLikedMedia,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileDislikedMedia,
                    }
                  : { ...slider };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // OLD

  /**
   * Dislike / rate a media item
   * @param {Object}
   */
  const addToDislikedMediaOLD = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { id, mediaType, reference } = mediaData;
    const bodyParams = {
      profileID: activeProfile.id,
      mediaID: id,
      mediaType,
      mediaItem: {
        ...reference,
      },
    };
    setLoading(true);
    try {
      const addToDislikedMediaURL = `${NEXT_URL}/api/strapi/media/addToDislikedMedia`;
      const [newDislikedMediaItem] = await Promise.all([
        axios.post(addToDislikedMediaURL, bodyParams),
      ]);
      const newDislikedMediaItemData = await newDislikedMediaItem.data;
      if (newDislikedMediaItem.status === 200) {
        setLoading(false);
        const profileDislikedMedia =
          mediaData?.profileDislikedMedia !== null
            ? [
                {
                  ...newDislikedMediaItemData.attributes.mediaItem,
                  disliked_media_id: newDislikedMediaItemData.id,
                  is_disliked: true,
                },
                ...mediaData?.profileDislikedMedia,
              ]
            : [
                {
                  ...newDislikedMediaItemData.attributes.mediaItem,
                  disliked_media_id: newDislikedMediaItemData.id,
                  is_disliked: true,
                },
              ];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    disliked_media_id: newDislikedMediaItemData.id,
                    is_disliked: true,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileDislikedMedia,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileDislikedMedia,
                    }
                  : { ...slider };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Unrate a disliked media title
   * @param {Object}
   */
  const removeFromDislikedMediaOLD = async ({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }) => {
    const { dislikedMediaId, reference } = previewModalState;
    const bodyParams = {
      data: {
        strapiID: dislikedMediaId,
      },
    };
    setLoading(true);
    try {
      const removeFromDislikedMediaURL = `${NEXT_URL}/api/strapi/media/removeFromDislikedMedia`;
      const [removedDislikedMediaItem] = await Promise.all([
        axios.delete(removeFromDislikedMediaURL, bodyParams),
      ]);
      const removedDislikedMediaItemData = await removedDislikedMediaItem.data;
      if (removedDislikedMediaItem.status === 200) {
        setLoading(false);
        const profileDislikedMedia =
          mediaData?.profileDislikedMedia !== null
            ? mediaData?.profileDislikedMedia.filter(
                (disliked) =>
                  disliked.id !==
                  removedDislikedMediaItemData.attributes.mediaItem.id
              )
            : [];
        return {
          data: {
            ...mediaData,
            billboard: reference?.is_billboard
              ? {
                  data: {
                    ...reference,
                    disliked_media_id: null,
                    is_disliked: false,
                  },
                }
              : {
                  data: {
                    ...mediaData.billboard.data,
                  },
                },
            profileDislikedMedia,
            sliders: [
              ...mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileDislikedMedia,
                    }
                  : { ...slider };
              }),
            ],
          },
        };
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        loading,
        error,
        error,
        setError,
        profileNames,
        setProfileNames,
        userProfile,
        setUserProfile,
        profileID,
        setProfileID,
        name,
        setName,
        kid,
        setKid,
        autoPlayNextEpisode,
        setAutoPlayNextEpisode,
        autoPlayPreviews,
        setAutoPlayPreviews,
        defaultAvatar,
        setDefaultAvatar,
        currentAvatar,
        setCurrentAvatar,
        previousAvatar,
        setPreviousAvatar,
        formDataContext,
        setFormDataContext,
        avatar,
        setAvatar,
        selectAvatarPrompt,
        setSelectAvatarPrompt,
        avatarConfirmPrompt,
        setAvatarConfirmPrompt,
        deleteProfilePrompt,
        setDeleteProfilePrompt,
        addNewProfile,
        setAddNewProfile,
        editProfile,
        setEditProfile,
        manageProfiles,
        setManageProfiles,
        manageProfilesHandler,
        updateAvatar,
        createProfile,
        getUpdatedProfile,
        updateProfile,
        deleteProfile,
        resetAvatarSelection,
        closeAvatarConfirmPrompt,
        closeSelectAvatarPrompt,
        makeProfileActive,
        activeProfile,
        setActiveProfile,
        resetFormState,
        addMediaToList,
        removeMediaFromList,
        addToLikedMedia,
        removeFromLikedMedia,
        addToDislikedMedia,
        removeFromDislikedMedia,
        mutateAddToLikedMedia,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
