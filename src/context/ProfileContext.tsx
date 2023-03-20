import { Transition } from "@headlessui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, Fragment, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiLightningBolt } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";
import { useSWRConfig } from "swr";

import { NEXT_URL } from "@/config/index";
import { handleResults } from "@/pages/api/tmdb/utils";

const ProfileContext = createContext({});

interface IProfile {
  id: string | null;
  attributes: {
    name: string | null;
    avatar: string;
    kid: boolean;
    autoPlayNextEpisode: boolean;
    autoPlayPreviews: boolean;
  };
}

type ProfileProviderProps = {
  children: ReactNode;
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  // Avatar selection state
  const [defaultAvatar, setDefaultAvatar] = useState<string>("yellow"); // Default yellow smiley
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null); // Most recently clicked before final selection
  const [previousAvatar, setPreviousAvatar] = useState<string | null>(null); // Previously selected before final selection

  const [name, setName] = useState<string>("");
  const [kid, setKid] = useState<boolean | null>(null);
  const [autoPlayNextEpisode, setAutoPlayNextEpisode] = useState<
    boolean | null
  >(null);
  const [autoPlayPreviews, setAutoPlayPreviews] = useState<boolean | null>(
    null
  );
  const [profileNames, setProfileNames] = useState<[] | null>([]);
  const [profileID, setProfileID] = useState<string | null>(null);

  const [formDataContext, setFormDataContext] = useState<{
    name: string;
    avatar: string;
    kid: boolean | null;
    autoPlayNextEpisode: boolean | null;
    autoPlayPreviews: boolean | null;
  }>({
    name: name || "",
    avatar: currentAvatar || defaultAvatar,
    kid: kid || false,
    autoPlayNextEpisode: autoPlayNextEpisode || true,
    autoPlayPreviews: autoPlayPreviews || true,
  });

  const [avatar, setAvatar] = useState<boolean>(false);
  const [addNewProfile, setAddNewProfile] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [manageProfiles, setManageProfiles] = useState<boolean>(false);
  const [activeProfile, setActiveProfile] = useState<{
    id: string;
    attributes: {
      name: string;
      avatar: string;
      kid: boolean;
      autoPlayNextEpisode: boolean;
      autoPlayPreviews: boolean;
    };
  } | null>(null);

  const [selectAvatarPrompt, setSelectAvatarPrompt] = useState<boolean>(false);
  const [avatarConfirmPrompt, setAvatarConfirmPrompt] =
    useState<boolean>(false);
  const [deleteProfilePrompt, setDeleteProfilePrompt] =
    useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [error, setError] = useState<object | null>(null);

  // Refactored
  const [profile, setProfile] = useState<IProfile>({
    id: null,
    attributes: {
      name: null,
      avatar: "yellow",
      kid: false,
      autoPlayNextEpisode: true,
      autoPlayPreviews: true,
    },
  });

  /**
   * Run when the page loads or refreshes
   */
  useEffect(() => {
    checkSessionStorage();
  }, []);

  function notify() {
    toast.custom(
      (t) => (
        <Transition
          show={t.visible}
          as={Fragment}
          enter="enter"
          enterFrom="enterFrom"
          enterTo="enterTo"
          leave="leave"
          leaveFrom="leaveFrom"
          leaveTo="leaveTo"
        >
          <div className="notificationWrapper">
            <div className="iconWrapper">
              <HiLightningBolt />
            </div>
            <div className="contentWrapper">
              <h1>Success!</h1>
              <p>You've successfully added a new title to your watchlist.</p>
            </div>
            <div className="closeIcon" onClick={() => toast.dismiss(t.id)}>
              <MdOutlineClose />
            </div>
          </div>
        </Transition>
      ),
      { id: "unique-notification", position: "bottom-right" }
    );
  }

  /**
   * Check to see if a profile exists in session storage
   */
  function checkSessionStorage() {
    const getSessionItem = window.sessionStorage.getItem("activeProfile");
    const activeProfileSession = getSessionItem
      ? JSON.parse(getSessionItem)
      : "";
    // If session exists, save the selected profile to state
    if (activeProfileSession) {
      setActiveProfile(activeProfileSession);
    }
  }

  /**
   * Set a new avatar in the form context
   */
  async function updateAvatar(avatar: string) {
    setFormDataContext((prev) => ({ ...prev, avatar }));
  }

  /**
   * Return to who's watching screen
   */
  function closeSelectAvatarPrompt() {
    setSelectAvatarPrompt(false);
    setAddNewProfile(false);
    setEditProfile(false);
    setManageProfiles(false);
    setDeleteProfilePrompt(false);
  }

  /**
   * Return the avatar values to initial state
   */
  function resetAvatarSelection() {
    setCurrentAvatar(null);
    setPreviousAvatar(null);
  }

  /**
   * Return to Add Profile screen
   */
  function closeAvatarConfirmPrompt() {
    setSelectAvatarPrompt(false);
    setAvatarConfirmPrompt(false);
  }

  async function createProfile({
    name,
    avatar,
    kid,
    autoPlayNextEpisode,
    autoPlayPreviews,
  }: {
    name: string;
    avatar: string;
    kid: boolean;
    autoPlayNextEpisode: boolean;
    autoPlayPreviews: boolean;
  }) {
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
    } catch (error: any) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  }

  async function updateProfile(
    props: {
      name: string;
      avatar: string;
      kid: boolean;
      autoPlayNextEpisode: boolean;
      autoPlayPreviews: boolean;
    },
    profileID: string,
    config: object
  ) {
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
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Delete a profile
   */
  async function deleteProfile({ profileID }: { profileID: string }) {
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
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  function getUpdatedProfile({
    attributes: { avatar, name, kid, autoPlayNextEpisode, autoPlayPreviews },
  }: {
    attributes: {
      avatar: string;
      name: string;
      kid: boolean;
      autoPlayNextEpisode: boolean;
      autoPlayPreviews: boolean;
    };
  }) {
    setDefaultAvatar(avatar);
    setFormDataContext({
      name,
      avatar,
      kid,
      autoPlayNextEpisode,
      autoPlayPreviews,
    });
  }

  /**
   * Toggle the Manage Profiles state
   */
  function manageProfilesHandler() {
    setActiveProfile(null);
    window.sessionStorage.removeItem("activeProfile");
    manageProfiles ? setManageProfiles(false) : setManageProfiles(true);
  }

  /**
   * Set profile as active
   */
  function makeProfileActive(newActiveProfile: {
    id: string;
    attributes: {
      avatar: string;
      name: string;
      kid: boolean;
      autoPlayNextEpisode: boolean;
      autoPlayPreviews: boolean;
    };
  }) {
    const activeProfileSession = JSON.stringify(newActiveProfile);
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
  }

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
        return {
          data: {
            ...modal,
            media_list_id: null,
            in_media_list: false,
          },
        };
      }, options);
    } catch (e) {
      throw new Error(e);
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
        const { liked_media_id } = mediaData;
        const profileLikedMedia =
          mediaCache?.profileLikedMedia !== null
            ? [
                { ...mediaData, liked_media_id, is_liked: true },
                ...(mediaCache?.profileLikedMedia || []),
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
      throw new Error(e);
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
      throw new Error(e);
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
        const { disliked_media_id } = mediaData;
        const profileDislikedMedia =
          mediaCache?.profileDislikedMedia !== null
            ? [
                { ...mediaData, disliked_media_id, is_disliked: true },
                ...(mediaCache?.profileDislikedMedia || []),
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
      throw new Error(e);
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
        const { disliked_media_id } = mediaData;
        return {
          data: {
            ...modalMediaCache,
            disliked_media_id,
            is_disliked: false,
          },
        };
      }, options);
    } catch (e) {
      throw new Error(e);
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
        return mediaListItem;
      }
      return;
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a media item to "My List"
   */
  async function addMediaToList({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }: any) {
    const { id, mediaType, reference } = mediaData;
    const bodyParams = {
      profileID: activeProfile?.id,
      mediaID: id,
      mediaType,
      mediaItem: {
        ...reference,
      },
    };
    setLoading(true);
    try {
      const addMediaToListURL = `${NEXT_URL}/api/strapi/media/addToMediaList`;
      const results = await Promise.allSettled([
        axios.post(addMediaToListURL, bodyParams),
      ]);
      const [newMediaListItem] = handleResults(results);
      const response = await newMediaListItem.data;
      mediaData = Object.assign(mediaData, mediaData?.reference, {
        media_list_id: response.id,
      });
      const newItemData = {
        media_list_id: Date.now(),
        in_media_list: true,
      };
      // Mutate the page media data when user adds a title to their list.
      mutateSliderData(
        (current: any) => {
          const profileMediaList =
            current.data?.profileMediaList !== null
              ? [
                  {
                    ...mediaData,
                    media_list_id: mediaData?.media_list_id,
                    in_media_list: true,
                  },
                  ...(current.data?.profileMediaList || []),
                ]
              : [
                  {
                    ...mediaData,
                    media_list_id: mediaData?.media_list_id,
                    in_media_list: true,
                  },
                ];
          return {
            data: {
              ...current.data,
              profileMediaList,
              billboard: mediaData?.is_billboard
                ? {
                    data: {
                      ...mediaData,
                      media_list_id: mediaData?.media_list_id,
                      in_media_list: true,
                    },
                  }
                : {
                    data: {
                      ...current.data?.billboard.data,
                    },
                  },
              sliders: current.data?.sliders?.map((slider) => {
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
                            media_list_id: mediaData?.media_list_id,
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
        },
        {
          optimisticData: (current: any) => {
            return {
              data: {
                ...current.data,
                profileMediaList: { ...mediaData, ...newItemData },
                billboard: mediaData?.is_billboard
                  ? {
                      data: newItemData,
                    }
                  : {
                      data: {
                        ...current.data?.billboard.data,
                      },
                    },
                sliders: current.data?.sliders?.map((slider) => {
                  return slider.name === "My List"
                    ? {
                        ...slider,
                        data: { ...mediaData, ...newItemData },
                      }
                    : {
                        ...slider,
                        data: slider.data.map((item) => {
                          if (item.id === mediaData.id) {
                            return {
                              ...item,
                              ...newItemData,
                            };
                          } else {
                            return item;
                          }
                        }),
                      };
                }),
              },
            };
          },
          rollbackOnError(error: any) {
            // If it's timeout abort error, don't rollback
            return error.name !== "AbortError";
          },
          populateCache: true,
          revalidate: false,
        } as any
      );
      // Mutate preview modal data
      mutateModalData(
        (modalItem: any) => {
          console.log("mutate modal: ", modalItem);
          return {
            data: {
              ...modalItem.data,
              media_list_id: mediaData?.media_list_id,
              in_media_list: true,
            },
          };
        },
        {
          optimisticData: (modalItem: any) => {
            console.log("optimistic modalItem: ", modalItem);
            return {
              data: {
                ...modalItem.data,
                ...newItemData,
              },
            };
          },
          rollbackOnError(error: any) {
            // If it's timeout abort error, don't rollback
            return error.name !== "AbortError";
          },
          populateCache: true,
          revalidate: false,
        } as any
      );
      // Update the media list in the user's profile in Strapi
      if (newMediaListItem.status === 200) {
        setLoading(false);
        const profileMediaList =
          mediaData?.profileMediaList !== null
            ? [
                {
                  ...response.attributes.mediaItem,
                  media_list_id: response.id,
                  in_media_list: true,
                },
                ...(mediaData?.profileMediaList || []),
              ]
            : [
                {
                  ...response.attributes.mediaItem,
                  media_list_id: response.id,
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
                    media_list_id: response.id,
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
              ...(mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileMediaList,
                    }
                  : { ...slider };
              }) || {}),
            ],
          },
        };
      }
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
      console.log("error");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Remove a media item from "My List"
   */
  async function removeMediaFromList({
    mediaData,
    mutateModalData,
    mutateSliderData,
  }: any) {
    const bodyParams = {
      data: {
        strapiID: mediaData?.mediaListId,
      },
    };
    setLoading(true);
    try {
      const removeMediaFromListURL = `${NEXT_URL}/api/strapi/media/removeFromMediaList`;
      const results = await Promise.allSettled([
        axios.delete(removeMediaFromListURL, bodyParams),
      ]);
      const [removedMediaListItem] = handleResults(results);
      const response = await removedMediaListItem.data;
      // Extend media data with the reference data
      mediaData = Object.assign(mediaData, mediaData?.reference, {
        media_list_id: response.id,
      });
      try {
        // Mutate slider data
        mutateSliderData(
          (current: any) => {
            const removeItem = {
              media_list_id: null,
              in_media_list: false,
            };
            const profileMediaList =
              current.data?.profileMediaList !== null
                ? current.data?.profileMediaList.filter(
                    (item: any) => item.id !== mediaData.id
                  )
                : [];
            return {
              data: {
                ...current.data,
                profileMediaList,
                billboard: mediaData?.is_billboard
                  ? {
                      data: {
                        ...mediaData,
                        ...removeItem,
                      },
                    }
                  : {
                      data: {
                        ...current.data?.billboard.data,
                      },
                    },
                sliders: current.data?.sliders?.map((slider: any) => {
                  return slider.name === "My List"
                    ? {
                        ...slider,
                        data: profileMediaList,
                      }
                    : {
                        ...slider,
                        data: slider.data.map((item: any) => {
                          if (item.id === mediaData.id) {
                            return {
                              ...item,
                              ...removeItem,
                            };
                          } else {
                            return item;
                          }
                        }),
                      };
                }),
              },
            };
          },
          {
            optimisticData: (current: any) => {
              const deleteItem = {
                media_list_id: null,
                in_media_list: false,
              };
              const profileMediaList =
                current.data?.profileMediaList !== null
                  ? current.data?.profileMediaList.filter(
                      (item: any) => item.id !== mediaData.id
                    )
                  : [];
              return {
                data: {
                  ...current.data,
                  profileMediaList,
                  billboard: mediaData?.is_billboard
                    ? {
                        data: {
                          ...mediaData,
                          ...deleteItem,
                        },
                      }
                    : {
                        data: {
                          ...current.data?.billboard.data,
                        },
                      },
                  sliders: current.data?.sliders?.map((slider: any) => {
                    return slider.name === "My List"
                      ? {
                          ...slider,
                          data: profileMediaList,
                        }
                      : {
                          ...slider,
                          data: slider.data.map((item: any) => {
                            if (item.id === mediaData.id) {
                              return {
                                ...item,
                                ...deleteItem,
                              };
                            } else {
                              return item;
                            }
                          }),
                        };
                  }),
                },
              };
            },
            rollbackOnError(error: any) {
              // If it's timeout abort error, don't rollback
              return error.name !== "AbortError";
            },
            populateCache: true,
            revalidate: false,
          }
        );
        // Mutate preview modal data
        mutateModalData(
          (current: any) => {
            return {
              data: {
                ...current.data,
                media_list_id: null,
                in_media_list: false,
              },
            };
          },
          {
            optimisticData: (current: any) => {
              return {
                data: {
                  ...current.data,
                  media_list_id: null,
                  in_media_list: false,
                },
              };
            },
            rollbackOnError(error: any) {
              // If it's timeout abort error, don't rollback
              return error.name !== "AbortError";
            },
            populateCache: true,
            revalidate: false,
          }
        );
        // Update the media list in the user's profile in Strapi
        if (removedMediaListItem.status === 200) {
          setLoading(false);
          const profileMediaList =
            mediaData?.profileMediaList !== null
              ? mediaData?.profileMediaList.filter(
                  (item) => item.id !== response.attributes.mediaItem.id
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
                ...(mediaData?.sliders?.map((slider) => {
                  return slider.name === "My List"
                    ? {
                        ...slider,
                        data: profileMediaList,
                      }
                    : {
                        ...slider,
                      };
                }) || {}),
              ],
            },
          };
        }
      } catch (e: any) {
        throw new Error(e);
      }
    } catch (error: any) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

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
                ...(mediaData?.profileLikedMedia || []),
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
              ...(mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileLikedMedia,
                    }
                  : { ...slider };
              }) || {}),
            ],
          },
        };
      }
    } catch (error: any) {
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
              ...(mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileLikedMedia,
                    }
                  : { ...slider };
              }) || {}),
            ],
          },
        };
      }
    } catch (error: any) {
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
                ...(mediaData?.profileDislikedMedia || {}),
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
              ...(mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileDislikedMedia,
                    }
                  : { ...slider };
              }) || {}),
            ],
          },
        };
      }
    } catch (error: any) {
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
        const profileDislikedMedia =
          mediaData?.profileDislikedMedia !== null
            ? mediaData?.profileDislikedMedia.filter(
                (disliked) =>
                  disliked.id !==
                  removedDislikedMediaItemData.attributes.mediaItem.id
              )
            : [];
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
              ...(mediaData?.sliders?.map((slider) => {
                return slider.name === "My List"
                  ? {
                      ...slider,
                      data: profileDislikedMedia || [],
                    }
                  : { ...slider };
              }) || {}),
            ],
          },
        };
      }
    } catch (error: any) {
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
        getMediaList,
        addMediaToList,
        removeMediaFromList,
        addToLikedMedia,
        removeFromLikedMedia,
        addToDislikedMedia,
        removeFromDislikedMedia,
        mutateAddToLikedMedia,
        // New
        profile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
