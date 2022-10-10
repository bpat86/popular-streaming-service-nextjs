import { createContext, useState, useEffect } from "react";
import axios from "axios";

const buttonActions = {
  ADD_TO_MEDIA_LIST: "ADD_TO_MEDIA_LIST",
  REMOVE_FROM_MEDIA_LIST: "REMOVE_FROM_MEDIA_LIST",
  ADD_TO_LIKED_MEDIA: "ADD_TO_LIKED_MEDIA",
  REMOVE_FROM_LIKED_MEDIA: "REMOVE_FROM_LIKED_MEDIA",
  ADD_TO_DISLIKED_MEDIA: "ADD_TO_DISLIKED_MEDIA",
  REMOVE_FROM_DISLIKED_MEDIA: "REMOVE_FROM_DISLIKED_MEDIA",
};

const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
  // State
  const [dataLoaded, setDataLoaded] = useState(false);

  const mediaLoaded = () => {
    return !!dataLoaded;
  };

  const setMediaLoaded = (status) => {
    setDataLoaded(status);
  };

  /**
   * Add media item to "My List" and mutate/revalidate the data
   * @param {Object}
   */
  const addMediaToListMutations = async ({ mediaItem }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      /**
       * Mutate the page media data when user adds a title to their list.
       */
      await mutateMedia(({ data: media }) => {
        const { media_list_id } = mediaItem;
        const profileMediaList =
          media?.profileMediaList !== null
            ? [
                { ...mediaItem, media_list_id, in_media_list: true },
                ...media?.profileMediaList,
              ]
            : [{ ...mediaItem, media_list_id, in_media_list: true }];

        return {
          data: {
            ...media,
            profileMediaList,
            billboard: mediaItem?.is_billboard
              ? {
                  data: {
                    ...mediaItem,
                    media_list_id,
                    in_media_list: true,
                  },
                }
              : {
                  data: {
                    ...media.billboard.data,
                  },
                },
            sliders: media?.sliders?.map((slider) => {
              return slider.name === "My List"
                ? {
                    ...slider,
                    data: profileMediaList,
                  }
                : {
                    ...slider,
                    data: slider.data.map((item) => {
                      if (item.id === mediaItem.id) {
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
        const { media_list_id } = mediaItem;
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
  const removeMediaFromListMutations = async ({ mediaItem }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateMedia(({ data: media }) => {
        const profileMediaList =
          media?.profileMediaList !== null
            ? media?.profileMediaList.filter((item) => item.id !== mediaItem.id)
            : [];
        return {
          data: {
            ...media,
            profileMediaList,
            billboard: mediaItem?.is_billboard
              ? {
                  data: {
                    ...mediaItem,
                    media_list_id: null,
                    in_media_list: false,
                  },
                }
              : {
                  data: {
                    ...media.billboard.data,
                  },
                },
            sliders: media?.sliders?.map((slider) => {
              return slider.name === "My List"
                ? {
                    ...slider,
                    data: profileMediaList,
                  }
                : {
                    ...slider,
                    data: slider.data.map((item) => {
                      if (item.id === mediaItem.id) {
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
        const { media_list_id } = mediaItem;
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
  const addToLikedMediaMutations = async ({ mediaItem }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      /**
       * Mutate the page media data when user likes a title.
       */
      await mutateMedia(({ data: media }) => {
        const { liked_media_id } = mediaItem;
        const profileLikedMedia =
          media?.profileLikedMedia !== null
            ? [
                { ...mediaItem, liked_media_id, is_liked: true },
                ...media?.profileLikedMedia,
              ]
            : [{ ...mediaItem, liked_media_id, is_liked: true }];

        return {
          data: {
            ...media,
            profileLikedMedia,
            billboard: mediaItem?.is_billboard
              ? {
                  data: {
                    ...mediaItem,
                    liked_media_id,
                    is_liked: true,
                    is_disliked: false,
                  },
                }
              : {
                  data: {
                    ...media.billboard.data,
                  },
                },
            sliders: media?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaItem.id) {
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
      await mutateModalData(({ data: modal }) => {
        const { liked_media_id } = mediaItem;
        return {
          data: {
            ...modal,
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
   * Unlike / unrate media item and mutate/revalidate the data
   * @param {Object}
   */
  const removeFromLikedMediaMutations = async ({ mediaItem }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateMedia(({ data: media }) => {
        const { liked_media_id } = mediaItem;
        const profileLikedMedia =
          media?.profileLikedMedia !== null
            ? media?.profileLikedMedia.filter(
                (item) => item.id !== mediaItem.id
              )
            : [];
        return {
          data: {
            ...media,
            profileLikedMedia,
            billboard: mediaItem?.is_billboard
              ? {
                  data: {
                    ...mediaItem,
                    liked_media_id: null,
                    is_liked: false,
                  },
                }
              : {
                  data: {
                    ...media.billboard.data,
                  },
                },
            sliders: media?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaItem.id) {
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
      await mutateModalData(({ data: modal }) => {
        const { liked_media_id } = mediaItem;
        return {
          data: {
            ...modal,
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
  const addToDislikedMediaMutations = async ({ mediaItem }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      /**
       * Mutate the page media data when user adds a title to their list.
       */
      await mutateMedia(({ data: media }) => {
        const { disliked_media_id } = mediaItem;
        const profileDislikedMedia =
          media?.profileDislikedMedia !== null
            ? [
                {
                  ...mediaItem,
                  disliked_media_id,
                  is_disliked: true,
                  is_liked: false,
                },
                ...media?.profileDislikedMedia,
              ]
            : [
                {
                  ...mediaItem,
                  disliked_media_id,
                  is_disliked: true,
                  is_liked: false,
                },
              ];

        return {
          data: {
            ...media,
            profileDislikedMedia,
            billboard: mediaItem?.is_billboard
              ? {
                  data: {
                    ...mediaItem,
                    disliked_media_id,
                    is_disliked: true,
                    is_liked: false,
                  },
                }
              : {
                  data: {
                    ...media.billboard.data,
                  },
                },
            sliders: media?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaItem.id) {
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
      await mutateModalData(({ data: modal }) => {
        const { disliked_media_id } = mediaItem;
        return {
          data: {
            ...modal,
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
   * Unlike / unrate media item and mutate/revalidate the data
   * @param {Object}
   */
  const removeFromDislikedMediaMutations = async ({ mediaItem }) => {
    const options = {
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    };
    try {
      await mutateMedia(({ data: media }) => {
        const { disliked_media_id } = mediaItem;
        const profileDislikedMedia =
          media?.profileDislikedMedia !== null
            ? media?.profileDislikedMedia.filter(
                (item) => item.id !== mediaItem.id
              )
            : [];
        return {
          data: {
            ...media,
            profileDislikedMedia,
            billboard: mediaItem?.is_billboard
              ? {
                  data: {
                    ...mediaItem,
                    disliked_media_id: null,
                    is_disliked: false,
                    is_liked: false,
                  },
                }
              : {
                  data: {
                    ...media.billboard.data,
                  },
                },
            sliders: media?.sliders?.map((slider) => {
              return {
                ...slider,
                data: slider.data.map((item) => {
                  if (item.id === mediaItem.id) {
                    return {
                      ...item,
                      disliked_media_id: null,
                      is_disliked: false,
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
      await mutateModalData(({ data: modal }) => {
        const { disliked_media_id } = mediaItem;
        return {
          data: {
            ...modal,
            disliked_media_id: null,
            is_disliked: false,
            is_liked: false,
          },
        };
      }, options);
    } catch (e) {
      console.log("Data mutation errors occured: ", e);
    }
  };

  /**
   *
   * @param {Object} mediaItem
   */
  const addToMediaList = (mediaItem) => {};

  /**
   *
   * @param {Object} mediaItem
   */
  const removeFromMediaList = (mediaItem) => {};

  /**
   *
   * @param {Object} mediaItem
   */
  const addToLikedMedia = async ({ media }) => {
    const mediaData = media; // media?.data
    const { data: mediaListMutation } = await addMediaToList({
      mediaData,
    });
    const mediaListItem = mediaListMutation?.profileMediaList?.find(
      (listed) => listed.id === previewModalState.id
    );
    const mutatedMediaItemData = {
      ...mediaListMutation,
      mediaItem: {
        ...mediaData?.reference,
        media_list_id: mediaListItem?.media_list_id,
      },
      mutateMedia,
    };
    addMediaToListMutations(mutatedMediaItemData);
    setPreviewModalState((prevState) => ({
      ...prevState,
      inMediaList: true,
      mediaListId: mediaListItem?.media_list_id,
    }));
  };

  /**
   *
   * @param {Object} mediaItem
   */
  const removeFromLikedMedia = async ({ media }) => {
    const mediaData = media; // media?.data
    const { data: mediaMutation } = await removeFromLikedMedia({
      mediaData,
    });
    const mutatedMediaItemData = {
      ...mediaMutation,
      mediaItem: {
        ...mediaData?.reference,
        liked_media_id: null,
      },
    };
    setMediaButtonState(buttonActions.REMOVE_FROM_LIKED_MEDIA);
    removeFromLikedMediaMutations(mutatedMediaItemData);
    // setPreviewModalState((prevState) => ({
    //   ...prevState,
    //   isLiked: false,
    //   likedMediaId: null,
    // }));
  };

  /**
   *
   * @param {Object} mediaItem
   */
  const addToDislikedMedia = (mediaItem) => {};

  /**
   *
   * @param {Object} mediaItem
   */
  const removeFromDislikedMedia = (mediaItem) => {};

  /**
   * Revalidate the media data and mutate the SWR cache
   */
  const requestAndRevalidate = async ({ action, data, mutateMedia } = {}) => {
    switch (action) {
      /**
       * Add to "My List"
       */
      case buttonActions.ADD_TO_MEDIA_LIST: {
        const mediaData = data; // media?.data
        const { data: mediaListMutation } = await addMediaToList({
          previewModalState,
          mediaData,
        });
        const mediaListItem = mediaListMutation?.profileMediaList?.find(
          (listed) => listed.id === previewModalState.id
        );
        const mutatedMediaItemData = {
          ...mediaListMutation,
          mediaItem: {
            ...mediaData?.reference,
            media_list_id: mediaListItem?.media_list_id,
          },
          mutateMedia,
        };
        setMediaButtonState(buttonActions.ADD_TO_MEDIA_LIST);
        addMediaToListMutations(mutatedMediaItemData);
        setPreviewModalState((prevState) => ({
          ...prevState,
          inMediaList: true,
          mediaListId: mediaListItem?.media_list_id,
        }));
        break;
      }
      /**
       * Remove from "My List"
       */
      case buttonActions.REMOVE_FROM_MEDIA_LIST: {
        const mediaData = data; // media?.data
        const { data: mediaListMutation } = await removeMediaFromList({
          previewModalState,
          mediaData,
        });
        const mutatedMediaListItemData = {
          ...mediaListMutation,
          mediaItem: {
            ...mediaData?.reference,
            media_list_id: null,
          },
        };
        setMediaButtonState(buttonActions.REMOVE_FROM_MEDIA_LIST);
        removeMediaFromListMutations(mutatedMediaListItemData);
        setPreviewModalState((prevState) => ({
          ...prevState,
          inMediaList: false,
          mediaListId: null,
        }));
        break;
      }
      /**
       * Add to liked media
       */
      case buttonActions.ADD_TO_LIKED_MEDIA: {
        const mediaData = data; // media?.data
        const isLiked = mediaData?.profileLikedMedia?.some(
          (liked) => liked?.id === previewModalState?.id
        );
        const isDisliked = mediaData?.profileDislikedMedia?.some(
          (disliked) => disliked?.id === previewModalState?.id
        );
        // If title is already liked
        if (isLiked) return;
        // Remove the dislike from the database + cache before liking if item already disliked
        if (isDisliked) {
          // First, remove title from dislikes,
          const mediaData = data; // media?.data
          const { data: dislikedMediaMutation } = await removeFromDislikedMedia(
            {
              previewModalState,
              mediaData,
            }
          );
          const mutatedDislikedMediaItemData = {
            ...dislikedMediaMutation,
            mediaItem: {
              ...mediaData?.reference,
              disliked_media_id: null,
            },
          };
          setMediaButtonState(buttonActions.REMOVE_FROM_DISLIKED_MEDIA);
          removeFromDislikedMediaMutations(mutatedDislikedMediaItemData);
          // Then, add title to likes
          const { data: likedMediaMutation } = await addToLikedMedia({
            previewModalState,
            mediaData,
          });
          const likedItem = likedMediaMutation?.profileLikedMedia?.find(
            (liked) => liked?.id === previewModalState?.id
          );
          const mutatedLikedMediaItemData = {
            ...likedMediaMutation,
            mediaItem: {
              ...mediaData?.reference,
              liked_media_id: likedItem?.liked_media_id,
            },
          };
          setMediaButtonState(buttonActions.ADD_TO_LIKED_MEDIA);
          addToLikedMediaMutations(mutatedLikedMediaItemData);
          // setPreviewModalState((prevState) => ({
          //   ...prevState,
          //   isLiked: true,
          //   likedMediaId: likedItem?.liked_media_id,
          //   isDisliked: false,
          //   dislikedMediaId: null,
          // }));
        } else {
          // Otherwise, add to likes like normal
          const { data: mediaMutation } = await addToLikedMedia({
            previewModalState,
            mediaData,
          });
          const likedItem = mediaMutation?.profileLikedMedia?.find(
            (liked) => liked?.id === previewModalState?.id
          );

          const mutatedMediaItemData = {
            ...mediaMutation,
            mediaItem: {
              ...mediaData?.reference,
              liked_media_id: likedItem?.liked_media_id,
            },
          };
          setMediaButtonState(buttonActions.ADD_TO_LIKED_MEDIA);
          addToLikedMediaMutations(mutatedMediaItemData);
          // setPreviewModalState((prevState) => ({
          //   ...prevState,
          //   isLiked: true,
          //   likedMediaId: likedItem?.liked_media_id,
          //   isDisliked: false,
          //   dislikedMediaId: null,
          // }));
        }
        break;
      }
      /**
       * Remove from liked media
       */
      case buttonActions.REMOVE_FROM_LIKED_MEDIA: {
        const mediaData = data; // media?.data
        const { data: mediaMutation } = await removeFromLikedMedia({
          previewModalState,
          mediaData,
        });
        const mutatedMediaItemData = {
          ...mediaMutation,
          mediaItem: {
            ...mediaData?.reference,
            liked_media_id: null,
          },
        };
        setMediaButtonState(buttonActions.REMOVE_FROM_LIKED_MEDIA);
        removeFromLikedMediaMutations(mutatedMediaItemData);
        // setPreviewModalState((prevState) => ({
        //   ...prevState,
        //   isLiked: false,
        //   likedMediaId: null,
        // }));
        break;
      }
      /**
       * Add to disliked media
       */
      case buttonActions.ADD_TO_DISLIKED_MEDIA: {
        const mediaData = data; // media?.data
        const isDisliked = mediaData?.profileDislikedMedia?.some(
          (disliked) => disliked?.id === previewModalState?.id
        );
        const isLiked = mediaData?.profileLikedMedia?.some(
          (liked) => liked?.id === previewModalState?.id
        );
        // If title is already disliked
        if (isDisliked) return;
        // Remove the like from the database + cache before disliking if item already liked
        if (isLiked) {
          // First, remove title from likes,
          const mediaData = data; // media?.data
          const { data: likedMediaMutation } = await removeFromLikedMedia({
            previewModalState,
            mediaData,
          });
          const mutatedLikedMediaItemData = {
            ...likedMediaMutation,
            mediaItem: {
              ...mediaData?.reference,
              liked_media_id: null,
            },
          };
          setMediaButtonState(buttonActions.REMOVE_FROM_LIKED_MEDIA);
          removeFromLikedMediaMutations(mutatedLikedMediaItemData);
          // setPreviewModalState((prevState) => ({
          //   ...prevState,
          //   isLiked: false,
          //   likedMediaId: null,
          //   isDisliked: true,
          //   dislikedMediaId: dislikedItem?.disliked_media_id,
          // }));
          // Then, add title to dislikes
          const { data: dislikedMediaMutation } = await addToDislikedMedia({
            previewModalState,
            mediaData,
          });
          const dislikedItem =
            dislikedMediaMutation?.profileDislikedMedia?.find(
              (disliked) => disliked?.id === previewModalState?.id
            );
          const mutatedDislikedMediaItemData = {
            ...dislikedMediaMutation,
            mediaItem: {
              ...mediaData?.reference,
              disliked_media_id: dislikedItem?.disliked_media_id,
            },
          };
          setMediaButtonState(buttonActions.ADD_TO_DISLIKED_MEDIA);
          addToDislikedMediaMutations(mutatedDislikedMediaItemData);
          setPreviewModalState((prevState) => ({
            ...prevState,
            isLiked: false,
            likedMediaId: null,
            isDisliked: true,
            dislikedMediaId: dislikedItem?.disliked_media_id,
          }));
        } else {
          // Otherwise, add to dislikes
          const { data: mediaMutation } = await addToDislikedMedia({
            previewModalState,
            mediaData,
          });
          const dislikedItem = mediaMutation?.profileDislikedMedia?.find(
            (disliked) => disliked?.id === previewModalState?.id
          );
          const mutatedMediaItemData = {
            ...mediaMutation,
            mediaItem: {
              ...mediaData?.reference,
              disliked_media_id: dislikedItem?.disliked_media_id,
            },
          };
          setMediaButtonState(buttonActions.ADD_TO_DISLIKED_MEDIA);
          addToDislikedMediaMutations(mutatedMediaItemData);
          setPreviewModalState((prevState) => ({
            ...prevState,
            isDisliked: true,
            dislikedMediaId: dislikedItem?.disliked_media_id,
          }));
        }
        break;
      }
      /**
       * Remove from disliked media
       */
      case buttonActions.REMOVE_FROM_DISLIKED_MEDIA: {
        const mediaData = data; // media?.data
        const { data: mediaMutation } = await removeFromDislikedMedia({
          previewModalState,
          mediaData,
        });
        const dislikedItem = mediaMutation?.profileDislikedMedia?.find(
          (disliked) => disliked?.id === previewModalState?.id
        );
        const mutatedMediaItemData = {
          ...previewModalState,
          mediaItem: {
            ...mediaData?.reference,
            disliked_media_id: dislikedItem?.disliked_media_id,
          },
        };
        setMediaButtonState(buttonActions.REMOVE_FROM_DISLIKED_MEDIA);
        removeFromDislikedMediaMutations(mutatedMediaItemData);
        setPreviewModalState((prevState) => ({
          ...prevState,
          isDisliked: false,
          dislikedMediaId: null,
        }));
        break;
      }
    }
  };

  return (
    <MediaContext.Provider
      value={{
        mediaLoaded,
        setMediaLoaded,
        requestAndRevalidate,
        addToLikedMedia,
        removeFromLikedMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaContext;
