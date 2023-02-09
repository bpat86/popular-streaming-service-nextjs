import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef } from "react";

import { AuthContextType } from "@/@types/auth";
import BillboardContainer from "@/components/billboard/BillboardContainer";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import PreviewModalContainer from "@/components/modals/PreviewModalContainer";
import BrowseLayout from "@/components/pages/layouts/BrowseLayout";
import UserProfiles from "@/components/profile/UserProfiles";
import Sliders from "@/components/slider/Sliders";
import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import useMedia from "@/middleware/useMedia";
import useProfiles from "@/middleware/useProfiles";
import useUser from "@/middleware/useUser";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { getVideoKey } from "@/utils/getVideoKey";

interface BrowseContainerProps {
  initialUser: {
    activeProfile: {
      id: string | null;
    };
    isLoggedIn: boolean;
    isRegistered: boolean;
  };
  pageAPI: string;
  pageTitle: string;
}

const BrowseContainer = ({
  initialUser,
  pageAPI,
  pageTitle,
}: BrowseContainerProps) => {
  const timerIdRef = useRef<number>(0);
  const { logout } = useContext(AuthContext) as AuthContextType;
  const { activeProfile } = useContext(ProfileContext);
  const { user } = useUser({ redirectTo: "/" });
  const { profiles, profileNames, loadingProfiles, mutateProfiles } =
    useProfiles({ user });
  const layoutWrapperRef = useRef<HTMLDivElement | null>(null);
  const { fetchingMedia, media, mutateMedia, mediaError } = useMedia({
    pageAPI,
  });

  // console.log("media: ", media);

  const router = useRouter();
  const activeProfileId = activeProfile?.id ?? null; // initialUser?.activeProfile?.id
  const isLoggedIn = user?.isLoggedIn || initialUser?.isLoggedIn || false;
  const userData = {
    user,
    logout,
    isLoggedIn,
    isActive: user?.isActive,
    activeProfile: user?.activeProfile,
  };
  const profilesData = {
    profiles,
    profileNames,
    mutateProfiles,
    loadingProfiles,
  };
  const pageProps = { ...userData, ...profilesData, profile: activeProfileId };

  /**
   * Determine if a preview modal is currently open
   */
  const isPreviewModalOpen = useCallback(() => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return (
      previewModalStateById &&
      Object.values(previewModalStateById).some(({ isOpen }) => isOpen)
    );
  }, []);

  /**
   * Turn pointer events off while scrolling
   */
  const onScroll = debounce(
    useCallback(() => {
      const style = document.body.style;
      timerIdRef.current && clearTimeout(timerIdRef.current),
        (timerIdRef.current = 0);
      isPreviewModalOpen() ||
        (style.pointerEvents !== "none" && (style.pointerEvents = "none")),
        setTimeout(() => {
          style.pointerEvents = "";
        }, 100);
    }, [isPreviewModalOpen]),
    100,
    { maxWait: 100, leading: true, trailing: true }
  );

  /**
   * Disable hover while scrolling
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
  }, [onScroll]);

  /**
   * Show nothing if a user is not yet logged in
   */
  if (!isLoggedIn || !user?.isActive) {
    return <></>;
  }

  const isShowingProfilesGate = () => {
    return user?.isActive && isLoggedIn && !activeProfileId;
  };

  /**
   * Load the media content once a profile is created or selected
   */
  if (isShowingProfilesGate()) {
    return <UserProfiles user={user} />;
  }

  /**
   * Render loading spinner
   */
  if (!media || fetchingMedia) {
    return (
      <div className="flex min-h-screen w-full">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * Render error message
   */
  if (!fetchingMedia && mediaError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center font-medium text-white">
        <p>{`${mediaError}`}</p>
      </div>
    );
  }

  /**
   * Load the media content once a profile is created or selected
   */
  console.log("activeProfileId: ", activeProfileId);
  return (
    <BrowseLayout
      key={activeProfileId}
      ref={layoutWrapperRef}
      title={pageTitle}
      {...pageProps}
    >
      <BillboardContainer
        model={{
          uid: media?.data?.billboard?.data?.id,
          id: media?.data?.billboard?.data?.id,
          billboardVideoId: getVideoKey(media?.data?.billboard?.data),
          listContext: media?.data?.billboard?.listContext,
          mediaType: media?.data?.billboard?.data?.media_type,
          mutateData: { mutateSliderData: mutateMedia },
          videoId: getVideoKey(media?.data?.billboard?.data),
          videoRoot: undefined,
          videoModel: {
            cast: media?.data?.billboard?.data?.cast,
            crew: media?.data?.billboard?.data?.crew,
            dislikedMediaId: media?.data?.billboard?.data?.disliked_media_id,
            genres: media?.data?.billboard?.data?.genres,
            listContext: media?.data?.billboard?.listContext,
            id: media?.data?.billboard?.data?.id,
            identifiers: {
              uid: media?.data?.billboard?.data?.id,
              id: media?.data?.billboard?.data?.id,
              mediaType: media?.data?.billboard?.data?.media_type,
            },
            imageKey: media?.data?.billboard?.data?.backdrop_path,
            isBillboard: media?.data?.billboard?.data?.is_billboard,
            inMediaList: media?.data?.billboard?.data?.in_media_list,
            isDisliked: media?.data?.billboard?.data?.is_disliked,
            isLiked: media?.data?.billboard?.data?.is_liked,
            likedMediaId: media?.data?.billboard?.data?.liked_media_id,
            logos: media?.data?.billboard?.data?.images?.logos,
            mediaListId: media?.data?.billboard?.data?.media_list_id,
            mediaType: media?.data?.billboard?.data?.media_type,
            mutateSliderData: mutateMedia,
            rankNum: undefined,
            rect: undefined,
            reference: media?.data?.billboard?.data,
            rowNum: undefined,
            scrollPosition: undefined,
            sliderName: undefined,
            synopsis: media?.data?.billboard?.data?.overview,
            tagline: media?.data?.billboard?.data?.tagline,
            title:
              media?.data?.billboard?.data?.original_title ||
              media?.data?.billboard?.data?.original_name,
            titleCardId: undefined,
            titleCardRef: undefined,
            videoId: media?.data?.billboard?.data?.id,
            videoKey: getVideoKey(media?.data?.billboard?.data),
            videoPlayback: undefined,
            videos: media?.data?.billboard?.data?.videos,
          },
        }}
        shouldFreeze={
          router.query.jbv ?? isPreviewModalOpen() ? true : undefined
        }
      />
      <Sliders model={media?.data?.sliders} />
      <PreviewModalContainer
        ref={layoutWrapperRef}
        mutateSliderData={mutateMedia}
      />
    </BrowseLayout>
  );
};

export default BrowseContainer;
