import {
  cloneElement,
  forwardRef,
  useLayoutEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
// Lib
import { AnimatePresenceWrapper } from "lib/AnimatePresenceWrapper";
import { MotionDivWrapper } from "lib/MotionDivWrapper";
// Components
import PreviewModal from "./PreviewModal";
import ModalOverlay from "./ModalOverlay";
// Context
import InteractionContext from "@/context/InteractionContext";

const PreviewModalContainer = forwardRef((props, layoutWrapperRef) => {
  const { children, mutateSliderData } = props;
  /** Context */
  const {
    modalStateActions,
    previewModalStateById,
    isPreviewModalOpen,
    setPreviewModalOpen,
    setPreviewModalClose,
    updatePreviewModalState,
    getVideoId,
    router,
  } = useContext(InteractionContext);

  /**
   *
   * @returns {boolean}
   */
  const isJBVRoute = () => {
    const jbv = router.query.jbv;
    return !!jbv && !Number.isNaN(jbv);
  };

  /**
   *
   * @returns {Object}
   */
  const getPageProps = () => {
    let jbv = router.query.jbv,
      pageProps = {};
    return jbv && (pageProps.jbVideoId = jbv), pageProps;
  };

  /**
   * Close all preview modals
   */
  const closeAllModals = () => {
    Object.values(previewModalStateById)
      .filter((openModals) => openModals.isOpen)
      .forEach((openModal) => {
        const videoId = openModal.videoId;
        closeModal(videoId);
      });
  };

  /**
   * Close the preview modal
   */
  const closeModal = (videoId) => {
    let queued = previewModalStateById,
      openModal = (undefined === queued ? {} : queued)[videoId];
    setPreviewModalClose({
      ...openModal,
      closeWithoutAnimation: openModal.closeWithoutAnimation,
      videoId: videoId,
    });
    openModal.onPreviewModalClose && openModal.onPreviewModalClose();
  };

  /**
   * Open a preview modal on page load if there is a jbv query param
   */
  const handleUpdatePreviewModalState = () => {
    let queued = previewModalStateById,
      videoId = getVideoId();
    if (isJBVRoute() && !isPreviewModalOpen(videoId)) {
      if ((closeAllModals(), Number.isNaN(videoId))) return;
      setPreviewModalOpen({
        listContext: undefined,
        modalState: modalStateActions.DETAIL_MODAL,
        animationContext: modalStateActions.DETAIL_MODAL,
        queryData: {
          uid: router.query.jbv,
          id: router.query.jbv,
          mediaType: router.query.type,
        },
        scrollPosition: window.scrollY,
        titleCardId: undefined,
        titleCardRect: undefined,
        videoPlayback: undefined,
        model: {
          uid: router.query.jbv,
          id: router.query.jbv,
          mediaType: router.query.type,
          videoModel: {
            listContext: undefined,
            id: router.query.jbv,
            identifiers: {
              uid: router.query.jbv,
              id: router.query.jbv,
              mediaType: router.query.type,
            },
            mediaType: router.query.type,
            rankNum: undefined,
            rect: undefined,
            rowNum: undefined,
            scrollPosition: window.scrollY,
            titleCardId: undefined,
            titleCardRef: undefined,
          },
        },
        titleCardId: undefined,
        titleCardRect: undefined,
        videoId: router.query.jbv,
        videoModel: {
          listContext: undefined,
          id: router.query.jbv,
          identifiers: {
            uid: router.query.jbv,
            id: router.query.jbv,
            mediaType: router.query.type,
          },
          mediaType: router.query.type,
          rankNum: undefined,
          rect: undefined,
          rowNum: undefined,
          scrollPosition: window.scrollY,
          titleCardId: undefined,
          titleCardRef: undefined,
        },
      });
    } else {
      isJBVRoute() &&
      [modalStateActions.MINI_MODAL].includes(queued[getVideoId()]?.modalState)
        ? (Object.values(queued)
            .filter((queuedModal) => {
              return (
                queuedModal.videoId &&
                queuedModal.videoId !== videoId &&
                queuedModal.modalState === modalStateActions.DETAIL_MODAL
              );
            })
            .forEach((openModal) => {
              const videoId = openModal.videoId;
              closeModal(videoId);
            }),
          updatePreviewModalState({
            individualState: {
              videoId: getVideoId(),
              modalState: modalStateActions.DETAIL_MODAL,
              titleCardId: undefined,
              titleCardRect: undefined,
            },
          }))
        : Object.values(queued).some((queuedModal) => {
            return (
              queuedModal.isOpen &&
              queuedModal.modalState === modalStateActions.DETAIL_MODAL
            );
          }) &&
          !isJBVRoute() &&
          closeAllModals();
    }
  };

  /**
   * Update preview modal state
   */
  useLayoutEffect(() => {
    handleUpdatePreviewModalState();
  }, []);

  /**
   * Determine if mini preview modal is open
   */
  const isMiniModal = () => {
    return Object.values(previewModalStateById).some((modal) => {
      return (
        !modal.closeWithoutAnimation &&
        modal.isOpen &&
        modal.modalState === modalStateActions.MINI_MODAL
      );
    });
  };

  /**
   * Render mini preview modal
   */
  const renderMiniModal = () => {
    return Object.values(previewModalStateById)
      .filter(({ closeWithoutAnimation, isOpen, modalState }) => {
        return (
          !closeWithoutAnimation &&
          isOpen &&
          modalState === modalStateActions.MINI_MODAL
        );
      })
      .map(renderPreviewModal);
  };

  /**
   * Render detail preview modal
   */
  const renderDetailModal = () => {
    const modal = Object.values(previewModalStateById).find(
      ({ closeWithoutAnimation, isOpen, modalState }) => {
        return (
          !closeWithoutAnimation &&
          isOpen &&
          modalState === modalStateActions.DETAIL_MODAL
        );
      }
    );
    return (
      modal?.modalState === modalStateActions.DETAIL_MODAL &&
      renderPreviewModal(modal)
    );
  };

  /**
   * Render gallery preview modal
   */
  const renderGalleryModal = () => {
    const galleryModal = !isJBVRoute() && children;
    return galleryModal && cloneElement(children);
  };

  /**
   * Render the preview modal component
   * @returns {JSX.Element}
   */
  const renderPreviewModal = (modal) => {
    const {
      isOpen,
      modalState,
      model: { uid },
      videoId,
      videoModel,
    } = modal;
    // A preview modal should only render if `isOpen` is true
    if (!isOpen || !modal || !videoId || !uid || !videoModel) return null;
    // Render the preview modal
    return (
      <PreviewModal
        key={`${uid}-${isOpen}`}
        ref={layoutWrapperRef}
        modalState={modalState}
        previewModalState={{
          ...modal,
          mutateSliderData,
        }}
      />
    );
  };

  /**
   * Render Framer Motion AnimatePresence Component
   * @returns {JSX.Element}
   */
  return (
    <AnimatePresenceWrapper
      custom={{
        previewModalStateById,
        undefined: {},
      }}
      mode={isMiniModal() ? "wait" : "sync"}
    >
      {[
        // Mini modal
        renderMiniModal(),
        // Detail modal
        renderDetailModal(),
        // Gallery modal
        renderGalleryModal(),
      ]}
    </AnimatePresenceWrapper>
  );
});

PreviewModalContainer.displayName = "PreviewModalContainer";
export default PreviewModalContainer;
