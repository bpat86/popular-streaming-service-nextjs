import { useContext, useEffect } from "react";
import Profile from "@/components/layouts/ProfilesLayout";
import ProfileContext from "@/context/ProfileContext";

const WhosWatching = ({
  profiles,
  profileNames,
  loadingProfiles,
  mutateProfiles,
  title,
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
    // console.log("profile:::: ", profile);
  };

  useEffect(() => {
    mutateProfiles();
  }, []);

  return (
    <>
      <Profile {...profileContextProps}>
        <div className="fixed inset-0">
          <div className="fixed inset-0 flex flex-col items-center justify-center fade-in">
            <h1 className="block text-white text-4xl sm:text-6xl font-medium tracking-wide">
              {manageProfiles ? <>Manage Profiles:</> : <>Who's watching?</>}
            </h1>
            <ul className="flex flex-row flex-wrap justify-center w-full my-8 mb-20 space-x-8">
              {!loadingProfiles && profiles ? (
                profiles.map((profile) => (
                  <li
                    key={profile.id}
                    className="group flex flex-col items-center justify-center text-center my-3 cursor-pointer"
                  >
                    <div className="relative">
                      <div
                        className="profile-avatar w-32 h-32 md:w-44 md:h-44 flex flex-col ring-inset group-hover:ring-4 group-hover:ring-white mx-auto bg-cover rounded-md"
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
                          <div className="border-2 border-white rounded-full p-1">
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
                    <dl className="mt-4 flex-grow flex flex-col justify-between">
                      <dt className="sr-only">Profile name: Stephanie</dt>
                      <dd className="text-gray-400 group-hover:text-white text-2xl">
                        {profile.attributes.name}
                      </dd>
                    </dl>
                  </li>
                ))
              ) : (
                // Skeleton
                <>
                  <li className="flex flex-col items-center justify-center text-center my-3 animate-pulse">
                    <div className="relative">
                      <div className="profile-avatar-loading bg-gray-800 w-32 h-32 md:w-44 md:h-44 flex flex-col mx-auto rounded-md"></div>
                    </div>
                    <dl className="flex-grow flex flex-col items-center justify-center mt-3">
                      <dd className="bg-gray-800 w-24 h-6 rounded-xl"></dd>
                    </dl>
                  </li>
                  <li className="flex flex-col items-center justify-center text-center my-3 animate-pulse">
                    <div className="relative">
                      <div className="profile-avatar-loading bg-gray-800 w-32 h-32 md:w-44 md:h-44 flex flex-col mx-auto rounded-md"></div>
                    </div>
                    <dl className="flex-grow flex flex-col items-center justify-center mt-3">
                      <dd className="bg-gray-800 w-24 h-6 rounded-xl"></dd>
                    </dl>
                  </li>
                </>
              )}
              {!loadingProfiles && profiles ? (
                <button
                  type="button"
                  className="group flex flex-col items-center justify-center text-center my-3 cursor-pointer focus:outline-none"
                  aria-label="Add a profile"
                  onClick={() => addNewProfileHandler()}
                >
                  <div className="profile-avatar w-32 h-32 md:w-44 md:h-44 flex flex-col items-center justify-center	group-hover:bg-white mx-auto rounded-md transition ease-out duration-200">
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
                  <dl className="mt-4 flex-grow flex flex-col justify-between">
                    <dt className="sr-only">Add Profile</dt>
                    <dd className="text-gray-400 group-hover:text-white text-2xl">
                      Add Profile
                    </dd>
                  </dl>
                </button>
              ) : (
                <button
                  type={"button"}
                  aria-label="Loading..."
                  className="flex flex-col items-center justify-center text-center my-3 animate-pulse"
                >
                  <div className="relative">
                    <div className="profile-avatar-loading bg-gray-800 w-32 h-32 md:w-44 md:h-44 flex flex-col mx-auto rounded-md"></div>
                  </div>
                  <dl className="flex-grow flex flex-col items-center justify-center mt-3">
                    <dd className="bg-gray-800 w-24 h-6 rounded-xl"></dd>
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
                    className="bg-white hover:bg-netflix-red focus:bg-netflix-red text-gray-900 hover:text-white focus:text-white font-medium  text-xl tracking-widest px-8 py-3 border border-transparent focus:outline-none"
                    onClick={() => manageProfilesHandler()}
                  >
                    Done
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-label="Manage Profiles"
                    className="font-medium text-xl text-gray-400 hover:text-white tracking-widest px-8 py-3 border border-gray-400 hover:border-white focus:outline-none"
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
                  className="font-medium text-xl text-gray-400 tracking-widest mt-2 px-8 py-3 border border-gray-400 focus:outline-none animate-pulse"
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
