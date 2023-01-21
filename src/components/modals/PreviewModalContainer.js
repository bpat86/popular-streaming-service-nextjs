import { useRouter } from "next/router";
import { cloneElement, forwardRef, useCallback, useLayoutEffect } from "react";
import shallow from "zustand/shallow";

import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";

import { modalStateActions } from "@/actions/Actions";

import usePreviewModalStore from "@/stores/PreviewModalStore";

import PreviewModal from "./NewPreviewModal";

const PreviewModalContainer = forwardRef(
  ({ children, mutateSliderData }, layoutWrapperRef) => {
    const { previewModalStateById } = usePreviewModalStore(
      (state) => ({
        previewModalStateById: state.previewModalStateById,
      }),
      shallow
    );

    const router = useRouter();

    /**
     * Determine if a preview modal is currently open
     * @returns {Boolean}
     */
    const isPreviewModalOpen = useCallback(
      (videoId) => {
        if (!usePreviewModalStore) return false;
        let modal;
        return videoId
          ? null === (modal = previewModalStateById[videoId]) ||
            undefined === modal
            ? undefined
            : modal.isOpen
          : Object.values(previewModalStateById).some((e) => {
              return e.isOpen;
            });
      },
      [previewModalStateById]
    );

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
    const updatePreviewModalState = useCallback(() => {
      const videoId = getVideoId();
      if (isJBVRoute() && !isPreviewModalOpen(videoId)) {
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
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Update preview modal state
     */
    useLayoutEffect(() => {
      updatePreviewModalState();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updatePreviewModalState]);

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
      if (!isOpen || !modal || !modalState || !videoId || !uid || !videoModel)
        return null;
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
      <AnimatePresenceWrapper custom={previewModalStateById} mode="wait">
        {[renderMiniModal(), renderDetailModal(), renderGalleryModal()]}
      </AnimatePresenceWrapper>
    );
  }
);

export default PreviewModalContainer;
