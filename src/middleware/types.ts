import { IMediaItemWithUserPreferences } from "./../pages/api/tmdb/types";

export type IMedia = {
  fetchingMedia?: boolean;
  media?: IMediaItemWithUserPreferences;
  mutateMedia?: (data: any) => Promise<void> | undefined;
  mediaError?: object;
  cancelRequest?: () => void;
};
