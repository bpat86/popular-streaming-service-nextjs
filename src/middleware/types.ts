export type FetcherProps = [string, object];
export type UseMediaProps = {
  pageAPI: string;
};
export type IMedia = {
  fetchingMedia: boolean;
  media: any;
  mutateMedia: (data?: object, shouldRevalidate?: boolean) => Promise<object>;
  mediaError: object;
  cancelRequest: () => void;
};
