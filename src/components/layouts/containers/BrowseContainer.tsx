import { Fragment, useContext, useRef } from "react";

import { AuthContextType } from "@/@types/auth";
import BrowseLayout from "@/components/layouts/BrowseLayout";
import MediaContainer from "@/components/layouts/containers/MediaContainer";
import UserProfiles from "@/components/profile/UserProfiles";
import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import useProfiles from "@/middleware/useProfiles";
import useUser from "@/middleware/useUser";

type BrowseContainerProps = {
  initialUser: {
    activeProfile: {
      id: string | null;
    };
    isLoggedIn: boolean;
    isRegistered: boolean;
  };
  pageAPI: string;
  pageTitle: string;
};

const BrowseContainer = ({
  initialUser,
  pageAPI,
  pageTitle,
}: BrowseContainerProps) => {
  const { logout } = useContext(AuthContext) as AuthContextType;
  const { activeProfile } = useContext(ProfileContext);
  const { user } = useUser({
    redirectTo: "/",
  });
  const { profiles, profileNames, loadingProfiles, mutateProfiles } =
    useProfiles({ user });
  const layoutWrapperRef = useRef<HTMLDivElement>(null);
  const activeProfileId = activeProfile?.id ?? null; // initialUser?.activeProfile?.id
  const isLoggedIn = user?.isLoggedIn || initialUser?.isLoggedIn || false;
  // User data
  const userData = {
    user,
    logout,
    isLoggedIn,
    isActive: user?.isActive,
    activeProfile: user?.activeProfile,
  };
  // Profile data
  const profilesData = {
    profiles,
    profileNames,
    mutateProfiles,
    loadingProfiles,
  };
  const pageProps = { ...userData, ...profilesData };

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
  return isShowingProfilesGate() ? (
    <UserProfiles user={user} />
  ) : (
    <Fragment key={activeProfileId}>
      <BrowseLayout
        ref={layoutWrapperRef}
        title={pageTitle}
        {...{ ...pageProps, profile: activeProfileId }}
      >
        <MediaContainer ref={layoutWrapperRef} pageAPI={pageAPI} />
      </BrowseLayout>
    </Fragment>
  );
};

export default BrowseContainer;
