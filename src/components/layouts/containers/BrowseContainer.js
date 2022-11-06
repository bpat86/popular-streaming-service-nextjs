import PropTypes from "prop-types";
import { Fragment, useContext, useRef } from "react";

import BrowseLayout from "@/components/layouts/BrowseLayout";
import MediaContainer from "@/components/layouts/containers/MediaContainer";
import UserProfiles from "@/components/profile/UserProfiles";
import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import useProfiles from "@/middleware/useProfiles";
// Middleware
import useUser from "@/middleware/useUser";

const BrowseContainer = ({ initialUser, pageAPI, pageTitle }) => {
  const { logout } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);
  // Middleware
  const { user } = useUser({
    redirectTo: "/",
  });
  const { profiles, profileNames, loadingProfiles, mutateProfiles } =
    useProfiles({ user });
  // Refs
  const layoutWrapperRef = useRef();
  // Local vars
  const activeProfileId =
    activeProfile?.id || initialUser?.activeProfile?.id || null;
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
        profile={activeProfileId}
        title={pageTitle}
        {...pageProps}
      >
        <MediaContainer ref={layoutWrapperRef} pageAPI={pageAPI} />
      </BrowseLayout>
    </Fragment>
  );
};

export default BrowseContainer;

BrowseContainer.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};
