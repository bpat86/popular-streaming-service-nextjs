import { useRouter } from "next/router";
import {
  cloneElement,
  forwardRef,
  MutableRefObject,
  useCallback,
  useLayoutEffect,
} from "react";

import { modalStateActions } from "@/actions/Actions";
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { IPreviewModal } from "@/store/types";

import PreviewModal from "./PreviewModal";

type PreviewModalContainerProps = {
  children: JSX.Element;
  mutateSliderData?: IPreviewModal["mutateMedia"];
};

const PreviewModalContainer = forwardRef(
  ({ children, mutateSliderData }: PreviewModalContainerProps, ref) => {
    const layoutWrapperRef = ref as MutableRefObject<HTMLDivElement | null>;
    const { previewModalStateById } = usePreviewModalStore((state) => ({
      previewModalStateById: state.previewModalStateById,
    }));
    const router = useRouter();

    /**
     * Determine if a preview modal is currently open
     */
    const isPreviewModalOpen = useCallback(
      (videoId: IPreviewModal["videoId"]) => {
        if (!previewModalStateById) return false;
        let modal;
        return videoId
          ? null === (modal = previewModalStateById[videoId]) ||
            undefined === modal
            ? undefined
            : modal.isOpen
          : Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
      },
      [previewModalStateById]
    );

    /**
     * Returns the state of the currently open preview modal
     */
    const openPreviewModalState = useCallback(() => {
      if (!previewModalStateById) return;
      return Object.values(previewModalStateById).find(
        ({ isOpen }) => isOpen
      ) as IPreviewModal;
    }, [previewModalStateById]);

    /**
     * Get videoId from open modal state
     */
    const getVideoId = useCallback(() => {
      const modal = openPreviewModalState();
      return modal && modal.videoId ? modal.videoId : undefined;
    }, [openPreviewModalState]);

    /**
     * Determine if the current route is a jbv route
     */
    const isJBVRoute = useCallback(() => {
      const jbv = router.query.jbv;
      return jbv && !Number.isNaN(jbv);
    }, [router.query.jbv]);

    /**
     * Get page props from router
     */
    // const getPageProps = () => {
    //   let jbv = router.query.jbv,
    //     pageProps = {};
    //   return jbv && (pageProps.jbVideoId = jbv), pageProps;
    // };

    /**
     * Close the preview modal
     */
    const closeModal = useCallback(
      (videoId: keyof IPreviewModal["videoId"]) => {
        const openModal =
          previewModalStateById === undefined
            ? ({} as IPreviewModal)
            : previewModalStateById[videoId];
        usePreviewModalStore.getState().setPreviewModalClose({
          ...openModal,
          closeWithoutAnimation: openModal.closeWithoutAnimation,
          videoId,
        });
        openModal.onPreviewModalClose && openModal.onPreviewModalClose();
      },
      [previewModalStateById]
    );

    /**
     * Close all preview modals
     */
    const closeAllModals = useCallback(() => {
      if (!previewModalStateById) return;
      Object.values(previewModalStateById)
        .filter(({ isOpen }) => isOpen)
        .forEach(({ videoId }) => {
          closeModal(videoId as keyof IPreviewModal["videoId"]);
        });
    }, [previewModalStateById, closeModal]);

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
            id: Number(router.query.jbv),
            mediaType: router.query.type,
          },
          scrollPosition: window.scrollY,
          titleCardId: undefined,
          titleCardRect: undefined,
          videoPlayback: undefined,
          model: {
            uid: router.query.jbv,
            id: Number(router.query.jbv),
            mediaType: router.query.type,
            videoModel: {
              listContext: undefined,
              id: Number(router.query.jbv),
              identifiers: {
                uid: router.query.jbv,
                id: Number(router.query.jbv),
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
          videoId: router.query.jbv?.toString(),
          videoModel: {
            listContext: undefined,
            id: Number(router.query.jbv),
            identifiers: {
              uid: router.query.jbv,
              id: Number(router.query.jbv),
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
        videoId &&
        previewModalStateById &&
        isPreviewModalOpen(videoId) &&
        [modalStateActions.MINI_MODAL].includes(
          previewModalStateById[videoId]?.modalState
        )
          ? previewModalStateById &&
            (Object.values(previewModalStateById)
              .filter((modal) => {
                return (
                  modal.videoId &&
                  modal.videoId !== videoId &&
                  modal.modalState === modalStateActions.DETAIL_MODAL
                );
              })
              .forEach(({ videoId }) => {
                closeModal(videoId as keyof IPreviewModal["videoId"]);
              }),
            usePreviewModalStore.getState().updatePreviewModalState({
              individualState: {
                videoId: getVideoId(),
                modalState: modalStateActions.DETAIL_MODAL,
              },
            }))
          : previewModalStateById &&
            Object.values(previewModalStateById).some(
              ({ isOpen, modalState }) => {
                return isOpen && modalState === modalStateActions.DETAIL_MODAL;
              }
            ) &&
            !isJBVRoute() &&
            closeAllModals();
      }
    }, [
      closeModal,
      closeAllModals,
      getVideoId,
      previewModalStateById,
      isJBVRoute,
      isPreviewModalOpen,
      router.query.jbv,
      router.query.type,
    ]);

    /**
     * Update preview modal state
     */
    useLayoutEffect(() => {
      updatePreviewModalState();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // updatePreviewModalState

    /**
     * Render mini preview modal
     */
    const renderMiniModal = () => {
      if (!previewModalStateById) return;
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
      if (!previewModalStateById) return;
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
     */
    const renderPreviewModal = (modal: IPreviewModal) => {
      const {
        isOpen,
        modalState,
        model: { uid } = {},
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
          previewModalState={{
            ...modal,
            modalState,
            mutateSliderData,
          }}
        />
      );
    };

    /**
     * Render Framer Motion AnimatePresence Component
     */
    return (
      <AnimatePresenceWrapper custom={previewModalStateById} mode="wait">
        {[renderMiniModal(), renderDetailModal(), renderGalleryModal()]}
      </AnimatePresenceWrapper>
    );
  }
);

export default PreviewModalContainer;
