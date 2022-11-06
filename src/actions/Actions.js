export const modalStateActions = {
  MINI_MODAL: "MINI_MODAL",
  DETAIL_MODAL: "DETAIL_MODAL",
  DEFAULT_MODAL: "DEFAULT_MODAL",
};
export const previewModalActions = {
  SET_PREVIEW_MODAL_WILL_OPEN: "SET_PREVIEW_MODAL_WILL_OPEN",
  SET_PREVIEW_MODAL_OPEN: "SET_PREVIEW_MODAL_OPEN",
  SET_PREVIEW_MODAL_WAS_OPEN: "SET_PREVIEW_MODAL_WAS_OPEN",
  SET_PREVIEW_MODAL_CLOSE: "SET_PREVIEW_MODAL_CLOSE",
  GET_PREVIEW_MODAL_STATE: "GET_PREVIEW_MODAL_STATE",
  UPDATE_PREVIEW_MODAL_STATE: "UPDATE_PREVIEW_MODAL_STATE",
  SET_OPEN_NEW_MODAL: "SET_OPEN_NEW_MODAL",
  SET_EXIT_ROUTE_HANDLER: "SET_EXIT_ROUTE_HANDLER",
};
export const animationStateActions = {
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
export const buttonActions = {
  ADD_TO_MEDIA_LIST: "ADD_TO_MEDIA_LIST",
  REMOVE_FROM_MEDIA_LIST: "REMOVE_FROM_MEDIA_LIST",
  ADD_TO_LIKED_MEDIA: "ADD_TO_LIKED_MEDIA",
  REMOVE_FROM_LIKED_MEDIA: "REMOVE_FROM_LIKED_MEDIA",
  ADD_TO_DISLIKED_MEDIA: "ADD_TO_DISLIKED_MEDIA",
  REMOVE_FROM_DISLIKED_MEDIA: "REMOVE_FROM_DISLIKED_MEDIA",
};
export const sliderActions = {
  MOVE_DIRECTION_NEXT: "MOVE_DIRECTION_NEXT",
  MOVE_DIRECTION_PREV: "MOVE_DIRECTION_PREV",
  SLIDER_SLIDING: "SLIDER_SLIDING",
};
export const transitions = {
  simpleFadeIn: {
    initial: { opacity: 0, transition: { duration: 0.2 } },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  fadeOutZoomIn: {
    initial: {
      scale: 1,
      opacity: 0,
      y: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] },
    },
    exit: {
      scale: 1.04,
      y: -60,
      opacity: 0,
      transformOrigin: "0 0", // top
      transition: {
        duration: 0.75,
        ease: "easeIn",
      },
    },
  },
};
