import { useRouter } from "next/router";
import { cloneElement, forwardRef, useCallback, useLayoutEffect } from "react";
import shallow from "zustand/shallow";

// Lib
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";

// Actions
import { modalStateActions } from "@/actions/Actions";

// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";

// Components
import PreviewModal from "./PreviewModal";

const PreviewModalContainer = forwardRef((props, layoutWrapperRef) => {
  const { children, mutateSliderData } = props;
  // Store
  const previewModalStateById = usePreviewModalStore(
    (state) => state.previewModalStateById,
    shallow
  );
  // Next Router
  const router = useRouter();

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = useCallback(() => {
    return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
  }, [previewModalStateById]);

  /**
   * Returns the state of the currently open preview modal
   * @returns {Object}
   */
  const openPreviewModalState = useCallback(() => {
    return (
      Object.values(previewModalStateById).find(({ isOpen }) => isOpen) || {}
    );
  }, [previewModalStateById]);

  /**
   * Get videoId from open modal state
   * @returns {Number}
   */
  const getVideoId = useCallback(() => {
    const modal = openPreviewModalState();
    return modal && modal.videoId;
  }, [openPreviewModalState]);

  /**
   *
   * @returns {boolean}
   */
  const isJBVRoute = useCallback(() => {
    const jbv = router.query.jbv;
    return !!jbv && !Number.isNaN(jbv);
  }, [router.query.jbv]);

  /**
   *
   * @returns {Object}
   */
  // const getPageProps = () => {
  //   let jbv = router.query.jbv,
  //     pageProps = {};
  //   return jbv && (pageProps.jbVideoId = jbv), pageProps;
  // };

  /**
   * Close all preview modals
   */
  const closeAllModals = useCallback(() => {
    Object.values(previewModalStateById)
      .filter(({ isOpen }) => isOpen)
      .forEach(({ videoId }) => {
        closeModal(videoId);
      });
  }, [previewModalStateById, closeModal]);

  /**
   * Close the preview modal
   */
  const closeModal = useCallback(
    (videoId) => {
      const openModal = (
        undefined === previewModalStateById ? {} : previewModalStateById
      )[videoId];
      usePreviewModalStore.getState().setPreviewModalClose({
        ...openModal,
        closeWithoutAnimation: openModal.closeWithoutAnimation,
        videoId: videoId,
      });
      openModal.onPreviewModalClose && openModal.onPreviewModalClose();
    },
    [previewModalStateById]
  );

  /**
   * Open a preview modal on page load if there is a jbv query param
   */
  const handleUpdatePreviewModalState = () => {
    const videoId = getVideoId();
    if (isJBVRoute() && !isPreviewModalOpen()) {
      if ((closeAllModals(), Number.isNaN(videoId))) return;
      usePreviewModalStore.getState().setPreviewModalOpen({
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
      [modalStateActions.MINI_MODAL].includes(
        previewModalStateById[getVideoId()]?.modalState
      )
        ? (Object.values(previewModalStateById)
            .filter((modal) => {
              return (
                modal.videoId &&
                modal.videoId !== videoId &&
                modal.modalState === modalStateActions.DETAIL_MODAL
              );
            })
            .forEach(({ videoId }) => {
              closeModal(videoId);
            }),
          usePreviewModalStore.getState().updatePreviewModalState({
            individualState: {
              videoId: getVideoId(),
              modalState: modalStateActions.DETAIL_MODAL,
              titleCardId: undefined,
              titleCardRect: undefined,
            },
          }))
        : Object.values(previewModalStateById).some((modal) => {
            return (
              modal.isOpen &&
              modal.modalState === modalStateActions.DETAIL_MODAL
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        key={`${videoId}-${isOpen}`}
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
    <AnimatePresenceWrapper custom={previewModalStateById} mode="wait">
      {[renderMiniModal(), renderDetailModal(), renderGalleryModal()]}
    </AnimatePresenceWrapper>
  );
});

PreviewModalContainer.displayName = "PreviewModalContainer";
export default PreviewModalContainer;
