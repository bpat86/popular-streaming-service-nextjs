import debounce from "lodash.debounce";
import { forwardRef, useRef } from "react";

// Actions
import { modalStateActions } from "@/actions/Actions";

// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";

// Components
import TitleCard from "./TitleCard";

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
    // Refs
    const scopeRef = useRef({
      hasFetchedModalData: false,
      isHovering: false,
      isModalOpen: false,
    });
    const hoverTimeoutIdRef = useRef(0);

    // console.log("TitleCardContainer");

    /**
     * Determine if a preview modal is currently open
     * @returns {Boolean}
     */
    const isPreviewModalOpen = () => {
      const previewModalStateById =
        usePreviewModalStore.getState().previewModalStateById;
      return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
    };

    /**
     * Update modal state when the browser window resizes.
     */
    const handleWindowResize = debounce(
      (titleCardNode) => {
        if (titleCardNode) {
          usePreviewModalStore.getState().updatePreviewModalState({
            individualState: {
              videoId: model?.videoModel?.videoId,
              titleCardRect: titleCardNode?.getBoundingClientRect(),
            },
            scrollPosition: undefined,
          });
        }
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
      const { isModalOpen } = scopeRef.current;
      const mouseEnter =
        e &&
        e.currentTarget &&
        titleCardRef instanceof HTMLElement &&
        titleCardRef.contains(e.currentTarget) &&
        !isModalOpen;
      // Only visible titles can display a preview modal
      if (!itemTabbable) return;
      // Process the mouse enter event
      if (mouseEnter) {
        // handleEnter(titleCardRef);
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
      const { hasFetchedModalData } = scopeRef.current;
      // If a titleCard hasn't been hovered over yet, fetch the modal data
      if (((scopeRef.current.isHovering = true), !hasFetchedModalData)) {
        scopeRef.current.hasFetchedModalData = true;
        return queuePreviewModalOpen(titleCardRef);
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
      // Process the mouse leave event
      if (
        (e && !e.relatedTarget) ||
        e.relatedTarget.location ||
        (e.relatedTarget &&
          titleCardRef instanceof HTMLElement &&
          !titleCardRef.contains(e.relatedTarget))
      ) {
        handleLeave();
      }
    };

    /**
     * Determine if a preview modal should open on mouse move.
     * @param {Object} e
     * @param {Object} ref
     */
    const handleMouseMove = (e, titleCardRef) => {
      const { isHovering } = scopeRef.current;
      // Process the mouse move event
      isHovering || isPreviewModalOpen() || handleMouseEnter(e, titleCardRef);
    };

    /**
     * Clear the timeout delays.
     */
    const clearDelays = () => {
      hoverTimeoutIdRef.current && clearTimeout(hoverTimeoutIdRef.current),
        (hoverTimeoutIdRef.current = 0);
    };

    /**
     * Clear the delays and hover state on mouse leave.
     */
    const handleLeave = () => {
      scopeRef.current = {
        ...scopeRef.current,
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
      const { isHovering, isModalOpen } = scopeRef.current;
      // console.log(usePreviewModalStore.getState().wasOpen);
      if (!hoverTimeoutIdRef.current && !isModalOpen && isHovering) {
        const delay = usePreviewModalStore.getState().wasOpen ? 100 : 400;
        hoverTimeoutIdRef.current = setTimeout(() => {
          openPreviewModal({
            titleCardNode: ref,
          });
        }, delay);
      }
    };

    /**
     * Open the preview modal.
     * @param {Object}
     * @returns
     */
    const openPreviewModal = ({
      openDetailModal = undefined,
      titleCardNode = undefined,
    } = {}) => {
      if (titleCardNode) {
        // Initialize window resize listener for the title card
        window.addEventListener("resize", () => {
          handleWindowResize(titleCardNode);
        });
      }
      // Close all previously open preview modals
      if (isPreviewModalOpen()) {
        const previewModalStateById =
          usePreviewModalStore.getState().previewModalStateById;
        return (
          Object.values(previewModalStateById)
            .filter(({ isOpen }) => isOpen)
            .map(({ videoId }) => videoId)
            .forEach((videoId) => {
              usePreviewModalStore.getState().setPreviewModalClose({
                closeWithoutAnimation: true,
                videoId,
              });
            }),
          queuePreviewModalOpen(titleCardNode)
        );
      }
      // Open this titleCard as a preview modal
      !openDetailModal && (scopeRef.current.isModalOpen = true),
        usePreviewModalStore.getState().setPreviewModalOpen({
          sliderRow: rowNum,
          videoModel: model.videoModel,
          videoId: model.videoModel.videoId,
          titleCardRect: openDetailModal
            ? undefined
            : titleCardNode.getBoundingClientRect(),
          titleCardRef: titleCardNode,
          listContext: model.videoModel.listContext,
          titleCardId: titleCardNode ? titleCardNode.id : undefined,
          scrollPosition: window.scrollY,
          modalState: openDetailModal
            ? modalStateActions.DETAIL_MODAL
            : modalStateActions.MINI_MODAL,
          onPreviewModalClose: () => {
            !openDetailModal &&
              window.removeEventListener("resize", () => {
                handleWindowResize(titleCardNode);
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
          className="title-card"
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
