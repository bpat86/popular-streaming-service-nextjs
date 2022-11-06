import { useContext, useEffect } from "react";

import Profile from "@/components/layouts/ProfileGateLayout";
import ProfileContext from "@/context/ProfileContext";

const WhosWatching = ({
  profiles,
  profileNames,
  loadingProfiles,
  mutateProfiles,
  user,
  isLoggedIn,
}) => {
  const {
    loading,
    error,
    setError,
    formDataContext,
    setFormDataContext,
    profileID,
    setProfileID,
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
    updateAvatar,
    createProfile,
    getUpdatedProfile,
    updateProfile,
    deleteProfile,
    avatar,
    setAvatar,
    selectAvatarPrompt,
    setSelectAvatarPrompt,
    avatarConfirmPrompt,
    setAvatarConfirmPrompt,
    deleteProfilePrompt,
    setDeleteProfilePrompt,
    addNewProfile,
    setAddNewProfile,
    editProfile,
    setEditProfile,
    manageProfiles,
    setManageProfiles,
    manageProfilesHandler,
    resetAvatarSelection,
    closeAvatarConfirmPrompt,
    closeSelectAvatarPrompt,
    resetFormState,
    makeProfileActive,
    activeProfile,
  } = useContext(ProfileContext);

  const profileContextProps = {
    loading,
    error,
    setError,
    user,
    isLoggedIn,
    loadingProfiles,
    profiles,
    profileNames,
    formDataContext,
    setFormDataContext,
    profileID,
    setProfileID,
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
    updateAvatar,
    createProfile,
    getUpdatedProfile,
    updateProfile,
    deleteProfile,
    avatar,
    setAvatar,
    selectAvatarPrompt,
    setSelectAvatarPrompt,
    avatarConfirmPrompt,
    setAvatarConfirmPrompt,
    deleteProfilePrompt,
    setDeleteProfilePrompt,
    addNewProfile,
    setAddNewProfile,
    editProfile,
    setEditProfile,
    manageProfiles,
    setManageProfiles,
    manageProfilesHandler,
    resetAvatarSelection,
    closeAvatarConfirmPrompt,
    closeSelectAvatarPrompt,
    resetFormState,
    makeProfileActive,
    activeProfile,
  };

  /**
   * Open the Add New Profile prompt
   */
  const addNewProfileHandler = () => {
    resetFormState();
    setAddNewProfile(true);
  };

  /**
   * Get the updated profile data and open the Edit Profile prompt
   * @param {Object} profile
   */
  const editProfileHandler = (profile) => {
    getUpdatedProfile(profile);
    setProfileID(profile.id);
    setEditProfile(true);
  };

  /**
   * Set profile as active when clicked
   * @param {Object} profile
   */
  const setActiveProfile = (profile) => {
    const { id } = profile;
    const { name, kid, autoPlayNextEpisode, autoPlayPreviews, avatar } =
      profile.attributes;
    const activeProfile = {
      id,
      attributes: {
        id,
        name,
        kid,
        autoPlayNextEpisode,
        autoPlayPreviews,
        avatar,
      },
    };
    makeProfileActive(activeProfile);
  };

  useEffect(() => {
    mutateProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Profile {...profileContextProps}>
        <div className="fixed inset-0">
          <div className="fade-in fixed inset-0 flex flex-col items-center justify-center">
            <h1 className="block text-4xl font-medium tracking-wide text-white sm:text-6xl">
              {manageProfiles ? <>Manage Profiles:</> : <>Who's watching?</>}
            </h1>
            <ul className="my-8 mb-20 flex w-full flex-row flex-wrap justify-center space-x-8">
              {!loadingProfiles && profiles ? (
                profiles.map((profile) => (
                  <li
                    key={profile.id}
                    className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center"
                  >
                    <div className="relative">
                      <div
                        className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover ring-inset group-hover:ring-4 group-hover:ring-white md:h-44 md:w-44"
                        style={{
                          backgroundImage: `url("/images/profiles/avatars/${profile.attributes.avatar}.png")`,
                        }}
                        onClick={() => setActiveProfile(profile)}
                      ></div>
                      {manageProfiles && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                          onClick={() => editProfileHandler(profile)}
                        >
                          <div className="rounded-full border-2 border-white p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <dl className="mt-4 flex flex-grow flex-col justify-between">
                      <dt className="sr-only">Profile name: Stephanie</dt>
                      <dd className="text-2xl text-gray-400 group-hover:text-white">
                        {profile.attributes.name}
                      </dd>
                    </dl>
                  </li>
                ))
              ) : (
                // Skeleton
                <>
                  <li className="my-3 flex animate-pulse flex-col items-center justify-center text-center">
                    <div className="relative">
                      <div className="profile-avatar-loading mx-auto flex h-32 w-32 flex-col rounded-md bg-gray-800 md:h-44 md:w-44"></div>
                    </div>
                    <dl className="mt-3 flex flex-grow flex-col items-center justify-center">
                      <dd className="h-6 w-24 rounded-xl bg-gray-800"></dd>
                    </dl>
                  </li>
                  <li className="my-3 flex animate-pulse flex-col items-center justify-center text-center">
                    <div className="relative">
                      <div className="profile-avatar-loading mx-auto flex h-32 w-32 flex-col rounded-md bg-gray-800 md:h-44 md:w-44"></div>
                    </div>
                    <dl className="mt-3 flex flex-grow flex-col items-center justify-center">
                      <dd className="h-6 w-24 rounded-xl bg-gray-800"></dd>
                    </dl>
                  </li>
                </>
              )}
              {!loadingProfiles && profiles ? (
                <button
                  type="button"
                  className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center focus:outline-none"
                  aria-label="Add a profile"
                  onClick={() => addNewProfileHandler()}
                >
                  <div className="profile-avatar mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-md	transition duration-200 ease-out group-hover:bg-white md:h-44 md:w-44">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-32 w-32 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <dl className="mt-4 flex flex-grow flex-col justify-between">
                    <dt className="sr-only">Add Profile</dt>
                    <dd className="text-2xl text-gray-400 group-hover:text-white">
                      Add Profile
                    </dd>
                  </dl>
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Loading..."
                  className="my-3 flex animate-pulse flex-col items-center justify-center text-center"
                >
                  <div className="relative">
                    <div className="profile-avatar-loading mx-auto flex h-32 w-32 flex-col rounded-md bg-gray-800 md:h-44 md:w-44"></div>
                  </div>
                  <dl className="mt-3 flex flex-grow flex-col items-center justify-center">
                    <dd className="h-6 w-24 rounded-xl bg-gray-800"></dd>
                  </dl>
                </button>
              )}
            </ul>
            {!loadingProfiles && profiles ? (
              <span>
                {manageProfiles ? (
                  <button
                    type="button"
                    aria-label="Manage Profiles"
                    className="border border-transparent bg-white px-8 py-3 text-xl font-medium  tracking-widest text-gray-900 hover:bg-netflix-red hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none"
                    onClick={() => manageProfilesHandler()}
                  >
                    Done
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Manage Profiles"
                    className="border border-gray-400 px-8 py-3 text-xl font-medium tracking-widest text-gray-400 hover:border-white hover:text-white focus:outline-none"
                    onClick={() => manageProfilesHandler()}
                  >
                    Manage Profiles
                  </button>
                )}
              </span>
            ) : (
              <span>
                <button
                  type="button"
                  aria-label="Manage Profiles"
                  className="mt-2 animate-pulse border border-gray-400 px-8 py-3 text-xl font-medium tracking-widest text-gray-400 focus:outline-none"
                >
                  Loading Profiles...
                </button>
              </span>
            )}
          </div>
        </div>
      </Profile>
    </>
  );
};

export default WhosWatching;
