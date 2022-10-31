import { useIsPresent } from "framer-motion";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import {
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

// Lib
import MotionDivWrapper from "@/lib/MotionDivWrapper";

// Context
import InteractionContext from "@/context/InteractionContext";
// Actions
import { animationStateActions, modalStateActions } from "@/actions/Actions";
// Middleware (SWR)
import usePreviewModal from "@/middleware/usePreviewModal";

// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";

// Components
import CloseButton from "./detail/CloseButton";
import DetailInfo from "./detail/info/Info";
import MiniInfo from "./mini/info/Info";
import Modal from "./Modal";
import ModalFocusTrapWrapper from "./ModalFocusTrapWrapper";
import ModalOverlay from "./ModalOverlay";
import PlayerContainer from "./PlayerContainer";

const PreviewModal = forwardRef((props, layoutWrapperRef) => {
  // Context
  const {
    isWatchModeEnabled,
    enableWatchMode,
    disableWatchMode,
    enableTooltips,
    disableTooltips,
  } = useContext(InteractionContext);
  // Props
  const {
    previewModalState,
    previewModalState: {
      isOpen,
      modalState,
      model,
      mutateSliderData,
      scrollPosition,
      titleCardRect,
      videoId,
    },
  } = props;
  // Framer motion utility
  const isPresent = useIsPresent();
  // State
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDetailAnimating, setIsDetailAnimating] = useState(false);
  const [animationState, setAnimationState] = useState(
    modalState === modalStateActions.MINI_MODAL
      ? undefined
      : animationStateActions.MOUNT_DETAIL_MODAL
  );
  const [modalRect, setModalRect] = useState(undefined);
  const [willClose, setWillClose] = useState(false);
  // Refs
  const modalRef = useRef();
  const modalInfoRef = useRef();
  const mediaButtonsRef = useRef();
  const animationFrameId = useRef(0);
  // Middleware (SWR)
  const {
    modalData,
    fetchingModalData,
    mutateModalData,
    modalDataError,
    cancelRequest,
  } = usePreviewModal({
    initialData: previewModalState,
  });
  // Next Router
  const router = useRouter();
  // Local vars
  const scaleFactor = 1.5;
  const baseWidth = 850;

  /**
   * Redirect to watch mode screen
   */
  const handleWatchNow = ({ id, mediaType } = {}) => {
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
   * Create a route with the modal ID as a parameter.
   * This will act as a dedicated page for link sharing.
   * @param {Object} query
   */
  const handleRouteChange = useCallback(({ id, mediaType } = {}) => {
    // This method does not force a re-render
    window.history.replaceState(
      {
        ...window.history.state,
        as: `?jbv=${id}&type=${mediaType}`,
        url: `?jbv=${id}&type=${mediaType}`,
      },
      "",
      `?jbv=${id}&type=${mediaType}`
    );
    // This method forces a re-render :(
    // router.push(
    //   {
    //     pathname: router.pathname,
    //     query: { ...router.query, jbv: id, type: mediaType },
    //   },
    //   undefined,
    //   { shallow: true, scroll: false }
    // );
  }, []);

  /**
   * Remove the route query string and set the query state to null
   */
  const resetRouteQuery = useCallback(() => {
    if (isWatchModeEnabled()) return;
    // This method does not force a re-render
    window.history.replaceState(
      {
        ...window.history.state,
        as: router.route,
        url: router.route,
      },
      "",
      router.route
    );
    // This method forces re-renders :(
    // router.push(
    //   {
    //     pathname: null,
    //     query: null,
    //   },
    //   undefined,
    //   { scroll: false }
    // );
  }, [isWatchModeEnabled, router.route]);

  /**
   * Modal was closed without animation
   */
  const modalClosedWithoutAnimation = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return (
      previewModalStateById[videoId] !== null &&
      previewModalStateById[videoId] !== undefined &&
      previewModalStateById[videoId].closeWithoutAnimation
    );
  };

  /**
   * Set Detail Modal Parent styles
   */
  const setDetailModalParentStyles = useCallback(() => {
    let layoutRef = layoutWrapperRef.current,
      mainNavigation = document.querySelector(".main-navigation-content"),
      mainViewContent = document.querySelector(".main-view-content");
    if (layoutRef) {
      if (layoutRef.hasAttribute("isDetailModalRootStyleSet")) return;
      const scrollPos =
        (previewModalState == null ? undefined : scrollPosition) ||
        window.scrollY;
      window.scrollTo(0, scrollPos),
        usePreviewModalStore.getState().updatePreviewModalState({
          scrollPosition: scrollPos,
        }),
        mainViewContent.classList.add("has-open-jaw"),
        (mainNavigation.style.backgroundColor = "rgb(20, 20, 20)"),
        (mainNavigation.style.top = "0px"),
        (mainNavigation.style.position = "fixed"),
        (layoutRef.style.top = `-${scrollPos}px`),
        (layoutRef.style.position = "fixed"),
        layoutRef.setAttribute("isDetailModalRootStyleSet", "true");
    }
  }, [layoutWrapperRef, previewModalState, scrollPosition]);

  /**
   * Reset detail modal parent styles on unmount
   */
  const resetDetailModalParentStyles = useCallback(() => {
    let layoutRef = layoutWrapperRef.current,
      mainNavigation = document.querySelector(".main-navigation-content"),
      mainViewContent = document.querySelector(".main-view-content");
    if (layoutRef && layoutRef.hasAttribute("isDetailModalRootStyleSet")) {
      mainViewContent.classList.remove("has-open-jaw"),
        ((mainNavigation.style = ""),
        (layoutRef.style.top = ""),
        (layoutRef.style.position = "static"),
        resetScrollPositionOnUnmount(),
        layoutRef.removeAttribute("isDetailModalRootStyleSet"));
    }
  }, [layoutWrapperRef, resetScrollPositionOnUnmount]);

  /**
   * Reset scroll position on unmount
   */
  const resetScrollPositionOnUnmount = useCallback(() => {
    window.scrollTo(
      0,
      (null == previewModalState
        ? undefined
        : previewModalState.scrollPosition) || 0
    );
    usePreviewModalStore.getState().updatePreviewModalState({
      scrollPosition: undefined,
    });
  }, [previewModalState]);

  /**
   * Get the most updated values for modalRect.
   * This gets called while animating the "open" modal state.
   */

  const updateModalRect = () => {
    modalRef.current && setModalRect(modalRef.current?.getBoundingClientRect());
  };

  /**
   * Compute the framer-motion `variants` for the modal's mini state
   * @returns {Object}
   */
  const miniModalAnimationProps = () => {
    /**
     * Mini modal's mounting/reset state.
     * Some of the previous state's values are needed for the next transition.
     * @returns {Object}
     */
    function resetMiniModal() {
      // No animation props if conditions aren't met
      if (!modalRect || !modalRef.current || !titleCardRect) return {};
      // Render normally
      let top,
        left,
        y,
        scaleX = 1 / scaleFactor,
        scaleY = 1 / scaleFactor,
        leftOffset = titleCardRect.left + window.scrollX,
        topOffset = titleCardRect.top + scrollPosition,
        titleCardRectHeight = titleCardRect.height;
      switch (modalState) {
        case modalStateActions.MINI_MODAL:
          top = Math.round(
            topOffset - (modalRect.height - titleCardRectHeight) / 2
          );
          left = Math.round(
            leftOffset - (modalRect.width - titleCardRect.width) / 2
          );
          y = Math.round(
            (modalRect.height / scaleFactor - titleCardRectHeight) / 2
          );
      }
      return {
        top: `${top}px`,
        left,
        transformOrigin: "50% 50%",
        y: `${y}px`,
        zIndex: 4,
        scaleX,
        scaleY,
        opacity: 0,
        transition: {
          default: {
            duration: 0,
          },
        },
      };
    }

    /**
     * Mini modal's opening state.
     * Some of the previous state's values are needed for the next transition.
     * @returns {Object}
     */
    function openMiniModal() {
      // Hide modal if conditions aren't met
      if (!modalRect || !modalRef.current || !titleCardRect) {
        return {
          zIndex: 4,
          opacity: 0,
          transition: {
            opacity: {
              duration: 0,
            },
            default: {
              duration: 0,
            },
          },
          transitionEnd: {
            zIndex: 3,
          },
        };
      }
      // Render normally
      if (modalRect) {
        let leftOffset = titleCardRect.left + window.scrollX,
          widthOffset = (modalRect.width - titleCardRect.width) / 2,
          screenEdgeDistance = leftOffset - widthOffset < 48,
          left =
            document.body.clientWidth -
              (leftOffset + titleCardRect.width + widthOffset) <
            48,
          x = 0;
        return (
          screenEdgeDistance
            ? (x = Math.round(widthOffset))
            : left && (x = Math.round(-widthOffset)),
          {
            zIndex: 4,
            scaleX: 1,
            scaleY: 1,
            y: 0,
            x,
            opacity: 1,
            transition: {
              opacity: {
                duration: 0.05,
                ease: "linear",
              },
              default: {
                duration: 0.3,
                ease: [0.21, 0, 0.07, 1],
              },
            },
            transitionEnd: {
              zIndex: 3,
            },
          }
        );
      }
    }

    /**
     * Mini modal's closing state.
     * Some of the previous state's values are needed for the next transition.
     * @returns {Object}
     */
    function closeMiniModal() {
      const previewModalStateById =
        usePreviewModalStore.getState().previewModalStateById;
      // Hide modal if closeWithoutAnimation is true
      if (
        previewModalStateById[videoId] !== null &&
        previewModalStateById[videoId] !== undefined &&
        previewModalStateById[videoId].closeWithoutAnimation
      ) {
        return {
          opacity: 0,
          transition: {
            default: {
              duration: 0,
            },
          },
        };
      }
      // Hide modal if conditions aren't met
      if (!modalRect || !modalRef.current || !titleCardRect || !willClose)
        return {};
      // Render normally
      let scaleX = 1 / scaleFactor,
        scaleY = 1 / scaleFactor,
        titleCardRectHeight = titleCardRect.height,
        heightOffset =
          (modalRect.height / scaleFactor - titleCardRectHeight) / 2,
        modalHeightOffset = Math.round(
          (modalRef.current.offsetHeight - modalRect.height) / scaleFactor / 4
        ),
        y = Math.round(heightOffset - modalHeightOffset);
      return {
        opacity: 1,
        scaleX,
        scaleY,
        y: `${y}px`,
        x: 0,
        transition: {
          opacity: {
            delay: 0.067,
            duration: 0.117,
            ease: "linear",
          },
          default: {
            duration: 0.3,
            ease: [0.21, 0, 0.07, 1],
          },
        },
      };
    }
    let variantObj;
    return titleCardRect
      ? {
          animate: animationState,
          exit: animationStateActions.CLOSE_MINI_MODAL,
          onAnimationStart: () => {
            setIsAnimating(true);
          },
          onAnimationComplete: () => {
            if (
              animationState === animationStateActions.RESET_MINI_MODAL &&
              isPresent &&
              !willClose
            )
              return (
                setAnimationState(animationStateActions.OPEN_MINI_MODAL),
                modalRef.current &&
                  (modalRef.current.style.boxShadow =
                    "0 3px 10px rgba(0, 0, 0, 0.75)")
              );
            setIsAnimating(false);
            enableTooltips();
          },
          onHoverEnd: () => {
            modalState &&
              modalState === modalStateActions.MINI_MODAL &&
              handleCloseModal();
          },
          variants:
            ((variantObj = {}),
            Object.assign(variantObj, {
              [animationStateActions.RESET_MINI_MODAL]: Object.assign(
                {},
                resetMiniModal()
              ),
            }),
            Object.assign(variantObj, {
              [animationStateActions.OPEN_MINI_MODAL]: Object.assign(
                {},
                resetMiniModal(),
                openMiniModal()
              ),
            }),
            Object.assign(variantObj, {
              [animationStateActions.CLOSE_MINI_MODAL]: Object.assign(
                {},
                openMiniModal(),
                closeMiniModal()
              ),
            }),
            variantObj),
        }
      : {
          exit: {},
        };
  };

  /**
   * Compute the framer-motion `variants` for the modal's detail state
   * @returns {Object}
   */
  const detailModalAnimationProps = () => {
    /**
     * Detail modal's mounting state.
     * Some of the previous state's values are neededfor the next transition.
     * @returns {Object}
     */
    function mountDetailModal() {
      const width = getDetailModalWidth();
      let stackedDetailModalNavigationDirection;
      if (stackedDetailModalNavigationDirection) {
        return {
          x: 0,
          left: "auto",
          transformOrigin: "50% 12.5%",
          top: "2em",
          width,
          scaleX: 1,
          scaleY: 1,
          opacity: 0,
          transition: {
            default: {
              duration: 0,
            },
          },
          transitionEnd: {
            marginBottom: "2em",
          },
        };
      }
      /**
       * Standard default modal values
       */
      if (!modalRect || !titleCardRect) {
        return {
          x: 0,
          left: "auto",
          transformOrigin: "50% 12.5%", // "50% 12.5%"
          top: "2em",
          width,
          scaleX: 0.8,
          scaleY: 0.8,
          opacity: 0,
          transition: {
            default: {
              duration: 0,
            },
          },
          transitionEnd: {
            marginBottom: "2em",
          },
        };
      }

      /**
       * When the mini modal transforms into the detail modal
       */
      const distanceFromCenter = width / 2 - titleCardRect.left;
      const isRtl = distanceFromCenter < 1;
      let x = isRtl ? 3 : -3;
      let scaleX = modalRect.width / width,
        scaleY = modalRect.width / width,
        top = modalRect.top;
      x = modalRect.left + modalRect.width / 2 - document.body.clientWidth / 2;
      return {
        width,
        left: "auto",
        top,
        x,
        y: 0,
        scaleX,
        scaleY,
        opacity: 1,
        transformOrigin: "50% 0%", // "50% 12.5%"
        transition: {
          default: {
            duration: 0,
          },
        },
        transitionEnd: {
          marginBottom: "2em",
        },
      };
    }

    /**
     * Detail modal's opening state.
     * Some of the previous state's values are needed for the next transition.
     * @returns {Object}
     */
    function openDetailModal() {
      let stackedDetailModalNavigationDirection;
      if (stackedDetailModalNavigationDirection) {
        return {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          transition: {
            opacity: {
              duration: 0.117,
              ease: "linear",
            },
            default: {
              duration: 0.417,
              ease:
                modalState === modalStateActions.DETAIL_MODAL
                  ? [0.21, 0, 0.07, 1]
                  : [0.4, 0, 0.7, 1],
            },
          },
          transitionEnd: {
            zIndex: 3,
          },
        };
      }
      /**
       * Default modal
       */
      if (!modalRect || !titleCardRect)
        return {
          y: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          transition: {
            opacity: {
              duration: 0.117,
              ease: "linear",
            },
            default: {
              duration: 0.417,
              ease: [0.21, 0, 0.07, 1],
            },
          },
          transitionEnd: {
            zIndex: 3,
          },
        };
      /**
       * Expand from mini to default modal
       */
      const y = -modalRect.top;
      return {
        scaleX: 1,
        scaleY: 1,
        x: 0,
        y: `calc(${y}px + 2em)`,
        opacity: 1,
        transition: {
          opacity: {
            duration: 0.117,
            ease: "linear",
          },
          default: {
            duration: 0.417,
            ease: [0.21, 0, 0.07, 1],
          },
        },
        transitionEnd: {
          zIndex: 3,
        },
      };
    }

    /**
     * Detail modal's closing state.
     * Some of the previous state's values are needed for the next transition.
     * @returns {Object}
     */
    function closeDetailModal() {
      const previewModalStateById =
        usePreviewModalStore.getState().previewModalStateById;
      // If modal is to close without animation
      if (
        previewModalStateById[videoId] !== null &&
        previewModalStateById[videoId] !== undefined &&
        previewModalStateById[videoId].closeWithoutAnimation
      )
        return {
          opacity: 0,
          transition: {
            default: {
              duration: 0,
            },
          },
        };
      // If no modal props exist or if watch mode is enabled
      if (
        !(modalRect && modalRef.current && titleCardRect) ||
        isWatchModeEnabled()
      ) {
        return {
          scaleX: 0.8,
          scaleY: 0.8,
          opacity: 0,
          transition: {
            opacity: {
              delay: 0.133,
              duration: 0.134,
              ease: "linear",
            },
            default: {
              duration: 0.54,
              ease: [0.42, 0, 0.58, 1],
            },
          },
        };
      }

      let width = getDetailModalWidth(),
        scaleX = titleCardRect.width / width,
        scaleY = titleCardRect.width / width,
        documentWidth = document.body.clientWidth / 2,
        titleCardX = titleCardRect.left + titleCardRect.width / 2;
      return {
        scaleX,
        scaleY,
        opacity: 1,
        y: titleCardRect.top - modalRect.top,
        x: titleCardX - documentWidth,
        transition: {
          default: {
            duration: 0.54,
            ease: [0.26, 1, 0.48, 1],
          },
        },
      };
    }

    let variantObj;
    return {
      initial: false,
      animate: animationState,
      exit: animationStateActions.CLOSE_DETAIL_MODAL,
      onAnimationStart: () => {
        setIsDetailAnimating(true);
        disableTooltips();
      },
      onAnimationComplete: () => {
        flushSync(() => {
          if (animationState === animationStateActions.MOUNT_DETAIL_MODAL)
            return (
              window.scrollTo(0, 0),
              setAnimationState(animationStateActions.OPEN_DETAIL_MODAL),
              animationState === animationStateActions.OPEN_DETAIL_MODAL &&
                setResponsiveDetailModalWidth()
            );
          setIsDetailAnimating(false);
          enableTooltips();
        });
      },
      variants:
        ((variantObj = {}),
        Object.assign(variantObj, {
          [animationStateActions.MOUNT_DETAIL_MODAL]: Object.assign(
            mountDetailModal()
          ),
        }),
        Object.assign(variantObj, {
          [animationStateActions.OPEN_DETAIL_MODAL]: Object.assign(
            mountDetailModal(),
            openDetailModal()
          ),
        }),
        Object.assign(variantObj, {
          [animationStateActions.CLOSE_DETAIL_MODAL]: Object.assign(
            openDetailModal(),
            closeDetailModal()
          ),
        }),
        variantObj),
    };
  };

  /**
   * Get the animation props for each animation state
   * @returns {Object}
   */
  const getAnimationProps = () => {
    switch (modalState) {
      case modalStateActions.MINI_MODAL: {
        // console.log("mini ", miniModalAnimationProps());
        return miniModalAnimationProps();
      }
      case modalStateActions.DETAIL_MODAL: {
        return detailModalAnimationProps();
      }
      default: {
        return;
      }
    }
  };

  /**
   * Expand the mini modal to the detail modal and update the router path
   * @param {Object} e
   */
  // const handleExpandModal = (e) => {
  //   // modalState !== modalStateActions.DETAIL_MODAL &&
  //   //   (e && e.stopPropagation(), willClose || handleRouteChange(modalData?.videoModel?.identifiers););
  //   modalState === modalStateActions.DETAIL_MODAL &&
  //     handleRouteChange(modalData?.videoModel?.identifiers);
  // };

  /**
   * Expand the mini modal to the detail modal when the user clicks the area between the buttons
   * @param {Object} e
   */
  const handleMetadataAreaClicked = (e) => {
    e && e.target && e.target.closest("button")
      ? e.target.closest("[data-uia=expand-to-detail-button]") ||
        e.preventDefault()
      : handleViewDetails(e);
  };

  /**
   * Update the modal state to the default / detail preview modal view
   * @param {Object} e
   */
  const handleViewDetails = () => {
    usePreviewModalStore.getState().updatePreviewModalState({
      individualState: {
        billboardVideoMerchId: modalData?.videoModel.videoId,
        videoId: modalData?.videoModel.videoId,
        model: { ...modalData?.model },
        videoModel: { ...modalData?.videoModel },
        modalState: modalStateActions.DETAIL_MODAL,
        titleCardRect: titleCardRect ? titleCardRect : undefined,
      },
    });
    // handleExpandModal(e);
  };

  /**
   * Close the modal and reset it's styles and state
   */
  const handleCloseModal = useCallback(
    ({ closeAll = false, closeWithoutAnimation = false } = {}) => {
      flushSync(() => {
        // set willClose true
        setWillClose(true);
        // Reset timeout id
        animationFrameId.current &&
          cancelAnimationFrame(animationFrameId.current),
          (animationFrameId.current = 0);
        // Set wasOpen true
        usePreviewModalStore.getState().setPreviewModalWasOpen(true);
        // Set preview modal closed
        usePreviewModalStore.getState().setPreviewModalClose({
          closeWithoutAnimation,
          videoId,
        });
        // Reset the router path to the default path
        modalState === modalStateActions.DETAIL_MODAL && resetRouteQuery();
        // Remove the preview modal's box shadow
        modalRef.current && (modalRef.current.style.boxShadow = "none");
        // Reset the document body styles if preview modal is a detail modal
        closeAll &&
          modalState === modalStateActions.DETAIL_MODAL &&
          (document.body.style.overflowY = "");
      });
    },
    [modalState, videoId, resetRouteQuery]
  );

  /**
   * Determine if the cursor is within an element's bounding rect
   * @param {Object} pageX
   * @param {Object} pageY
   * @param {Object} rect
   */
  const isInsideRect = (pageX, pageY, rect) => {
    return (
      rect &&
      pageX >= rect.left &&
      pageX <= rect.left + rect.width &&
      pageY >= window.scrollY + rect.top &&
      pageY <= window.scrollY + rect.top + rect.height
    );
  };

  /**
   * While the Preview Modal is open, get latest titleCardRect values when the cursor moves.
   * Close the the modal when the cursor leaves the modal. This is helpful in the case
   * the modal gets stuck in the open position.
   * @param {Object} MouseEvent
   */
  const handleOnMouseMove = useCallback(
    (e) => {
      let modal,
        pageX = e.pageX,
        pageY = e.pageY;
      animationState !== animationStateActions.OPEN_MINI_MODAL ||
        willClose ||
        (titleCardRect &&
          (isInsideRect(pageX, pageY, titleCardRect) ||
            isInsideRect(
              pageX,
              pageY,
              (modal = modalRef.current) === null || modal === undefined
                ? undefined
                : modal.getBoundingClientRect()
            ) ||
            handleExit()),
        window.removeEventListener("mousemove", handleOnMouseMove));
    },
    [animationState, modalRef, willClose, handleExit, titleCardRect]
  );

  /**
   * Trigger the modal to close when the close button is clicked
   * @param {Object} e
   */
  const onCloseClick = (e) => {
    e && e.stopPropagation();
    handleCloseModal();
  };

  /**
   *	Trigger the modal to close when the close button is focused and the user clicks the enter key
   * @param {Object} e
   */
  const onCloseKeyDown = (e) => {
    e.stopPropagation();
    e.key === "Enter" && handleCloseModal({ closeAll: true });
  };

  /**
   * Manage how the modal is closed based on its current state
   */
  const handleExit = useCallback(() => {
    switch (modalState) {
      case modalStateActions.MINI_MODAL: {
        handleCloseModal();
      }
    }
  }, [modalState, handleCloseModal]);

  /**
   * Get the detail modal's computed width
   * @returns {Object}
   */
  const getDetailModalWidth = () => {
    let clientWidth = document.body.clientWidth,
      width = window.innerWidth - clientWidth,
      minWidth = Math.min(window.innerHeight, clientWidth);
    return clientWidth < baseWidth
      ? 0.98 * minWidth - width
      : Math.max(0.98 * minWidth - width, baseWidth);
  };

  /**
   * Set the detail modal's responsive width
   */
  const setResponsiveDetailModalWidth = () => {
    if (
      modalRef &&
      modalRef.current &&
      modalState === modalStateActions.DETAIL_MODAL
    ) {
      let clientWidth = document.body.clientWidth,
        minWidth = clientWidth < baseWidth ? 0 : baseWidth,
        width = getDetailModalWidth();
      modalRef.current.style.minWidth = `${minWidth}px`;
      modalRef.current.style.width = `${width}px`;
    }
  };

  /**
   * Handle resize actions
   */
  const handleResizeWindow = debounce(
    () => {
      switch (modalState) {
        case modalStateActions.MINI_MODAL: {
          handleCloseModal();
          break;
        }
        case modalStateActions.DETAIL_MODAL: {
          setResponsiveDetailModalWidth();
          break;
        }
      }
    },
    100,
    { leading: true, trailing: true }
  );

  /**
   * Handle when a user minimizes the window or switches to another tab.
   */
  const handleVisibilityChange = useCallback(() => {
    switch (modalState) {
      case modalStateActions.MINI_MODAL: {
        document.hidden && handleCloseModal(); // closeModal();
      }
    }
  }, [modalState, handleCloseModal]);

  /**
   * Close the Preview Modal when pressing the escape key
   * @param {Object} e
   */
  const handleEscKeydown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        handleCloseModal({ closeAll: true });
      }
    },
    [handleCloseModal]
  );

  /**
   * Animate the detail / default modal's mount animation
   */
  const updateToDetailModal = () => {
    if (modalRef.current && !willClose) {
      animationState !== animationStateActions.MOUNT_DETAIL_MODAL &&
        setAnimationState(animationStateActions.MOUNT_DETAIL_MODAL);
      handleRouteChange(modalData?.videoModel?.identifiers);
      updateModalRect();
      window.removeEventListener("mousemove", handleOnMouseMove);
      modalRef.current &&
        modalRect &&
        (modalRef.current.style.top = `${modalRect.top}px`);
      modalRef.current.style.boxShadow =
        !titleCardRect && modalState === modalStateActions.DETAIL_MODAL
          ? ""
          : "0 3px 10px rgba(0, 0, 0, 0.75)";
      setDetailModalParentStyles();
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  };

  /**
   * Animate the mini modal's mount animation
   */
  const updateToMiniModal = () => {
    if (modalRef.current && !willClose) {
      const modalWidth = Math.round(titleCardRect?.width * scaleFactor);
      (modalRef.current.style.width = `${modalWidth}px`),
        disableTooltips(),
        (animationFrameId.current = requestAnimationFrame(() => {
          updateModalRect(),
            (animationFrameId.current = requestAnimationFrame(() => {
              (animationFrameId.current = 0),
                setAnimationState(animationStateActions.RESET_MINI_MODAL);
            }));
        }));
    }
  };

  /**
   * Manage event listeners
   */
  useLayoutEffect(() => {
    // Event listeners to handle visibility changes, resizing, and key presses
    switch (
      (document.addEventListener("visibilitychange", handleVisibilityChange),
      window.addEventListener("resize", handleResizeWindow),
      window.addEventListener("keydown", handleEscKeydown),
      modalState)
    ) {
      case modalStateActions.MINI_MODAL: {
        window.addEventListener("mousemove", handleOnMouseMove);
      }
    }
    // Cleanup event listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", handleOnMouseMove);
      window.removeEventListener("resize", handleResizeWindow);
      window.removeEventListener("keydown", handleEscKeydown);
    };
  }, [
    handleVisibilityChange,
    handleResizeWindow,
    handleEscKeydown,
    handleOnMouseMove,
    modalState,
  ]);

  /**
   * Manage preview modal's state transitions
   */
  useLayoutEffect(() => {
    // Open as detail modal
    switch (modalState) {
      case modalStateActions.DETAIL_MODAL: {
        updateToDetailModal();
      }
    }
    // Open as mini modal
    if (titleCardRect) {
      switch (modalState) {
        case modalStateActions.MINI_MODAL: {
          updateToMiniModal();
        }
      }
    }
    // Cleanup state and cancel async requests
    return () => {
      // Cancel data fetch request
      cancelRequest();
      // Set `wasOpen` to false
      usePreviewModalStore.getState().setPreviewModalWasOpen(false);
      // Reset timeout id
      cancelAnimationFrame(animationFrameId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  /**
   * Reset detail modal parent layout styles when component unmounts
   */
  useLayoutEffect(() => {
    return () => {
      if (!isPresent) {
        modalState === modalStateActions.DETAIL_MODAL &&
          resetDetailModalParentStyles();
        // Disable watch mode
        isWatchModeEnabled() && disableWatchMode();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent]);

  /**
   * Render the preview modal
   */
  const renderPreviewModal = () => {
    let parentRef = layoutWrapperRef.current.parentNode,
      isMiniModal = modalState === modalStateActions.MINI_MODAL,
      isDetailModal = modalState === modalStateActions.DETAIL_MODAL,
      isDefaultModal = !titleCardRect && isDetailModal,
      showBoxArtOnMount =
        // Mini modal
        (!isDefaultModal &&
          !isDetailModal &&
          !willClose &&
          (isAnimating ||
            animationState !== animationStateActions.OPEN_MINI_MODAL)) ||
        // Detail modal
        (isDetailModal && isDetailAnimating && !titleCardRect && !willClose),
      showBoxArtOnClose = !isDefaultModal && willClose,
      showVideo =
        // Mini modal
        !!(!isAnimating && videoId) ||
        // Detail modal
        !!(!isDetailAnimating && videoId);

    // Render the preview modal
    return (
      <>
        <ModalFocusTrapWrapper
          ref={parentRef}
          active={true}
          paused={false}
          className={`focus-trap preview-modal-wrapper ${
            isDetailModal ? "detail-modal" : "mini-modal"
          }`}
          element="div"
          focusTrapOptions={{
            clickOutsideDeactivates: true,
            delayInitialFocus: true,
            escapeDeactivates: true,
            // fallbackFocus: modalRef.current,
            initialFocus: false,
            // onActivate: () => {},
            // onDeactivate: () => {},
            preventScroll: true,
            returnFocusOnDeactivate: true,
            setReturnFocus: true, // `#slider-${model.rowNum}`
          }}
          tabIndex="-1"
        >
          <Modal
            ref={modalRef}
            aria-modal={true}
            className={`preview-modal-container ${
              isDetailModal ? "detail-modal" : "mini-modal"
            }`}
            data-uia={`preview-modal-container-${modalState}`}
            element={MotionDivWrapper}
            id={modalData?.videoModel?.id}
            {...getAnimationProps()}
            role="dialog"
            tabIndex="-1"
          >
            <PlayerContainer
              ref={mediaButtonsRef}
              className={`player-container ${
                isDetailModal ? "detail-modal" : "mini-modal"
              }`}
              handleWatchNow={handleWatchNow}
              identifiers={modalData?.videoModel?.identifiers}
              imageKey={modalData?.videoModel?.imageKey}
              inMediaList={modalData?.videoModel?.inMediaList}
              isAnimating={isAnimating}
              isLoading={!modalDataError && fetchingModalData}
              isMyListRow={modalData?.videoModel?.isMyListRow}
              isDisliked={modalData?.videoModel?.isDisliked}
              isLiked={modalData?.videoModel?.isLiked}
              isMiniModal={isMiniModal}
              isDetailModal={isDetailModal}
              isDefaultModal={isDefaultModal}
              logos={modalData?.videoModel?.logos}
              modalOpen={isPresent}
              showBoxArtOnMount={showBoxArtOnMount}
              showBoxArtOnClose={showBoxArtOnClose}
              showTitleGradient={isDefaultModal}
              showVideo={showVideo}
              title={modalData?.videoModel?.title}
              videoId={modalData?.videoModel?.videoKey}
              videoModel={{
                ...modalData?.videoModel,
                mutateModalData,
                mutateSliderData,
              }}
              videoPlayback={modalData?.videoPlayback?.start || 0}
            />
            {isDetailModal && (
              <CloseButton onClick={onCloseClick} onKeyDown={onCloseKeyDown} />
            )}
            {isDetailModal ? (
              <DetailInfo
                ref={modalInfoRef}
                key={model.uid}
                cast={modalData?.videoModel?.cast}
                genres={modalData?.videoModel?.genres}
                isLoading={isDetailAnimating && showBoxArtOnClose}
                isMiniModal={isMiniModal}
                isDefaultModal={!titleCardRect && isDetailModal}
                synopsis={modalData?.videoModel?.synopsis}
              />
            ) : (
              <MiniInfo
                key={`${model.uid}-${isOpen}`}
                ref={mediaButtonsRef}
                genres={modalData?.videoModel?.genres}
                handleCloseModal={handleCloseModal}
                handleViewDetails={handleViewDetails}
                handleMetadataAreaClicked={handleMetadataAreaClicked}
                handleWatchNow={handleWatchNow}
                identifiers={modalData?.videoModel?.identifiers}
                inMediaList={modalData?.videoModel?.inMediaList}
                isMyListRow={modalData?.videoModel?.isMyListRow}
                isDisliked={modalData?.videoModel?.isDisliked}
                isLiked={modalData?.videoModel?.isLiked}
                videoModel={{
                  ...modalData?.videoModel,
                  mutateModalData,
                  mutateSliderData,
                }}
              />
            )}
          </Modal>
        </ModalFocusTrapWrapper>
        {modalState === modalStateActions.DETAIL_MODAL ? (
          <ModalOverlay
            ref={parentRef}
            className="preview-modal-backdrop"
            element={MotionDivWrapper}
            inherit={false.toString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{
              opacity: 0,
              transition: {
                opacity: {
                  duration: 0.54,
                  ease: "circOut",
                },
              },
              transitionEnd: {
                display: "none",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCloseModal({ closeAll: true });
            }}
          />
        ) : (
          <></>
        )}
      </>
    );
  };

  /**
   * Render nothing if modal was closed without animation
   */
  if (modalClosedWithoutAnimation()) return null;

  /**
   * Render the preview modal
   */
  return renderPreviewModal();
});

PreviewModal.displayName = "PreviewModal";
export default PreviewModal;
