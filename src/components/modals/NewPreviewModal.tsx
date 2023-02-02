import { usePresence } from "framer-motion";
import produce from "immer";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import {
  forwardRef,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Actions
import { animationStateActions, modalStateActions } from "@/actions/Actions";
// Context
import InteractionContext from "@/context/InteractionContext";
// Lib
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
// Middleware
import usePreviewModalData from "@/middleware/usePreviewModalData";
// Store
import usePreviewModalStore from "@/store/PreviewModalStore";

// Components
import CloseButton from "./detail/CloseButton";
import DetailInfo from "./detail/info/Info";
import MiniInfo from "./mini/info/Info";
import Modal from "./Modal";
import ModalFocusTrapWrapper from "./ModalFocusTrapWrapper";
import ModalOverlay from "./ModalOverlay";
import PlayerContainer from "./PlayerContainer";

type PreviewModalProps = {
  previewModalState: {
    isOpen: boolean;
    modalState: string;
    model: string;
    mutateSliderData: (videoId: number) => void;
    scrollPosition: number;
    titleCardRect: DOMRect;
    videoId: number;
  };
};

const PreviewModal = forwardRef<HTMLDivElement, PreviewModalProps>(
  (props, ref) => {
    const layoutWrapperRef = ref as MutableRefObject<HTMLDivElement>;
    const {
      isWatchModeEnabled,
      enableWatchMode,
      disableWatchMode,
      enableTooltips,
      disableTooltips,
    } = useContext(InteractionContext);

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

    const [isPresent, safeToRemove] = usePresence();

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isDetailAnimating, setIsDetailAnimating] = useState<boolean>(false);
    const [animationState, setAnimationState] = useState<string | null>(
      modalState === modalStateActions.MINI_MODAL
        ? null
        : animationStateActions.MOUNT_DETAIL_MODAL
    );
    const [modalRect, setModalRect] = useState<DOMRect | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);
    const modalInfoRef = useRef<HTMLDivElement>(null);
    const mediaButtonsRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number>(0);
    const willClose = useRef<boolean>(false);

    const {
      modalData,
      fetchingModalData,
      mutateModalData,
      modalDataError,
      cancelRequest,
    } = usePreviewModalData({
      initialData: previewModalState,
    });

    const router = useRouter();

    const scaleFactor = 1.5;
    const baseWidth = 850;

    /**
     * Set willClose to true when the modal is closed
     */
    const setWillClose = (value: boolean) => {
      willClose.current = value;
    };

    /**
     * Redirect to watch mode screen
     */
    const handleWatchNow = ({
      id,
      mediaType,
    }: {
      id: number;
      mediaType: string;
    }) => {
      if (!id || !mediaType) return;
      const pathname = "/watch/[mediaId]";
      const as = `/watch/${mediaType}-${id}`;
      const options = {
        shallow: true,
        scroll: false,
      };
      router.push(
        {
          pathname,
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
    };

    /**
     * Create a route with the modal ID as a parameter.
     * This will act as a dedicated page for link sharing.
     * @param {Object} query
     */
    const updateRoute = ({
      id,
      mediaType,
    }: {
      id: number;
      mediaType: string;
    }) => {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, jbv: id, type: mediaType },
        },
        undefined,
        { shallow: true, scroll: false }
      );
    };

    /**
     * Remove the route query string and set the query state to null
     */
    const resetRoute = useCallback(() => {
      if (isWatchModeEnabled()) return;
      router.push(
        {
          pathname: null,
          query: null,
        },
        undefined,
        { scroll: false }
      );
    }, [isWatchModeEnabled, router]);

    /**
     * Set Detail Modal Parent styles
     */
    const setDetailModalParentStyles = useCallback(() => {
      const layoutRef = layoutWrapperRef.current,
        mainNavigation = document.querySelector(
          ".main-navigation-content"
        ) as HTMLElement,
        mainViewContent = document.querySelector(
          ".main-view-content"
        ) as HTMLElement;
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
     * Reset scroll position on unmount
     */
    const restoreScrollPositionOnUnmount = useCallback(() => {
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
     * Reset detail modal parent styles on unmount
     */
    const resetDetailModalParentStyles = useCallback(() => {
      const layoutRef = layoutWrapperRef.current,
        mainNavigation = document.querySelector(
          ".main-navigation-content"
        ) as HTMLElement,
        mainViewContent = document.querySelector(
          ".main-view-content"
        ) as HTMLElement;
      if (layoutRef && layoutRef.hasAttribute("isDetailModalRootStyleSet")) {
        mainViewContent.classList.remove("has-open-jaw"),
          ((mainNavigation.style = ""),
          (layoutRef.style.top = ""),
          (layoutRef.style.position = "static"),
          restoreScrollPositionOnUnmount(),
          layoutRef.removeAttribute("isDetailModalRootStyleSet"));
      }
    }, [layoutWrapperRef, restoreScrollPositionOnUnmount]);

    /**
     * Get the most updated values for modalRect.
     * This gets called while animating the "open" modal state.
     */

    const updateModalRect = () => {
      modalRef.current &&
        setModalRect(modalRef.current?.getBoundingClientRect());
    };

    /**
     * Compute the framer-motion `variants` for the modal's mini state
     * @returns {Object}
     */
    const getMiniModalAnimationProps = () => {
      /**
       * Mini modal's mounting/reset state.
       * Some of the previous state's values are needed for the next transition.
       */
      function resetMiniModal() {
        // No animation props if conditions aren't met
        if (!modalRect || !modalRef.current || !titleCardRect) return {};
        // Render normally
        let top, left, y;
        const scaleX = 1 / scaleFactor,
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
          let x = 0;
          const leftOffset = titleCardRect.left + window.scrollX,
            widthOffset = (modalRect.width - titleCardRect.width) / 2,
            screenEdgeDistance = leftOffset - widthOffset < 48,
            left =
              document.body.clientWidth -
                (leftOffset + titleCardRect.width + widthOffset) <
              48;
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
       */
      function closeMiniModal() {
        const previewModalStateById =
          usePreviewModalStore.getState().previewModalStateById;
        // Hide modal if closeWithoutAnimation is true
        if (
          previewModalStateById[videoId] !== null &&
          previewModalStateById[videoId] !== undefined &&
          previewModalStateById[videoId]?.closeWithoutAnimation
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
        if (
          !modalRect ||
          !modalRef.current ||
          !titleCardRect ||
          !willClose.current
        )
          return {};
        // Render normally
        const scaleX = 1 / scaleFactor,
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
          transitionEnd: {
            display: "none",
          },
        };
      }
      const variantObj = new Object();
      const miniModalVariants = produce(variantObj, (draft) => {
        draft[animationStateActions.RESET_MINI_MODAL] = {
          ...resetMiniModal(),
        };
        draft[animationStateActions.OPEN_MINI_MODAL] = {
          ...resetMiniModal(),
          ...openMiniModal(),
        };
        draft[animationStateActions.CLOSE_MINI_MODAL] = {
          ...openMiniModal(),
          ...closeMiniModal(),
        };
      });
      // console.log("variants", miniModalVariants);
      return titleCardRect
        ? {
            animate: animationState,
            exit: animationStateActions.CLOSE_MINI_MODAL,
            onAnimationStart: () => {
              setIsAnimating(true);
            },
            onAnimationComplete: (currentAnimationState) => {
              if (
                currentAnimationState ===
                  animationStateActions.RESET_MINI_MODAL &&
                isPresent &&
                !willClose.current
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
            variants: miniModalVariants,
          }
        : {
            exit: {},
          };
    };

    /**
     * Get the animation props for each animation state
     * @returns {Object}
     */
    const getAnimationProps = () => {
      switch (modalState) {
        case modalStateActions.MINI_MODAL: {
          return getMiniModalAnimationProps();
        }
        case modalStateActions.DETAIL_MODAL: {
          return getDetailModalAnimationProps();
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
    //   //   (e && e.stopPropagation(), willClose || updateRoute(modalData?.videoModel?.identifiers););
    //   modalState === modalStateActions.DETAIL_MODAL &&
    //     updateRoute(modalData?.videoModel?.identifiers);
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
      async ({ closeAll = false, closeWithoutAnimation = false } = {}) => {
        // Set willClose to true
        setWillClose(true);
        // Reset timeout id
        animationFrameId.current &&
          cancelAnimationFrame(animationFrameId.current),
          (animationFrameId.current = 0);
        // Set preview modal closed
        usePreviewModalStore.getState().setPreviewModalClose({
          closeWithoutAnimation,
          videoId,
        });
        // Set `wasOpen` true
        usePreviewModalStore.getState().setPreviewModalWasOpen(true);
        // Reset the router path to the default path
        modalState === modalStateActions.DETAIL_MODAL && resetRoute();
        // Remove the preview modal's box shadow
        modalRef.current && (modalRef.current.style.boxShadow = "none");
        // Reset the document body styles if preview modal is a detail modal
        closeAll &&
          modalState === modalStateActions.DETAIL_MODAL &&
          (document.body.style.overflowY = "");
      },
      [modalState, videoId, resetRoute]
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
     * While the Preview Modal is open, get latest titleCardRect values when the cursor moves.
     * Close the the modal when the cursor leaves the modal. This is helpful in the case
     * the modal gets stuck in the open position.
     * @param {Object} MouseEvent
     */
    const handleOnMouseMove = useCallback(
      ({ pageX, pageY }) => {
        // console.log("mouse move ", modalData?.videoModel?.title);
        animationState !== animationStateActions.OPEN_MINI_MODAL ||
          willClose.current ||
          (titleCardRect &&
            (isInsideRect(pageX, pageY, titleCardRect) ||
              isInsideRect(
                pageX,
                pageY,
                modalRef.current == null
                  ? undefined
                  : modalRef.current.getBoundingClientRect()
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
     * Get the detail modal's computed width
     * @returns {Object}
     */
    const getDetailModalWidth = () => {
      const clientWidth = document.body.clientWidth,
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
        const clientWidth = document.body.clientWidth,
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
      if (modalRef.current && !willClose.current) {
        animationState !== animationStateActions.MOUNT_DETAIL_MODAL &&
          setAnimationState(animationStateActions.MOUNT_DETAIL_MODAL);
        updateRoute(modalData?.videoModel?.identifiers);
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
      if (modalRef.current && !willClose.current) {
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
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalState, titleCardRect]);

    /**
     * Remove of the preview modal from the react tree (explicitly)
     * Reset detail modal parent layout styles
     */
    useEffect(() => {
      if (!isPresent) {
        setTimeout(() => {
          // Remove from the react tree
          safeToRemove();
          // Set preview modal `wasOpen` false
          usePreviewModalStore.getState().setPreviewModalWasOpen(false);
        }, 0);
        // Cleanup
        return () => {
          // Cancel pending requests
          cancelRequest();
          // Remove detail modal parent styles
          modalState === modalStateActions.DETAIL_MODAL &&
            resetDetailModalParentStyles();
          // Disable watch mode
          isWatchModeEnabled() && disableWatchMode();
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresent]);

    /**
     * Render the preview modal
     */
    const renderPreviewModal = () => {
      const parentRef = layoutWrapperRef.current.parentNode,
        isMiniModal = modalState === modalStateActions.MINI_MODAL,
        isDetailModal = modalState === modalStateActions.DETAIL_MODAL,
        isDefaultModal = !titleCardRect && isDetailModal,
        showBoxArtOnMount =
          // Mini modal
          (!isDefaultModal &&
            !isDetailModal &&
            !willClose.current &&
            (isAnimating ||
              animationState !== animationStateActions.OPEN_MINI_MODAL)) ||
          // Detail modal
          (isDetailModal &&
            isDetailAnimating &&
            !titleCardRect &&
            !willClose.current),
        showBoxArtOnClose = !isDefaultModal && willClose.current,
        showVideo =
          // Mini modal
          !!(!isAnimating && videoId) ||
          // Detail modal
          !!(!isDetailAnimating && videoId);
      // Render the preview modal
      return (
        <>
          <ModalFocusTrapWrapper
            ref={layoutWrapperRef}
            active={true}
            className={`focus-trap preview-modal-wrapper ${
              isDetailModal ? "detail-modal" : "mini-modal"
            }`}
            element="div"
            focusTrapOptions={{
              clickOutsideDeactivates: true,
              delayInitialFocus: true,
              escapeDeactivates: true,
              initialFocus: false,
              preventScroll: true,
              returnFocusOnDeactivate: true,
              setReturnFocus: true,
            }}
            tabIndex={-1}
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
              tabIndex={-1}
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
                willClose={willClose.current || !isPresent}
                videoPlayback={modalData?.videoPlayback?.start || 0}
              />
              {isDetailModal && (
                <CloseButton
                  onClick={onCloseClick}
                  onKeyDown={onCloseKeyDown}
                />
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
              ref={layoutWrapperRef}
              className="preview-modal-backdrop"
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
          ) : (
            <></>
          )}
        </>
      );
    };

    /**
     * Render the preview modal
     */
    return renderPreviewModal();
  }
);

export default PreviewModal;

// function usePreviewModal() {
//   //
// }