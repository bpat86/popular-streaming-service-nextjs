import {
  forwardRef,
  useLayoutEffect,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { flushSync } from "react-dom";
import { useIsPresent } from "framer-motion";
import debounce from "lodash.debounce";
// Lib
import { MotionDivWrapper } from "lib/MotionDivWrapper";
// Components
import Modal from "./Modal";
import ModalOverlay from "./ModalOverlay";
import ModalFocusTrapWrapper from "./ModalFocusTrapWrapper";
import PlayerContainer from "./PlayerContainer";
import MiniInfo from "./mini/info/Info";
import DetailInfo from "./detail/info/Info";
import CloseButton from "./detail/CloseButton";
// Context
import InteractionContext from "@/context/InteractionContext";
// Reducers
import usePreviewModal from "@/middleware/usePreviewModal";

const PreviewModal = forwardRef((props, layoutWrapperRef) => {
  /** Props */
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
  /** Context */
  const {
    resetRouteQuery,
    isWatchModeEnabled,
    disableWatchMode,
    enableTooltips,
    disableTooltips,
    modalStateActions,
    animationStateActions,
    handleWatchNow,
    handleRouteChange,
    previewModalStateById,
    updatePreviewModalState,
    setPreviewModalClose,
    setPreviewModalWasOpen,
  } = useContext(InteractionContext);

  /** Framer motion utility */
  const isPresent = useIsPresent();

  /** State */
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDetailAnimating, setIsDetailAnimating] = useState(false);
  const [animationState, setAnimationState] = useState(
    modalState === modalStateActions.MINI_MODAL
      ? undefined
      : animationStateActions.MOUNT_DETAIL_MODAL
  );
  const [modalRect, setModalRect] = useState(undefined);
  const [willClose, setWillClose] = useState(false);

  /** Refs */
  const modalRef = useRef();
  const modalInfoRef = useRef();
  const mediaButtonsRef = useRef();
  const animationFrameId = useRef(0);

  /** Modal data */
  const {
    modalData,
    fetchingModalData,
    mutateModalData,
    modalDataError,
    cancelRequest,
  } = usePreviewModal({
    initialData: previewModalState,
  });

  /** Preview modal base attributes */
  const scaleFactor = 1.5;
  const baseWidth = 850;

  /**
   * Determine if this modal is set to close without animation
   * @returns {Boolean}
   */
  const modalClosedWithoutAnimation = () => {
    const modal = previewModalStateById[videoId];
    return modal !== null && modal !== undefined && modal.closeWithoutAnimation;
  };

  /**
   * Set Detail Modal Parent styles
   */
  const setDetailModalParentStyles = () => {
    let layoutRef = layoutWrapperRef.current,
      mainNavigation = document.querySelector(".main-navigation-content"),
      mainViewContent = document.querySelector(".main-view-content");
    if (layoutRef) {
      if (layoutRef.hasAttribute("isDetailModalRootStyleSet")) return;
      const scrollPos =
        (previewModalState == null ? undefined : scrollPosition) ||
        window.scrollY;
      window.scrollTo(0, scrollPos),
        updatePreviewModalState({
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
  };

  /**
   * Reset detail modal parent styles on unmount
   */
  const resetDetailModalParentStyles = () => {
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
  };

  /**
   * Reset scroll position on unmount
   */
  const resetScrollPositionOnUnmount = () => {
    const scrollPos = previewModalState;
    window.scrollTo(
      0,
      (null == scrollPos ? undefined : scrollPos.scrollPosition) || 0
    );
    updatePreviewModalState({
      scrollPosition: undefined,
    });
  };

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
      // Hide modal if closeWithoutAnimation is true
      const modal = previewModalStateById[videoId];
      if (
        modal !== null &&
        modal !== undefined &&
        modal.closeWithoutAnimation
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
          onAnimationStart: (definition) => {
            // console.log("onAnimationStart: ", definition);
            setIsAnimating(true);
          },
          onAnimationComplete: (definition) => {
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
      const modal = previewModalStateById[videoId];
      // If modal is to close without animation
      if (modal !== null && modal !== undefined && modal.closeWithoutAnimation)
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
      onAnimationStart: (definition) => {
        setIsDetailAnimating(true);
        disableTooltips();
      },
      onAnimationComplete: (definition) => {
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
        return miniModalAnimationProps();
      }
      case modalStateActions.DETAIL_MODAL: {
        return detailModalAnimationProps();
      }
      default: {
        throw new Error("Invalid modal state");
      }
    }
  };

  /**
   * Expand the mini modal to the detail modal and update the router path
   * @param {Object} e
   */
  const handleExpandModal = (e) => {
    // modalState !== modalStateActions.DETAIL_MODAL &&
    //   (e && e.stopPropagation(), willClose || updateRoute());
    modalState === modalStateActions.DETAIL_MODAL && updateRoute();
  };

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
  const handleViewDetails = (e) => {
    updatePreviewModalState({
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
  const handleCloseModal = ({ closeAll, closeWithoutAnimation } = {}) => {
    flushSync(() => {
      // set willClose true
      setWillClose(true);
      // Reset timeout id
      animationFrameId.current &&
        cancelAnimationFrame(animationFrameId.current),
        (animationFrameId.current = 0);
      // Set wasOpen true
      setPreviewModalWasOpen(true);
      // Set preview modal closed
      setPreviewModalClose({
        closeWithoutAnimation,
        videoId,
      });
      // Reset the router path to the default path
      resetRouteQuery();
      // Remove the preview modal's box shadow
      modalRef.current && (modalRef.current.style.boxShadow = "none");
      // Reset the document body styles
      closeAll &&
        modalState === modalStateActions.DETAIL_MODAL &&
        (document.body.style.overflowY = "");
    });
  };

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
      // console.log(
      //   `previewModal handleMouseMove function: ${model?.videoModel?.title} isPresent - ${isPresent}`
      // );
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
    [animationState, modalState, modalRef, titleCardRect, willClose]
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
  const handleExit = () => {
    switch (modalState) {
      case modalStateActions.MINI_MODAL: {
        handleCloseModal();
      }
    }
  };

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
  const handleResizeWindow = useCallback(
    debounce(
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
    ),
    [modalState]
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
  }, [modalState]);

  /**
   * Close the Preview Modal when pressing the escape key
   * @param {Object} e
   */
  const handleEscKeydown = useCallback((e) => {
    if (e.key === "Escape") {
      handleCloseModal({ closeAll: true });
    }
  }, []);

  /**
   * Update the route when detail modal is open
   */
  const updateRoute = () => {
    handleRouteChange(modalData?.videoModel?.identifiers);
  };

  /**
   * Animate the detail / default modal's mount animation
   */
  const updateToDetailModal = () => {
    if (modalRef.current && !willClose) {
      animationState !== animationStateActions.MOUNT_DETAIL_MODAL &&
        setAnimationState(animationStateActions.MOUNT_DETAIL_MODAL);
      updateRoute();
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
      const modalWidth = Math.round(titleCardRect.width * scaleFactor);
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
  ]);

  /**
   * Manage preview modal's state transitions
   */
  useLayoutEffect(() => {
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
      setPreviewModalWasOpen(false);
      // Set Preview Modal closed
      setPreviewModalClose({ videoId });
      // Reset timeout id
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

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
    return [
      <ModalFocusTrapWrapper
        key={`${model.uid}-${isOpen}`}
        ref={parentRef}
        active={true}
        paused={false}
        className={`focus-trap preview-modal-wrapper ${
          isDetailModal ? "detail-modal" : "mini-modal"
        }`}
        element={"div"}
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
      </ModalFocusTrapWrapper>,
      modalState === modalStateActions.DETAIL_MODAL && (
        <ModalOverlay
          ref={parentRef}
          key={modalState === modalStateActions.DETAIL_MODAL}
          className={`preview-modal-backdrop`}
          element={MotionDivWrapper}
          inherit={false}
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
      ),
    ];
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
