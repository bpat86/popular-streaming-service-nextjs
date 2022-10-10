import {
  forwardRef,
  useLayoutEffect,
  useCallback,
  useContext,
  useState,
  useMemo,
  useRef,
} from "react";
import debounce from "lodash.debounce";
// Context
import InteractionContext from "@/context/InteractionContext";
// import usePreviewModal from "@/context/PreviewModalContext";
// Components
import TitleCard from "./TitleCard";
// Hooks

const TitleCardContainer = forwardRef(
  (
    {
      itemKey,
      inViewport,
      itemTabbable,
      listContext,
      model,
      myListRowItemsLength,
      onFocus,
      previewModalEnabled,
      rankNum,
      rowNum,
      rowHasPreviewModalOpen,
      toggleExpandedInfoDensity,
    },
    sliderItemRef
  ) => {
    // Context
    const {
      isPreviewModalOpen,
      previewModalStateById,
      setPreviewModalOpen,
      setPreviewModalClose,
      setPreviewModalWasOpen,
      updatePreviewModalState,
      modalStateActions,
      wasOpen,
    } = useContext(InteractionContext);
    // const {
    //   isPreviewModalOpen,
    //   previewModalStateById,
    //   setPreviewModalOpen,
    //   setPreviewModalClose,
    //   updatePreviewModalState,
    //   wasOpen,
    // } = usePreviewModal();
    // State
    // Refs
    const scope = useRef({
      hasFetchedModalData: false,
      isHovering: false,
      isModalOpen: false,
    });
    const hoverTimeoutId = useRef(0);

    /**
     * Update modal state when the browser window resizes.
     */
    const handleWindowResize = debounce(
      (titleCardNode) => {
        updatePreviewModalState({
          individualState: {
            videoId: model?.videoModel?.videoId,
            titleCardRect: titleCardNode?.getBoundingClientRect(),
          },
          scrollPosition: undefined,
        });
      },
      100,
      { leading: true, trailing: true }
    );

    /**
     * Determine if a preview modal should open on mouse enter.
     * @param {Object} e
     * @param {Object} ref
     */
    const handleMouseEnter = (e, titleCardRef) => {
      const { isModalOpen } = scope.current;
      const mouseEnter =
        e &&
        e.currentTarget &&
        titleCardRef instanceof HTMLElement &&
        titleCardRef.contains(e.currentTarget);
      // Only visible titles can display a preview modal
      if (!itemTabbable || isModalOpen) return;
      // Process the mouse enter event
      if (mouseEnter) {
        // console.log("mouseenter... ", mouseEnter);
        handleEnter(titleCardRef);
      }
    };

    /**
     * Queue a preview modal to open.
     * @param {Object} e
     * @param {Object} ref
     * @returns
     */
    const handleEnter = (titleCardRef) => {
      const { hasFetchedModalData } = scope.current;
      // If a titleCard hasn't been hovered over yet, fetch the modal data
      if (((scope.current.isHovering = true), !hasFetchedModalData)) {
        scope.current.hasFetchedModalData = true;
        return void queuePreviewModalOpen(titleCardRef);
      }
      // If a titleCard has been hovered over, open the modal immediately
      queuePreviewModalOpen(titleCardRef);
    };

    /**
     * Handle when a user hovers out of a titlecard.
     * @param {Object} e
     * @param {Object} ref
     */
    const handleMouseLeave = (e, titleCardRef) => {
      const mouseLeave =
        (e && !e.relatedTarget) ||
        e.relatedTarget.location ||
        (e.relatedTarget &&
          titleCardRef instanceof HTMLElement &&
          !titleCardRef.contains(e.relatedTarget));
      if (mouseLeave) {
        handleLeave();
      }
    };

    /**
     * Determine if a preview modal should open on mouse move.
     * @param {Object} e
     * @param {Object} ref
     */
    const handleMouseMove = (e, titleCardRef) => {
      const { isHovering } = scope.current;
      console.log(
        `titleCardContainer handleMouseMove function: ${
          model?.videoModel?.title
        } isHovering is ${isHovering}, wasOpen is ${wasOpen}, and isPreviewModalOpen is ${isPreviewModalOpen()}`
      );
      // Process the mouse move event
      isHovering || isPreviewModalOpen() || handleMouseEnter(e, titleCardRef);
    };

    /**
     * Clear the timeout delays.
     */
    const clearDelays = () => {
      hoverTimeoutId.current && clearTimeout(hoverTimeoutId.current),
        (hoverTimeoutId.current = 0);
    };

    /**
     * Clear the delays and hover state on mouse leave.
     */
    const handleLeave = () => {
      // console.log("handleLeave.... ", model?.videoModel?.title);
      setPreviewModalWasOpen(false);
      scope.current = {
        ...scope.current,
        isHovering: false,
        isModalOpen: false,
      };
      clearDelays();
    };

    /**
     * Queue the preview modal to open.
     * @param {Object} ref
     */
    const queuePreviewModalOpen = (ref) => {
      const { isHovering, isModalOpen } = scope.current;
      if (!hoverTimeoutId.current && isHovering && !isModalOpen) {
        const delay = wasOpen ? 100 : 400;
        hoverTimeoutId.current = setTimeout(() => {
          return openPreviewModal({
            titleCardNode: ref,
          });
        }, delay);
      }
    };

    /**
     * Close all open preview modals
     */
    const closeAllPreviewModals = () => {
      return Object.values(previewModalStateById)
        .filter((modal) => modal.isOpen)
        .map((modal) => modal.videoId)
        .forEach((videoId) =>
          setPreviewModalClose({
            closeWithoutAnimation: true,
            videoId,
          })
        );
    };

    /**
     * Open the preview modal.
     * @param {Object} modalProps
     * @returns
     */
    const openPreviewModal = (modalProps = {}) => {
      // Open the preview modal
      let nodeRect,
        titleCardNode = modalProps?.titleCardNode,
        titleCard = titleCardNode === undefined ? undefined : titleCardNode,
        openDetailModal = modalProps?.openDetailModal,
        openAsDefaultModal = openDetailModal !== undefined;
      if (titleCard) {
        nodeRect = titleCardNode.getBoundingClientRect();
        // window.addEventListener("resize", () => handleWindowResize(titleCard));
      }
      // Close previously opened modals without animation
      if (isPreviewModalOpen())
        return closeAllPreviewModals(), void queuePreviewModalOpen(titleCard);
      // Open this titleCard as a preview modal
      !openAsDefaultModal && (scope.current.isModalOpen = true),
        setPreviewModalOpen({
          videoModel: model.videoModel,
          videoId: model.videoModel.videoId,
          titleCardRect: openAsDefaultModal ? undefined : nodeRect,
          titleCardRef: modalProps?.titleCardNode,
          listContext: model.videoModel.listContext,
          titleCardId: titleCard ? titleCard.id : undefined,
          scrollPosition: window.scrollY,
          modalState: openAsDefaultModal
            ? modalStateActions.DETAIL_MODAL
            : modalStateActions.MINI_MODAL,
          onPreviewModalClose: () => {
            !openAsDefaultModal &&
              window.removeEventListener("resize", () => {
                // handleWindowResize(modalProps?.titleCardNode);
              });
          },
          model,
          videoPlayback: {
            start: null,
            length: null,
          },
          isMyListRow: model.videoModel.isMyListRow,
          animationContext: undefined, // galleryModal
        });
    };

    /**
     * Close the preview modal.
     * @param {Object} e
     */
    const handleKeyDown = (e) => {
      (e && e.which) === "Enter" && handleClick();
    };

    /**
     * Open the preview modal in `DETAIL_MODAL` view when clicked.
     * @param {Object} e
     * @param {Object} ref
     * @returns
     */
    const handleClick = (e, ref) => {
      e.stopPropagation();
      if ((clearDelays(), isPreviewModalOpen())) return;
      openPreviewModal({
        titleCardNode: ref,
        openDetailModal: true,
      });
    };

    return (
      <div ref={sliderItemRef} className="title-card-container">
        <TitleCard
          key={`title-card-${model?.uid}`} // model?.uid
          className={`title-card`}
          id={model?.videoModel?.titleCardId}
          isDisliked={model?.videoModel?.isDisliked}
          imageKey={model?.videoModel?.imageKey}
          inViewport={inViewport}
          itemKey={itemKey}
          itemTabbable={itemTabbable}
          listContext={listContext}
          mediaType={model?.videoModel?.mediaType}
          model={model}
          myListRowItemsLength={myListRowItemsLength}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          previewModalEnabled={previewModalEnabled}
          rankNum={rankNum}
          rowHasPreviewModalOpen={rowHasPreviewModalOpen}
          toggleExpandedInfoDensity={toggleExpandedInfoDensity}
          videoURL={model?.videoModel?.videos}
          watchURL={`/watch/${model?.videoModel?.mediaType}-${model?.videoModel?.id}`}
        />
      </div>
    );
  }
);

TitleCardContainer.displayName = "TitleCardContainer";
export default TitleCardContainer;
