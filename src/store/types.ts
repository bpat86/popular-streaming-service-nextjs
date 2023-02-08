import { MutableRefObject } from "react";

import { previewModalActions } from "@/actions/Actions";
import { IMediaItem } from "@/pages/api/tmdb/types";

export interface IVideoModel {
  animationContext?: string | undefined;
  cast?: Array<{
    adult?: boolean;
    gender?: number | null;
    id?: number;
    known_for_department?: string;
    name?: string;
    original_name?: string;
    popularity?: number;
    profile_path?: string | null;
    cast_id?: number;
    character: string;
    credit_id: string;
    order: number;
  }>;
  crew?: Array<{
    adult?: boolean;
    gender?: number | null;
    id?: number;
    known_for_department?: string;
    name?: string;
    original_name?: string;
    popularity?: number;
    profile_path?: string | null;
    credit_id?: string;
    department?: string;
    job?: string;
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
  videos?: {
    results: Array<{
      id?: string;
      iso_639_1?: string;
      iso_3166_1?: string;
      key?: string;
      name?: string;
      site?: string;
      size?: number;
      type?: string;
      official?: boolean;
      published_at?: string;
    }>;
  };
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
  model?: IMediaItem;
  rankNum?: number;
  rect?: DOMRect | undefined;
  ref?: MutableRefObject<HTMLDivElement> | undefined;
  rowNum?: number;
  scrollPosition?: number;
  sliderName?: string;
  titleCardRef?: MutableRefObject<HTMLDivElement> | undefined;
  imageKey?: string;
  videoId?: string;
  videoKey?: string;
  videoModel?: IVideoModel;
  videos?: {
    results: Array<{
      id?: string;
      iso_639_1?: string;
      iso_3166_1?: string;
      key?: string;
      name?: string;
      site?: string;
      size?: number;
      type?: string;
      official?: boolean;
      published_at?: string;
    }>;
  };
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
  mutateMedia?: (data: any) => Promise<void> | undefined;
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
  isDetailModal: () => boolean;
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
