import { MutableRefObject } from "react";

import { previewModalActions } from "@/actions/Actions";

export interface IVideoModel {
  animationContext?: string | undefined;
  cast?: Array<{
    id: number;
    original_name: string;
    profile_path: string;
    character: string;
  }>;
  crew?: Array<{
    id: number;
    original_name: string;
    profile_path: string;
    job: string;
  }>;
  dislikedMediaId?: number;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  id?: number;
  identifiers?: {
    uid: string;
    id: number;
    mediaType: string;
  };
  imageKey?: string;
  inMediaList?: boolean;
  isBillboard?: boolean;
  isMyListRow?: boolean;
  isDisliked?: boolean;
  isLiked?: boolean;
  listContext?: string;
  likedMediaId?: number;
  logos?: Array<{
    file_path: string;
    aspect_ratio: number;
    height: number;
    width: number;
    iso_639_1: string;
  }>;
  mediaListId?: number;
  mediaType?: string;
  mutateModalData?: (data: IPreviewModal) => void;
  mutateSliderData?: (data: any) => void;
  overview?: string | undefined;
  queryData?: {
    [key: string]: any;
  };
  rankNum?: number;
  rect?: DOMRect;
  reference?: string[];
  rowNum?: number;
  scrollPosition?: number;
  sliderName?: string;
  synopsis?: string | undefined;
  rowHasExpandedInfoDensity?: boolean;
  tagline?: string;
  title?: string;
  titleCardId?: string;
  titleCardRef?: MutableRefObject<HTMLDivElement> | undefined;
  videoId?: string;
  videoKey?: string;
  videos?: Array<{
    id: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
  }>;
  videoPlayback?: {
    start: number;
    length: number;
  };
}

export interface IModel {
  animationContext?: string | undefined;
  uid?: string;
  id?: number;
  isMyListRow?: boolean;
  listContext?: string;
  mediaType?: string;
  rankNum?: number;
  rect?: DOMRect;
  ref?: MutableRefObject<HTMLDivElement> | undefined;
  rowNum?: number;
  scrollPosition?: number;
  sliderName?: string;
  titleCardRef?: MutableRefObject<HTMLDivElement> | undefined;
  imageKey?: string;
  videoId?: string;
  videoKey?: string;
  videoModel?: IVideoModel | undefined;
  videoURL?: string;
}

export interface IPreviewModal {
  animationContext?: string | undefined;
  billboardVideoMerchId?: string | undefined;
  closeWithoutAnimation?: boolean;
  individualState?: {
    billboardVideoMerchId?: string | undefined;
    closeWithoutAnimation?: boolean;
    inViewport?: boolean;
    isOpen?: boolean;
    isMyListRow?: boolean;
    listContext?: string | undefined;
    modalState?: string | undefined;
    model: IModel | undefined;
    onPreviewModalClose?: () => void;
    scrollPosition?: number | undefined;
    sliderRow?: number;
    titleCardId?: string | undefined;
    titleCardRect?: DOMRect | undefined;
    titleCardRef?: MutableRefObject<HTMLDivElement> | undefined;
    videoId?: string | undefined;
    videoKey?: string | undefined;
    videoModel?: IVideoModel | undefined;
    videoPlayback?: {
      start: number | undefined;
      length: number | undefined;
    };
  };
  inViewport?: boolean;
  isOpen?: boolean;
  isMyListRow?: boolean;
  listContext?: string | undefined;
  modalState?: string | undefined;
  model?: IModel | undefined;
  onPreviewModalClose?: () => void;
  scrollPosition?: number | undefined;
  sliderRow?: number;
  titleCardId?: string | undefined;
  titleCardRef?: MutableRefObject<HTMLDivElement> | undefined;
  titleCardRect?: DOMRect | undefined;
  videoId?: string | undefined;
  videoKey?: string | undefined;
  videoModel?: IVideoModel | undefined;
  videoPlayback?: {
    start: number | undefined;
    length: number | undefined;
  };
}

export interface IInitialState {
  galleryModalOpen?: boolean;
  previewModalStateById?:
    | {
        [key: string]: IPreviewModal;
      }
    | undefined;
  scrollPosition?: number | undefined;
  wasOpen?: boolean;
}

// Create the store.
export interface PreviewModalStore extends IInitialState {
  isDetailModal: (videoId: string) => boolean;
  setPreviewModalOpen: (payload: IPreviewModal) => void;
  setPreviewModalWasOpen: (payload: IInitialState) => void;
  setPreviewModalClose: (payload: IPreviewModal) => void;
  updatePreviewModalState: (payload: IPreviewModal) => void;
}

// Define the reducer actions.
export interface Actions {
  type:
    | typeof previewModalActions.SET_PREVIEW_MODAL_OPEN
    | typeof previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN
    | typeof previewModalActions.SET_PREVIEW_MODAL_CLOSE
    | typeof previewModalActions.UPDATE_PREVIEW_MODAL_STATE;
  payload: Partial<IInitialState> & Partial<IPreviewModal>;
}

// Define the props for the reducer.
export interface ImmerReducerProps {
  state: PreviewModalStore;
  action: Actions;
}
