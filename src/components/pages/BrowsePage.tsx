import { useContext, useEffect, useRef } from "react";

import { AuthContextType } from "@/@types/auth";
import BrowseLayout from "@/components/pages/layouts/BrowseLayout";
// import ProfileGate from "@/components/profile/UserProfiles";
import ProfileGate from "@/components/profile-gate/ProfileGate";
import AuthContext from "@/context/AuthContext";
import useProfiles from "@/middleware/useProfiles";
import useUser from "@/middleware/useUser";
import useProfileStore from "@/store/ProfileStore";

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
  const { user } = useUser({ redirectTo: "/" });
  const { profiles, error, mutate, isLoading, isValidating } = useProfiles();
  const { logout } = useContext(AuthContext) as AuthContextType;
  const activeProfileID =
    useProfileStore((state) => state.activeProfile?.id) || null;
  const layoutWrapperRef = useRef<HTMLDivElement | null>(null);
  const isLoggedIn = user?.isLoggedIn || initialUser?.isLoggedIn || false;

  useEffect(() => {
    if (typeof window !== "undefined") {
      useProfileStore.getState().getSessionStorage();
    }
  }, []);

  /**
   * Show nothing if a user is not yet logged in
   */
  if (!isLoggedIn || !user?.isActive) {
    return <></>;
  }

  const isShowingProfilesGate = () => {
    return (
      pageAPI === "manage-profiles" ||
      (user && user.isActive === true && isLoggedIn && !activeProfileID)
    );
  };

  /**
   * Load the media content once a profile is created or selected
   */
  if (isShowingProfilesGate()) {
    return (
      <ProfileGate
        {...{
          user,
          profiles,
          error,
          mutate,
          isLoading,
          isValidating,
          manageProfilesModeEnabled: pageAPI === "manage-profiles",
        }}
      />
    );
  }

  /**
   * Load the media content once a profile is created or selected
   */
  return (
    <BrowseLayout
      key={activeProfileID}
      ref={layoutWrapperRef}
      {...{
        user,
        logout,
        isLoggedIn,
        isActive: user?.isActive,
        activeProfile: user?.activeProfile,
        profile: activeProfileID,
        title: pageTitle,
      }}
    >
      <Media ref={layoutWrapperRef} pageAPI={pageAPI} />
    </BrowseLayout>
  );
};

export default BrowseContainer;
