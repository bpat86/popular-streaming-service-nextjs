import { IMediaItemWithUserPreferences } from "./../pages/api/tmdb/types";
export type FetcherProps = [string, object];
export type UseMediaProps = {
  pageAPI: string;
};
export type IMedia = {
  fetchingMedia: boolean;
  media: IMediaItemWithUserPreferences;
  mutateMedia?: (data: any) => Promise<void> | undefined;
  mediaError: object;
  cancelRequest: () => void;
};
