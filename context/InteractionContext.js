import {
  createContext,
  useEffect,
  useState,
  useReducer,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/router";
import debounce from "lodash.debounce";

const InteractionContext = createContext();

const modalStateActions = {
  MINI_MODAL: "MINI_MODAL",
  DETAIL_MODAL: "DETAIL_MODAL",
  DEFAULT_MODAL: "DEFAULT_MODAL",
};
const previewModalActions = {
  SET_PREVIEW_MODAL_WILL_OPEN: "SET_PREVIEW_MODAL_WILL_OPEN",
  SET_PREVIEW_MODAL_OPEN: "SET_PREVIEW_MODAL_OPEN",
  SET_PREVIEW_MODAL_WAS_OPEN: "SET_PREVIEW_MODAL_WAS_OPEN",
  SET_PREVIEW_MODAL_CLOSE: "SET_PREVIEW_MODAL_CLOSE",
  GET_PREVIEW_MODAL_STATE: "GET_PREVIEW_MODAL_STATE",
  UPDATE_PREVIEW_MODAL_STATE: "UPDATE_PREVIEW_MODAL_STATE",
  SET_OPEN_NEW_MODAL: "SET_OPEN_NEW_MODAL",
  SET_EXIT_ROUTE_HANDLER: "SET_EXIT_ROUTE_HANDLER",
};
const animationStateActions = {
  SET_MINI_MODAL: "SET_MINI_MODAL",
  SET_DEFAULT_MODAL: "SET_DEFAULT_MODAL",
  RESET_MINI_MODAL: "RESET_MINI_MODAL",
  MOUNT_MINI_MODAL: "MOUNT_MINI_MODAL",
  OPEN_MINI_MODAL: "OPEN_MINI_MODAL",
  CLOSE_MINI_MODAL: "CLOSE_MINI_MODAL",
  MOUNT_DETAIL_MODAL: "MOUNT_DETAIL_MODAL",
  OPEN_DETAIL_MODAL: "OPEN_DETAIL_MODAL",
  CLOSE_DETAIL_MODAL: "CLOSE_DETAIL_MODAL",
};
const buttonActions = {
  ADD_TO_MEDIA_LIST: "ADD_TO_MEDIA_LIST",
  REMOVE_FROM_MEDIA_LIST: "REMOVE_FROM_MEDIA_LIST",
  ADD_TO_LIKED_MEDIA: "ADD_TO_LIKED_MEDIA",
  REMOVE_FROM_LIKED_MEDIA: "REMOVE_FROM_LIKED_MEDIA",
  ADD_TO_DISLIKED_MEDIA: "ADD_TO_DISLIKED_MEDIA",
  REMOVE_FROM_DISLIKED_MEDIA: "REMOVE_FROM_DISLIKED_MEDIA",
};
const sliderActions = {
  MOVE_DIRECTION_NEXT: "MOVE_DIRECTION_NEXT",
  MOVE_DIRECTION_PREV: "MOVE_DIRECTION_PREV",
  SLIDER_SLIDING: "SLIDER_SLIDING",
};

// Default values for the preview modal.
const initialPreviewModalState = {
  closeWithoutAnimation: false,
  isOpen: false,
  isMyListRow: false,
  listContext: undefined,
  modalState: undefined,
  model: undefined,
  onPreviewModalClose: undefined,
  titleCardId: undefined,
  titleCardRect: undefined,
  videoId: undefined,
  videoKey: undefined,
  videoModel: undefined,
  videoPlayback: {
    start: null,
    length: null,
  },
  videos: undefined,
};
// Default UI values in relation to the preview modal state.
const initialState = {
  galleryModalOpen: false,
  previewModalStateById: {}, // undefined: {}
  scrollPosition: undefined,
  titleCardId: undefined,
  titleCardRect: undefined,
  videoId: undefined,
  videoModel: {},
  wasOpen: false,
};

const actions = {
  getPreviewModalState: (payload) => ({
    type: previewModalActions.GET_PREVIEW_MODAL_STATE,
    payload,
  }),
  setPreviewModalWillOpen: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_WILL_OPEN,
    payload,
  }),
  setPreviewModalOpen: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_OPEN,
    payload,
  }),
  setPreviewModalWasOpen: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN,
    payload,
  }),
  setPreviewModalClose: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_CLOSE,
    payload,
  }),
  updatePreviewModalState: (payload) => ({
    type: previewModalActions.UPDATE_PREVIEW_MODAL_STATE,
    payload,
  }),
  setOpenNewModal: (payload) => ({
    type: previewModalActions.SET_OPEN_NEW_MODAL,
    payload,
  }),
  setExitRouteHandler: (payload) => ({
    type: previewModalActions.SET_EXIT_ROUTE_HANDLER,
    payload,
  }),
};

/**
 * Manage the preview modal state and UI.
 * @param {Object} state
 * @param {Object} action
 * @returns
 */
const previewModalReducer = (state, action) => {
  switch (action.type) {
    case previewModalActions.SET_PREVIEW_MODAL_WILL_OPEN: {
      const {
        payload: { titleCardId, willOpen },
      } = action;
      return {
        ...state,
        willOpen,
        titleCardId,
      };
    }
    case previewModalActions.SET_PREVIEW_MODAL_OPEN: {
      const { previewModalStateById } = state;
      const {
        payload,
        payload: { modalState, videoId = undefined },
      } = action;
      const modal = previewModalStateById[videoId] || {};
      return {
        ...state,
        previewModalStateById: {
          ...previewModalStateById,
          [videoId]: {
            ...initialPreviewModalState,
            ...payload,
            isOpen: true,
            modalState:
              modalState !== null && modalState !== undefined
                ? modalState
                : modalStateActions.MINI_MODAL,
            billboardVideoMerchId: modal?.billboardVideoMerchId,
          },
        },
      };
    }
    case previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN: {
      const { payload } = action;
      return {
        ...state,
        wasOpen: payload,
      };
    }
    case previewModalActions.SET_PREVIEW_MODAL_CLOSE: {
      const { previewModalStateById } = state;
      const {
        payload: { closeWithoutAnimation = false, videoId = undefined },
      } = action;
      let modal;
      console.log("closeWithoutAnimation: ", closeWithoutAnimation);
      return {
        ...state,
        previewModalStateById: {
          ...previewModalStateById,
          [videoId]: {
            ...initialPreviewModalState,
            closeWithoutAnimation,
            isMyListRow: (modal =
              previewModalStateById[videoId] === null || modal === undefined
                ? undefined
                : modal.isMyListRow),
          },
        },
      };
    }
    case previewModalActions.UPDATE_PREVIEW_MODAL_STATE: {
      const { previewModalStateById } = state;
      const {
        payload,
        payload: { individualState, individualState: { videoId } = {} },
      } = action;
      const modal = individualState === undefined ? {} : individualState;
      return {
        ...state,
        previewModalStateById: {
          ...previewModalStateById,
          [videoId]: {
            ...previewModalStateById[videoId],
            ...modal,
          },
        },
        ...payload,
      };
    }
    case previewModalActions.SET_OPEN_NEW_MODAL: {
      const {
        payload: { historyIndex },
      } = action;
      return {
        ...state,
        openedModalAtHistoryIndex: historyIndex,
      };
    }
    case previewModalActions.SET_EXIT_ROUTE_HANDLER: {
      const {
        payload: { exitRouteHandlerUrl },
      } = action;
      return {
        ...state,
        exitRouteHandlerUrl,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const InteractionProvider = ({ children }) => {
  // Slider state
  const [rowHasExpandedInfoDensity, setRowHasExpandedInfoDensity] =
    useState(false);
  const [onMouseEnterSliderHandle, setOnMouseEnterSliderHandle] =
    useState(false);
  const [movementDirection, setMovementDirection] = useState(null);
  const [itemIndex, setItemIndex] = useState(null);

  // Global preview modal state
  const [shouldFreeze, setShouldFreeze] = useState(false);
  // const [modalIsAnimating, setModalIsAnimating] = useState(false);
  const [miniModalIsAnimating, setMiniModalIsAnimating] = useState(false);
  const [detailModalIsAnimating, setDetailModalIsAnimating] = useState(false);
  const [animationState, setAnimationState] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [parentStyles, setParentStyles] = useState(false);

  const [hasFetchedModalData, setHasFetchedModalData] = useState(false);
  const [queryData, setQueryData] = useState(null);

  // Watch mode player state
  const [watchModeEnabled, setWatchModeEnabled] = useState(false);

  // Add to list, liking, and disliking state
  const [mediaButtonState, setMediaButtonState] = useState(null);

  // Preview modal state tooltips
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false);

  const [audioEnabled, setAudioEnabled] = useState(false);

  // Next Router
  const router = useRouter();

  // Refs
  const modalTimeoutIdRef = useRef(0);
  const timerIdRef = useRef(null);

  /**
   * Enable audio globally
   */
  const enableAudio = () => {
    setAudioEnabled(true);
  };

  /**
   * Disable audio globally
   */
  const disableAudio = () => {
    setAudioEnabled(false);
  };

  /**
   * Return if audio is enabled globally
   * @returns {Boolean}
   */
  const audioIsEnabled = () => {
    return audioEnabled;
  };

  /**
   * Preview modal state reducer wrapper
   * @returns {Object}
   */
  const usePreviewModalStateReducer = () => {
    return useReducerWithActions({
      actions,
      initialState,
      previewModalReducer,
    });
  };

  /**
   * Custom hook: useReducer wrapper with actions
   * @param {Object} actions
   * @param {Object} initialState
   * @param {Object} reducer
   * @returns {Object}
   */
  const useReducerWithActions = ({
    actions,
    initialState,
    previewModalReducer,
  }) => {
    const [state, dispatch] = useReducer(previewModalReducer, initialState);
    const makeActionCreators = Object.keys(actions).reduce(
      (prevState, actionKey) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        prevState[actionKey] = (...args) =>
          dispatch(actions[actionKey](...args));
        return prevState;
      },
      {}
    );
    return {
      ...state,
      ...makeActionCreators,
    };
  };

  /**
   * Preview modal reducer state
   */
  const {
    wasOpen,
    scrollPosition,
    previewModalStateById,
    getPreviewModalState,
    setPreviewModalOpen,
    previewModalWillOpen,
    updatePreviewModalState,
    setPreviewModalClose,
    setPreviewModalWasOpen,
    setExitRouteHandler,
  } = usePreviewModalStateReducer();

  console.log("previewModal: ", previewModalStateById);

  /**
   * Reset `wasOpen` state after 0.33 seconds
   */
  useEffect(() => {
    !modalTimeoutIdRef.current && wasOpen
      ? (modalTimeoutIdRef.current = setTimeout(() => {
          setPreviewModalWasOpen(false);
        }, 400))
      : setPreviewModalWasOpen(false);
    // Cleanup
    return () => {
      modalTimeoutIdRef.current && clearTimeout(modalTimeoutIdRef.current),
        (modalTimeoutIdRef.current = 0);
    };
  }, [wasOpen]);
  // console.log("wasOpen: ", wasOpen);

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = (videoId = null) => {
    let modal,
      modals = previewModalStateById;
    return videoId
      ? (modal = modals[videoId]) === null || modal === undefined
        ? undefined
        : modal.isOpen
      : Object.values(modals).some((item) => item.isOpen);
  };

  /**
   * Returns the state of the currently open preview modal
   * @returns {Object}
   */
  const openPreviewModalState = () => {
    const modals = previewModalStateById;
    return Object.values(modals).find((item) => item?.isOpen) || {};
  };

  /**
   * Returns true if the preview modal's state is `DETAIL_MODAL` or `DEFAULT_MODAL
   * @returns {Boolean}
   */
  const isDetailModal = () => {
    const modals = previewModalStateById;
    return Object.values(modals).some(
      (item) => !!(item?.modalState === modalStateActions.DETAIL_MODAL)
    );
  };

  const enableWatchMode = () => {
    setWatchModeEnabled(true);
  };

  const disableWatchMode = () => {
    setWatchModeEnabled(false);
  };

  const isWatchModeEnabled = () => {
    return watchModeEnabled;
  };

  /**
   * Turn pointer events off while scrolling
   */
  const onScroll = useCallback(
    debounce(
      () => {
        const modals = previewModalStateById;
        const style = document.body.style;
        timerIdRef.current && clearTimeout(timerIdRef.current),
          (timerIdRef.current = null);
        Object.values(modals).some((modal) => {
          return !!modal.isOpen;
        }) ||
          (style.pointerEvents !== "none" && (style.pointerEvents = "none")),
          (timerIdRef.current = setTimeout(() => {
            style.pointerEvents = "";
          }, 100));
      },
      100,
      { maxWait: 100, leading: true, trailing: true }
    ),
    [previewModalStateById, timerIdRef.current]
  );

  /**
   * Disable hover while scrolling
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
  }, [onScroll]);

  /**
   * Enable modal tooltips
   */
  const enableTooltips = () => {
    setTooltipsEnabled(true);
  };

  /**
   * Disable modal tooltips
   */
  const disableTooltips = () => {
    setTooltipsEnabled(false);
  };

  /**
   * Determine if tooltips are enabled
   */
  const tooltipsAreEnabled = () => {
    return tooltipsEnabled;
  };

  /**
   * Redirect to watch mode screen
   */
  const handleWatchNow = (props = {}) => {
    const { id, mediaType } = props;
    if (id) {
      const as = `/watch/${mediaType}-${id}`;
      const options = {
        shallow: true,
        scroll: false,
      };
      router.push(
        {
          pathname: "/watch/[mediaId]",
          query: {
            ...router.query,
            id,
            mediaId: `${mediaType}-${id}`,
            type: mediaType,
          },
        },
        as,
        options
      );
      enableWatchMode();
    }
  };

  /**
   * Save the element's size and position to state and return the values
   * @param {Object} updatedTitleCardRect
   */
  const getTitleCardRect = ({ videoModel } = {}) => {
    const updatedRect = videoModel?.ref
      ? videoModel?.ref.getBoundingClientRect()
      : null;
    updatePreviewModalState({
      individualState: {
        videoId: videoModel?.videoId,
        titleCardRect: updatedRect,
      },
      scrollPosition: undefined,
    });
  };

  /**
   * Add classes and capture scroll positions before Detail Modal animates in
   */
  const setDetailModalParentStyles = () => {
    let state = scrollPosition,
      scrollPos = (null == state ? undefined : state) || window.scrollY;
    setParentStyles(true);
    window.scrollTo(0, scrollPos);
    updatePreviewModalState({
      scrollPosition: scrollPos,
    });
  };

  /**
   * Remove classes and return to previous scroll position after Detail Modal animates out
   */
  const resetDetailModalParentStyles = () => {
    let state = scrollPosition,
      scrollPos = (null == state ? undefined : state) || 0;
    setParentStyles(false);
    resetRouteQuery();
    window.scrollTo(0, scrollPos);
    updatePreviewModalState({
      scrollPosition: undefined,
    });
  };

  /**
   * Close all open preview modals
   */
  const closeAllModals = () => {
    const modals = previewModalStateById;
    Object.values(modals)
      .filter(({ isOpen }) => isOpen)
      .forEach(({ videoId }) => {
        closeModal(videoId);
      });
  };

  /**
   * Close open preview modal
   * @param {Number} videoId
   */
  const closeModal = (videoId = null) => {
    let modals = previewModalStateById,
      modal = (modals === undefined ? {} : modals)[videoId];
    setPreviewModalClose({
      videoId,
      closeWithoutAnimation: !!modal.closeWithoutAnimation,
    });
    modal.onPreviewModalClose && modal.onPreviewModalClose();
  };

  /**
   * Get videoId from open modal state
   * @returns {Number}
   */
  const getVideoId = () => {
    const modal = openPreviewModalState();
    return modal && modal.videoId;
  };

  /**
   * Toggle thumbnail has expandedInfoDensity state
   * @param {Boolean} isExpanded
   */
  const toggleExpandedInfoDensity = (isExpanded) => {
    setRowHasExpandedInfoDensity(isExpanded);
  };

  /**
   * Hide the preview modal and reset a bunch of state to its defaults
   */
  const handleModalClose = () => {
    resetRouteQuery();
  };

  /**
   * Remove the route query string and set the query state to null
   */
  const resetRouteQuery = () => {
    if (isWatchModeEnabled()) return;
    setQueryData(null);
    router.push(
      {
        pathname: null,
        query: null,
      },
      undefined,
      { scroll: false }
    );
  };

  /**
   * Create a route with the modal ID as a parameter.
   * This will act as a dedicated page for link sharing.
   * @param {Object} query
   */
  const handleRouteChange = ({ id, mediaType } = {}) => {
    const options = { shallow: true, scroll: false };
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, jbv: id, type: mediaType },
      },
      undefined,
      options
    );
  };

  /**
   * Set the modal data we just fetched in state
   * @param {Object} data
   */
  const handleDetailModelOpenPage = ({ id, mediaType } = {}) => {
    if (id && mediaType) {
      setQueryData({ id, mediaType });
      handleExpandModal();
    }
  };

  /**
   * To open a preview modal:
   * When a titlecard is hovered, generate modal state
   * Add state to queue
   * The one that is hovered is active while the others are inactive
   */

  /**
   * Request and validate
   */

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

  const value = {
    enableAudio,
    disableAudio,
    audioIsEnabled,
    mediaButtonState,
    setMediaButtonState,
    sliderActions,
    buttonActions,
    modalStateActions,
    animationStateActions,
    animationState,
    setAnimationState,
    itemIndex,
    setItemIndex,
    handleModalClose,
    modalOpen,
    setModalOpen,
    isDetailModal,
    getTitleCardRect,
    scrollPosition,
    parentStyles,
    setParentStyles,
    resetRouteQuery,
    setDetailModalParentStyles,
    resetDetailModalParentStyles,
    movementDirection,
    setMovementDirection,
    hasFetchedModalData,
    setHasFetchedModalData,
    handleDetailModelOpenPage,
    handleRouteChange,
    queryData,
    setQueryData,
    handleWatchNow,
    isWatchModeEnabled,
    enableWatchMode,
    disableWatchMode,
    enableTooltips,
    disableTooltips,
    tooltipsAreEnabled,
    miniModalIsAnimating,
    setMiniModalIsAnimating,
    detailModalIsAnimating,
    setDetailModalIsAnimating,
    shouldFreeze,
    setShouldFreeze,
    previewModalStateById,
    getPreviewModalState,
    setPreviewModalOpen,
    previewModalWillOpen,
    updatePreviewModalState,
    setPreviewModalClose,
    setPreviewModalWasOpen,
    wasOpen,
    closeAllModals,
    closeModal,
    isPreviewModalOpen,
    openPreviewModalState,
    onMouseEnterSliderHandle,
    setOnMouseEnterSliderHandle,
    toggleExpandedInfoDensity,
    rowHasExpandedInfoDensity,
    setRowHasExpandedInfoDensity,
    getVideoId,
    router,
  };
  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
};

export default InteractionContext;
