import PropTypes from "prop-types";
import { Fragment, useContext, useRef } from "react";

// Components
import BrowseLayout from "@/components/layouts/browse/BrowseLayout";
import MediaContainer from "@/components/layouts/browse/MediaContainer";
import UserProfiles from "@/components/profile/UserProfiles";
// Context
import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import useProfiles from "@/middleware/useProfiles";
// Middleware
import useUser from "@/middleware/useUser";

const BrowseLayoutContainer = ({
  pageAPI,
  pageTitle,
  shouldFreeze,
  // activeProfile: initialActiveProfile,
}) => {
  // Context
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
  const userData = {
    user,
    logout,
    isActive: user?.isActive,
    isLoggedIn: user?.isLoggedIn,
    activeProfile: user?.activeProfile,
  };
  const profilesData = {
    profiles,
    profileNames,
    mutateProfiles,
    loadingProfiles,
  };
  const pageProps = Object.assign(userData, profilesData);

  /**
   * Show nothing if a user is not yet logged in
   */
  if (!user?.isLoggedIn || !user?.isActive) {
    return <></>;
  }

  const isShowingProfilesGate = () => {
    return user?.isActive && user?.isLoggedIn && !activeProfile?.id;
  };

  /**
   * Load the media content once a profile is created or selected
   */
  return isShowingProfilesGate() ? (
    <UserProfiles user={user} />
  ) : (
    <Fragment key={activeProfile?.id}>
      <BrowseLayout
        ref={layoutWrapperRef}
        profile={activeProfile?.id}
        title={pageTitle}
        {...pageProps}
      >
        <MediaContainer
          ref={layoutWrapperRef}
          pageAPI={pageAPI}
          shouldFreeze={shouldFreeze}
        />
      </BrowseLayout>
    </Fragment>
  );
};

export default BrowseLayoutContainer;

BrowseLayoutContainer.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};
