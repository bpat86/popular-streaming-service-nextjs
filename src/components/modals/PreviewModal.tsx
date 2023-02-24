import { usePresence } from "framer-motion";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import {
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

import { animationStateActions, modalStateActions } from "@/actions/Actions";
import InteractionContext from "@/context/InteractionContext";
import clsxm from "@/lib/clsxm";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IMedia } from "@/middleware/types";
import usePreviewModal from "@/middleware/usePreviewModal";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { IPreviewModal, PreviewModalStore } from "@/store/types";

import CloseButton from "./detail/CloseButton";
import DetailInfo from "./detail/info/Info";
import MiniInfo from "./mini/info/Info";
import Modal from "./Modal";
import ModalFocusTrapWrapper from "./ModalFocusTrapWrapper";
import ModalOverlay from "./ModalOverlay";
import PlayerContainer from "./PlayerContainer";

type PreviewModalProps = {
  previewModalState: {
    isOpen?: IPreviewModal["isOpen"];
    modalState?: IPreviewModal["modalState"];
    model?: IPreviewModal["model"];
    mutateSliderData?: IMedia["mutateMedia"];
    scrollPosition?: PreviewModalStore["scrollPosition"];
    titleCardRect?: IPreviewModal["titleCardRect"];
    videoId?: IPreviewModal["videoId"];
  };
};

const PreviewModal = forwardRef<HTMLDivElement, PreviewModalProps>(
  (
    {
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
    },
    ref
  ) => {
    const layoutWrapperRef = ref as MutableRefObject<HTMLDivElement | null>;
    const {
      isWatchModeEnabled,
      enableWatchMode,
      disableWatchMode,
      enableTooltips,
      disableTooltips,
    } = useContext(InteractionContext);

    const [isPresent, safeToRemove] = usePresence();

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isDetailAnimating, setIsDetailAnimating] = useState<boolean>(false);
    const [animationState, setAnimationState] = useState<string | undefined>(
      modalState === modalStateActions.MINI_MODAL
        ? undefined
        : animationStateActions.MOUNT_DETAIL_MODAL
    );
    const [modalRect, setModalRect] = useState<DOMRect | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInfoRef = useRef<HTMLDivElement>(null);
    const mediaButtonsRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const timerId = useRef<number | null>(null);
    // const willClose = useRef<boolean>(false);
    const [willClose, setWillClose] = useState<boolean>(false);
    const {
      modalData,
      fetchingModalData,
      mutateModalData,
      modalDataError,
      cancelRequest,
    } = usePreviewModal({
      initialData: previewModalState,
    });

    const router = useRouter();

    const scaleFactor = 1.5;
    const baseWidth = 850;

    /**
     * Set willClose to true when the modal is closed
     */
    // const setWillClose = (value: boolean) => {
    //   willClose = value;
    // };

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
    const setDetailModalParentStyles = () => {
      const layoutRef = layoutWrapperRef.current;
      const mainViewContent = document.querySelector(
        ".main-view-content"
      ) as HTMLDivElement;
      if (layoutRef) {
        if (layoutRef.hasAttribute("isDetailModalRootStyleSet")) return;
        const scrollPos =
          (previewModalState === undefined ? undefined : scrollPosition) ||
          window.scrollY;
        window.scrollTo(0, scrollPos),
          usePreviewModalStore.getState().updatePreviewModalState({
            scrollPosition: scrollPos,
          }),
          mainViewContent?.classList.add("has-open-jaw"),
          (layoutRef.style.top = `-${scrollPos}px`),
          (layoutRef.style.position = "fixed"),
          layoutRef.setAttribute("isDetailModalRootStyleSet", "true");
      }
    };

    /**
     * Reset scroll position on unmount
     */
    const restoreScrollPositionOnUnmount = () => {
      window.scrollTo(
        0,
        (null == previewModalState
          ? undefined
          : previewModalState.scrollPosition) || 0
      );
      usePreviewModalStore.getState().updatePreviewModalState({
        scrollPosition: undefined,
      });
    };

    /**
     * Reset detail modal parent styles on unmount
     */
    const resetDetailModalParentStyles = () => {
      const layoutRef = layoutWrapperRef.current;
      const mainViewContent = document.querySelector(
        ".main-view-content"
      ) as HTMLDivElement;
      if (layoutRef && layoutRef.hasAttribute("isDetailModalRootStyleSet")) {
        mainViewContent.classList.remove("has-open-jaw"),
          ((layoutRef.style.top = ""),
          (layoutRef.style.position = "static"),
          restoreScrollPositionOnUnmount(),
          layoutRef.removeAttribute("isDetailModalRootStyleSet"));
      }
    };

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
        const scaleX = 1 / scaleFactor,
          scaleY = 1 / scaleFactor,
          leftOffset = titleCardRect.left + window.scrollX,
          topOffset = titleCardRect.top + (scrollPosition ?? window.scrollY),
          titleCardRectHeight = titleCardRect.height;
        let top, left, y;
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
          const leftOffset = titleCardRect.left + window.scrollX,
            widthOffset = (modalRect.width - titleCardRect.width) / 2,
            screenEdgeDistance = leftOffset - widthOffset < 60,
            left =
              document.body.clientWidth -
                (leftOffset + titleCardRect.width + widthOffset) <
              48;
          let x = 0;
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
          previewModalStateById &&
          previewModalStateById[videoId as keyof IPreviewModal] !== null &&
          previewModalStateById[videoId as keyof IPreviewModal] !== undefined &&
          previewModalStateById[videoId as keyof IPreviewModal]
            ?.closeWithoutAnimation
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
        };
      }
      // Mini modal's animation states
      const miniModalVariants = {
        [animationStateActions.RESET_MINI_MODAL]: resetMiniModal(),
        [animationStateActions.OPEN_MINI_MODAL]: {
          ...resetMiniModal(),
          ...openMiniModal(),
        },
        [animationStateActions.CLOSE_MINI_MODAL]: {
          ...openMiniModal(),
          ...closeMiniModal(),
        },
      };
      // console.log("variants", miniModalVariants);
      return titleCardRect
        ? {
            animate: animationState,
            exit: animationStateActions.CLOSE_MINI_MODAL,
            onAnimationStart: () => {
              setIsAnimating(true);
              // disableTooltips();
            },
            onAnimationComplete: (
              currentAnimationState: (typeof animationStateActions)[keyof typeof animationStateActions]
            ) => {
              if (
                currentAnimationState ===
                  animationStateActions.RESET_MINI_MODAL &&
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
            variants: miniModalVariants,
          }
        : {
            exit: {},
          };
    };

    /**
     * Compute the framer-motion `variants` for the modal's detail state
     */
    const getDetailModalAnimationProps = () => {
      /**
       * Detail modal's mounting state.
       * Some of the previous state's values are neededfor the next transition.
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
        const scaleX = modalRect.width / width,
          scaleY = modalRect.width / width,
          top = modalRect.top;
        x =
          modalRect.left + modalRect.width / 2 - document.body.clientWidth / 2;
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
       */
      function closeDetailModal() {
        const previewModalStateById =
          usePreviewModalStore.getState().previewModalStateById;
        // If modal is to close without animation
        if (
          previewModalStateById &&
          previewModalStateById[videoId as keyof IPreviewModal] !== null &&
          previewModalStateById[videoId as keyof IPreviewModal] !== undefined &&
          previewModalStateById[videoId as keyof IPreviewModal]
            .closeWithoutAnimation
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
            transitionEnd: {
              display: "none",
            },
          };
        }

        const width = getDetailModalWidth(),
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
          transitionEnd: {
            display: "none",
          },
        };
      }
      // Detail modal's animation states
      const detailModalVariants = {
        [animationStateActions.MOUNT_DETAIL_MODAL]: {
          ...mountDetailModal(),
        },
        [animationStateActions.OPEN_DETAIL_MODAL]: {
          ...mountDetailModal(),
          ...openDetailModal(),
        },
        [animationStateActions.CLOSE_DETAIL_MODAL]: {
          ...openDetailModal(),
          ...closeDetailModal(),
        },
      };
      // console.log("variants", detailModalVariants);
      return {
        initial: false,
        animate: animationState,
        exit: animationStateActions.CLOSE_DETAIL_MODAL,
        onAnimationStart: () => {
          setIsDetailAnimating(true);
          disableTooltips();
        },
        onAnimationComplete: (
          currentAnimationState: (typeof animationStateActions)[keyof typeof animationStateActions]
        ) => {
          if (
            currentAnimationState === animationStateActions.MOUNT_DETAIL_MODAL
          )
            flushSync(() => {
              return (
                window.scrollTo(0, 0),
                setAnimationState(animationStateActions.OPEN_DETAIL_MODAL),
                currentAnimationState ===
                  animationStateActions.OPEN_DETAIL_MODAL &&
                  setResponsiveDetailModalWidth()
              );
            });
          setIsDetailAnimating(false);
          enableTooltips();
        },
        variants: detailModalVariants,
      };
    };

    /**
     * Get the animation props for each animation state
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
          return {};
        }
      }
    };

    /**
     * Expand the mini modal to the detail modal and update the router path
     */
    // const handleExpandModal = (e) => {
    //   // modalState !== modalStateActions.DETAIL_MODAL &&
    //   //   (e && e.stopPropagation(), willClose || updateRoute(modalData?.videoModel?.identifiers););
    //   modalState === modalStateActions.DETAIL_MODAL &&
    //     updateRoute(modalData?.videoModel?.identifiers);
    // };

    /**
     * Expand the mini modal to the detail modal when the user clicks the area between the buttons
     */
    const handleMetadataAreaClicked = (e: MouseEvent<HTMLDivElement>) => {
      const button = e.target as HTMLButtonElement;
      button.closest("button")
        ? button.closest("[data-uia=expand-to-detail-button]") ||
          e.preventDefault()
        : handleViewDetails();
    };

    /**
     * Update the modal state to the default / detail preview modal view
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
          // Remove the preview modal's box shadow
          modalRef.current && (modalRef.current.style.boxShadow = "none");
          // Reset the document body styles if preview modal is a detail modal
          closeAll &&
            modalState === modalStateActions.DETAIL_MODAL &&
            (document.body.style.overflowY = "");
        });
      },
      [modalState, videoId]
    );

    /**
     * Determine if the cursor is within an element's bounding rect
     */
    const isInsideRect = (
      pageX: number,
      pageY: number,
      rect: DOMRect | undefined
    ) => {
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
      ({ pageX, pageY }: { pageX: number; pageY: number }) => {
        // console.log("mouse move ", modalData?.videoModel?.title);
        animationState !== animationStateActions.OPEN_MINI_MODAL ||
          willClose ||
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
      [animationState, willClose, titleCardRect, handleExit]
    );

    /**
     * Trigger the modal to close when the close button is clicked
     */
    const onCloseClick = (e: MouseEvent<HTMLDivElement>) => {
      e && e.stopPropagation();
      handleCloseModal();
    };

    /**
     * Trigger the modal to close when the close button is focused and the user clicks the enter key
     */
    const onCloseKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      e.key === "Enter" && handleCloseModal({ closeAll: true });
    };

    /**
     * Get the detail modal's computed width
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
    const setResponsiveDetailModalWidth = useCallback(() => {
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
    }, [modalRef, modalState, baseWidth]);

    /**
     * Handle resize actions
     */
    const handleResizeWindow = debounce(
      useCallback(() => {
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
      }, [modalState, handleCloseModal, setResponsiveDetailModalWidth]),
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
     */

    const handleEscKeydown = useCallback(
      ({ key }: { key: string }) => {
        if (key === "Escape") {
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
      if (modalRef.current && titleCardRect && !willClose) {
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

    // Cleanup
    useLayoutEffect(() => {
      if (!isPresent) {
        !timerId.current &&
          (timerId.current = window.setTimeout(() => {
            // Remove preview modal from the react tree
            safeToRemove();
            // Set was open state to false
            usePreviewModalStore
              .getState()
              .setPreviewModalWasOpen({ wasOpen: false });
          }, 0));
        // Cleanup
        return () => {
          // Cancel pending timeouts
          timerId.current && clearTimeout(timerId.current),
            (timerId.current = null);
          // Cancel pending requests
          cancelRequest();
          // Remove detail modal parent styles
          modalState === modalStateActions.DETAIL_MODAL &&
            resetDetailModalParentStyles();
          // Reset the router path to the default path
          modalState === modalStateActions.DETAIL_MODAL && resetRoute();
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
      const isMiniModal = modalState === modalStateActions.MINI_MODAL,
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
            ref={layoutWrapperRef}
            active={true}
            className={clsxm("focus-trap preview-modal-wrapper", [
              isDetailModal ? "detail-modal" : "mini-modal",
            ])}
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
              className={clsxm("preview-modal-container", [
                isDetailModal ? "detail-modal" : "mini-modal",
              ])}
              data-uia={`preview-modal-container-${modalState}`}
              element={MotionDivWrapper}
              id={modalData?.videoModel?.id}
              role="dialog"
              tabIndex={-1}
              {...getAnimationProps()}
            >
              <PlayerContainer
                ref={mediaButtonsRef}
                className={clsxm("player-container", [
                  isDetailModal ? "detail-modal" : "mini-modal",
                ])}
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
                willClose={willClose || !isPresent}
                videoPlayback={modalData?.videoPlayback?.start || 0}
              />
              {isDetailModal && (
                <CloseButton
                  onClick={onCloseClick}
                  onKeyDown={onCloseKeyDown}
                />
              )}
              {isDetailModal && model ? (
                <DetailInfo
                  ref={modalInfoRef}
                  key={`${model.uid}`}
                  cast={modalData?.videoModel?.cast}
                  crew={modalData?.videoModel?.crew}
                  genres={modalData?.videoModel?.genres}
                  isLoading={
                    (!modalDataError && fetchingModalData) ||
                    (isDetailAnimating && showBoxArtOnClose)
                  }
                  // isMiniModal={isMiniModal}
                  isDefaultModal={!titleCardRect && isDetailModal}
                  synopsis={modalData?.videoModel?.synopsis}
                />
              ) : (
                model && (
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
                    isLoading={!modalDataError && fetchingModalData}
                    isLiked={modalData?.videoModel?.isLiked}
                    videoModel={{
                      ...modalData?.videoModel,
                      mutateModalData,
                      mutateSliderData,
                    }}
                  />
                )
              )}
            </Modal>
          </ModalFocusTrapWrapper>
          {modalState === modalStateActions.DETAIL_MODAL && (
            <ModalOverlay
              ref={layoutWrapperRef}
              className="preview-modal-backdrop"
              as={MotionDivWrapper}
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
