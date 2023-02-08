import debounce from "lodash/debounce";
import {
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  useRef,
} from "react";

import { modalStateActions } from "@/actions/Actions";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { IPreviewModal } from "@/store/types";

import TitleCard from "./TitleCard";

type TitleCardContainerProps = {
  inViewport: boolean;
  itemTabbable: boolean;
  listContext: any;
  model: any;
  myListRowItemsLength: number;
  onFocus: () => void;
  previewModalEnabled: boolean;
  rankNum: number;
  rowNum: number;
  rowHasPreviewModalOpen: () => void;
  toggleExpandedInfoDensity: (arg0: boolean) => void;
};

const TitleCardContainer = forwardRef(
  (
    {
      inViewport,
      itemTabbable,
      model,
      onFocus,
      rowNum,
      toggleExpandedInfoDensity,
    }: TitleCardContainerProps,
    ref
  ) => {
    const sliderItemRef = ref as MutableRefObject<HTMLDivElement>;
    const scopeRef = useRef<{
      hasFetchedModalData: boolean;
      isHovering: boolean;
      isModalOpen: boolean;
    }>({
      hasFetchedModalData: false,
      isHovering: false,
      isModalOpen: false,
    });
    const hoverTimeoutIdRef = useRef<number | null>(null);

    /**
     * Determine if a preview modal is currently open
     */
    const isPreviewModalOpen = () => {
      const previewModalStateById =
        usePreviewModalStore.getState().previewModalStateById;
      return !!(
        previewModalStateById &&
        Object.values(previewModalStateById).some(({ isOpen }) => isOpen)
      );
    };

    /**
     * Update modal state when the browser window resizes.
     */
    const handleWindowResize = debounce(
      (titleCardRef) => {
        if (titleCardRef) {
          usePreviewModalStore.getState().updatePreviewModalState({
            individualState: {
              videoId: model.videoModel.videoId,
              titleCardRect: titleCardRef?.getBoundingClientRect(),
            } as IPreviewModal["individualState"],
            scrollPosition: undefined,
          });
        }
      },
      100,
      { leading: true, trailing: true }
    );

    /**
     * Determine if a preview modal should open on mouse enter.
     */
    const handleMouseEnter = (
      e: MouseEvent<HTMLDivElement>,
      titleCardRef: MutableRefObject<HTMLDivElement>
    ) => {
      const { isModalOpen } = scopeRef.current;
      const mouseEnter =
        e && e.currentTarget && titleCardRef.current?.contains(e.currentTarget);
      // Only visible titles can display a preview modal
      if (!itemTabbable || isModalOpen) return;
      // Process the mouse enter event
      mouseEnter && handleEnter(titleCardRef);
    };

    /**
     * Queue a preview modal to open.
     */
    const handleEnter = (titleCardRef: MutableRefObject<HTMLDivElement>) => {
      const { hasFetchedModalData } = scopeRef.current;
      // Set hasFetchedModalData to true after the modal has opened once
      scopeRef.current.isHovering = true;
      if (!hasFetchedModalData) {
        scopeRef.current.hasFetchedModalData = true;
        return queuePreviewModalOpen(titleCardRef);
      }
      queuePreviewModalOpen(titleCardRef);
    };

    /**
     * Handle when a user hovers out of a titlecard
     */
    const handleMouseLeave = (
      e: MouseEvent<HTMLDivElement> & {
        relatedTarget: EventTarget &
          Node & {
            location: Location;
          };
      },
      titleCardRef: MutableRefObject<HTMLDivElement>
    ) => {
      const mouseLeave =
        (e && !e.relatedTarget) ||
        (e.relatedTarget && e.relatedTarget.location) ||
        (e.relatedTarget &&
          !titleCardRef.current?.contains(e.relatedTarget as Node));
      // Process the mouse leave event
      mouseLeave && handleLeave();
    };

    /**
     * If a preview modal is open or this titleCard is hovered over
     */
    const handleMouseMove = (
      e: MouseEvent<HTMLDivElement>,
      titleCardRef: MutableRefObject<HTMLDivElement>
    ) => {
      const { isHovering } = scopeRef.current;
      isHovering || isPreviewModalOpen() || handleMouseEnter(e, titleCardRef);
    };

    /**
     * Clear the timeout delays.
     */
    const clearDelays = () => {
      hoverTimeoutIdRef.current && clearTimeout(hoverTimeoutIdRef.current),
        (hoverTimeoutIdRef.current = null);
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
     */
    const queuePreviewModalOpen = (
      titleCardRef: MutableRefObject<HTMLDivElement>
    ) => {
      const { isHovering, isModalOpen } = scopeRef.current;
      if (!hoverTimeoutIdRef.current && !isModalOpen && isHovering) {
        const delay = usePreviewModalStore.getState().wasOpen ? 200 : 400;
        hoverTimeoutIdRef.current = window.setTimeout(() => {
          return openPreviewModal({
            titleCardRef: titleCardRef as MutableRefObject<HTMLDivElement>,
          });
        }, delay);
      }
    };

    /**
     * Open the preview modal.
     */
    const openPreviewModal = ({
      openDetailModal,
      titleCardRef,
    }: {
      openDetailModal?: boolean;
      titleCardRef?: MutableRefObject<HTMLDivElement>;
    }) => {
      if (titleCardRef) {
        // Initialize window resize listener for the title card
        window.addEventListener("resize", () => {
          handleWindowResize(titleCardRef.current);
        });
      }
      // Close all previously open preview modals
      if (isPreviewModalOpen()) {
        const previewModalStateById =
          usePreviewModalStore.getState().previewModalStateById;
        return (
          previewModalStateById &&
            Object.values(previewModalStateById)
              .filter(({ isOpen }) => isOpen)
              .map(({ videoId }) => videoId)
              .forEach((videoId) => {
                usePreviewModalStore.getState().setPreviewModalClose({
                  closeWithoutAnimation: true,
                  videoId,
                });
              }),
          queuePreviewModalOpen(
            titleCardRef as MutableRefObject<HTMLDivElement>
          )
        );
      }
      // Open this titleCard as a preview modal
      !openDetailModal && (scopeRef.current.isModalOpen = true),
        usePreviewModalStore.getState().setPreviewModalOpen({
          sliderRow: rowNum,
          videoModel: model.videoModel,
          videoId: model.videoModel.videoId,
          listContext: model.videoModel.listContext,
          titleCardId: titleCardRef ? titleCardRef?.current?.id : undefined,
          titleCardRef: undefined,
          titleCardRect: openDetailModal
            ? undefined
            : titleCardRef?.current?.getBoundingClientRect(),
          scrollPosition: window.scrollY,
          modalState: openDetailModal
            ? modalStateActions.DETAIL_MODAL
            : modalStateActions.MINI_MODAL,
          onPreviewModalClose: () => {
            !openDetailModal &&
              window.removeEventListener("resize", () => {
                handleWindowResize(titleCardRef);
              });
          },
          model,
          videoPlayback: {
            start: undefined,
            length: undefined,
          },
          isMyListRow: model.videoModel.isMyListRow,
          animationContext: undefined, // galleryModal
        });
    };

    /**
     * Close the preview modal.
     */
    const handleKeyDown = (
      e: KeyboardEvent<HTMLDivElement>,
      titleCardRef: MutableRefObject<HTMLDivElement>
    ) => {
      (e && e.key) === "Enter" && handleClick(e, titleCardRef);
    };

    /**
     * Open the preview modal in `DETAIL_MODAL` view when clicked.
     */
    const handleClick = (
      e:
        | MouseEvent<HTMLDivElement | HTMLAnchorElement>
        | KeyboardEvent<HTMLDivElement | HTMLAnchorElement>,
      titleCardRef: MutableRefObject<HTMLDivElement>
    ) => {
      e.stopPropagation();
      if ((clearDelays(), isPreviewModalOpen())) return;
      openPreviewModal({
        titleCardRef: titleCardRef as MutableRefObject<HTMLDivElement>,
        openDetailModal: true,
      });
    };

    return (
      <div ref={sliderItemRef} className="title-card-container">
        <TitleCard
          key={`title-card-${model.uid}`}
          className="title-card"
          id={model.videoModel.titleCardId}
          isDisliked={model.videoModel.isDisliked}
          imageKey={model.videoModel.imageKey}
          inViewport={inViewport}
          itemTabbable={itemTabbable}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          rowNum={rowNum}
          toggleExpandedInfoDensity={toggleExpandedInfoDensity}
          watchURL={`/watch/${model.videoModel.mediaType}-${model.videoModel.id}`}
        />
      </div>
    );
  }
);

TitleCardContainer.displayName = "TitleCardContainer";
export default TitleCardContainer;
