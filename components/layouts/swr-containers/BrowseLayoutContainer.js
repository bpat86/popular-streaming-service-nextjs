import { useContext, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Contexts
 */
import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import InteractionContext from "@/context/InteractionContext";

/**
 * Middlewares
 */
import useUser from "@/middleware/useUser";
import useProfiles from "@/middleware/useProfiles";
/**
 * Reducers
 */
// import { usePreviewModalState } from "reducers/usePreviewModalState";

/**
 * Components
 */
import BrowseLayout from "@/components/layouts/browse/BrowseLayout";
import MediaContainer from "@/components/layouts/browse/MediaContainer";
import UserProfiles from "@/components/profile/UserProfiles";

const BrowseLayoutContainer = (props) => {
  const {
    pageAPI,
    pageTitle,
    shouldFreeze,
    activeProfile: initialActiveProfile,
  } = props;
  // Context
  const { logout } = useContext(AuthContext);
  const { isDetailModal, parentStyles, scrollPosition } =
    useContext(InteractionContext);

  // Middleware
  const { user, mutateUser } = useUser({
    redirectTo: "/",
  });
  const { profiles, profileNames, loadingProfiles, mutateProfiles } =
    useProfiles({ user });

  // Refs
  const layoutWrapperRef = useRef();

  const {
    loading,
    error,
    setError,
    formDataContext,
    setFormDataContext,
    profileId,
    setProfileId,
    name,
    setName,
    kid,
    setKid,
    autoPlayNextEpisode,
    setAutoPlayNextEpisode,
    autoPlayPreviews,
    setAutoPlayPreviews,
    defaultAvatar,
    setDefaultAvatar,
    currentAvatar,
    setCurrentAvatar,
    previousAvatar,
    setPreviousAvatar,
    avatar,
    setAvatar,
    addNewProfile,
    setAddNewProfile,
    editProfile,
    setEditProfile,
    manageProfiles,
    setManageProfiles,
    manageProfilesHandler,
    selectAvatarPrompt,
    setSelectAvatarPrompt,
    avatarConfirmPrompt,
    setAvatarConfirmPrompt,
    deleteProfilePrompt,
    setDeleteProfilePrompt,
    updateAvatar,
    createProfile,
    getUpdatedProfile,
    updateProfile,
    deleteProfile,
    resetAvatarSelection,
    closeAvatarConfirmPrompt,
    closeSelectAvatarPrompt,
    resetFormState,
    makeProfileActive,
    activeProfile,
  } = useContext(ProfileContext);

  const userData = {
    user,
    logout,
    isActive: user?.isActive,
    isLoggedIn: user?.isLoggedIn,
    activeProfile: user?.activeProfile,
  };

  const profilesState = {
    loading,
    error,
    setError,
    formDataContext,
    setFormDataContext,
    profileId,
    setProfileId,
    name,
    setName,
    kid,
    setKid,
    autoPlayNextEpisode,
    setAutoPlayNextEpisode,
    autoPlayPreviews,
    setAutoPlayPreviews,
    defaultAvatar,
    setDefaultAvatar,
    currentAvatar,
    setCurrentAvatar,
    previousAvatar,
    setPreviousAvatar,
    avatar,
    setAvatar,
    addNewProfile,
    setAddNewProfile,
    editProfile,
    setEditProfile,
    manageProfiles,
    setManageProfiles,
    manageProfilesHandler,
    selectAvatarPrompt,
    setSelectAvatarPrompt,
    avatarConfirmPrompt,
    setAvatarConfirmPrompt,
    deleteProfilePrompt,
    setDeleteProfilePrompt,
    updateAvatar,
    createProfile,
    getUpdatedProfile,
    updateProfile,
    deleteProfile,
    resetAvatarSelection,
    closeAvatarConfirmPrompt,
    closeSelectAvatarPrompt,
    resetFormState,
    makeProfileActive,
    activeProfile,
  };

  const profilesData = {
    // ...profilesState,
    profiles,
    profileNames,
    mutateProfiles,
    loadingProfiles,
  };

  /**
   * Show nothing if a user is not yet logged in
   */
  if (!user?.isLoggedIn || !user?.isActive) {
    return <></>;
  }

  const isShowingProfilesGate = () => {
    return user?.isActive && user?.isLoggedIn && !activeProfile?.id;
  };

  const pageProps = {
    ...userData,
    ...profilesData,
    parentStyles,
    scrollPosition,
    isDetailModal,
  };

  /**
   * Load the media content once a profile is created or selected
   */
  return isShowingProfilesGate() ? (
    <UserProfiles user={user} />
  ) : (
    <BrowseLayout
      key={activeProfile?.id}
      ref={layoutWrapperRef}
      profile={activeProfile?.id}
      title={pageTitle}
      {...pageProps}
    >
      <MediaContainer
        key={activeProfile?.id}
        ref={layoutWrapperRef}
        pageAPI={pageAPI}
        shouldFreeze={shouldFreeze}
      />
    </BrowseLayout>
  );
};

export default BrowseLayoutContainer;

BrowseLayoutContainer.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};
