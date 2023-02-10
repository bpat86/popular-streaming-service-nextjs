import { useContext, useRef } from "react";

import { AuthContextType } from "@/@types/auth";
import BrowseLayout from "@/components/pages/layouts/BrowseLayout";
import UserProfiles from "@/components/profile/UserProfiles";
import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import useProfiles from "@/middleware/useProfiles";
import useUser from "@/middleware/useUser";

import Media from "./layers/Media";

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
  const { logout } = useContext(AuthContext) as AuthContextType;
  const { activeProfile } = useContext(ProfileContext);
  const { user } = useUser({ redirectTo: "/" });
  const { profiles, profileNames, loadingProfiles, mutateProfiles } =
    useProfiles({ user });
  const layoutWrapperRef = useRef<HTMLDivElement | null>(null);

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
   * Load the media content once a profile is created or selected
   */
  return (
    <BrowseLayout
      key={activeProfileId}
      ref={layoutWrapperRef}
      title={pageTitle}
      {...pageProps}
    >
      <Media ref={layoutWrapperRef} pageAPI={pageAPI} />
    </BrowseLayout>
  );
};

export default BrowseContainer;
