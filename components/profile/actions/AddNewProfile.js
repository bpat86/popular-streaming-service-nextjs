import { useState, useEffect, useContext } from "react";
import { useFormikContext, Formik, Form, Field } from "formik";
import * as yup from "yup";

import Profile from "@/components/layouts/ProfilesLayout";
import Name from "@/components/profile/fields/Name";
import SelectAvatar from "@/components/profile/actions/SelectAvatar";

import ProfileContext from "@/context/ProfileContext";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const validationSchema = yup.object({
  name: yup
    .string()
    .min(1, "Name must be at least 1 character")
    .max(12, "Name must be fewer than 12 characters")
    .required("Name is required"),
});

const AddNewProfile = ({
  config,
  loadingProfiles,
  profiles,
  profileNames,
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

  const [existingName, setExistingName] = useState(null);

  /**
   * Open the avatar selection screen prompt
   */
  const openAvatarSelectionPrompt = () => {
    setManageProfiles(false);
    // Set the name text value in the context
    setFormDataContext({ name, kid, autoPlayNextEpisode, autoPlayPreviews });
    // Set open select avatar screen to true
    setSelectAvatarPrompt(true);
  };

  /**
   * Return to step one without creating a profile
   */
  const cancelProfile = () => {
    // Reset the form context to default values
    resetFormState();
    // Return to the who's watching screen
    closeSelectAvatarPrompt();
  };

  /**
   * Create a new user profile
   * @param {Object} values
   */
  const submitProfile = async (values) => {
    const profileData = {
      user: user.id,
      name: values.name,
      avatar: currentAvatar,
      kid: values.kid,
      autoPlayNextEpisode: values.autoPlayNextEpisode,
      autoPlayPreviews: values.autoPlayPreviews,
    };
    setFormDataContext(profileData);
    createProfile(profileData, config);
  };

  /**
   * Set form data state as the user types
   * @returns
   */
  const HandleInputOnChange = () => {
    // Get form input values from Formik's context
    const { values } = useFormikContext();
    // Listen for changes
    useEffect(() => {
      values.name !== existingName ? setError(null) : null;
      setName(values.name);
      setKid(values.kid);
      setAutoPlayNextEpisode(values.autoPlayNextEpisode);
      setAutoPlayPreviews(values.autoPlayPreviews);
      return () => {};
    }, [
      values.name,
      values.kid,
      values.autoPlayNextEpisode,
      values.autoPlayPreviews,
    ]);
    return null;
  };

  return (
    <>
      {selectAvatarPrompt ? (
        // Select avatar screen
        <SelectAvatar {...profileContextProps} />
      ) : (
        // Create a profile screen
        <Profile {...profileContextProps}>
          <div className="fixed inset-0 overflow-y-scroll sm:overflow-hidden">
            <div className="sm:fixed sm:inset-0 flex flex-col items-center justify-center w-full min-h-full sm:h-screen mt-20 mb-12 sm:my-0 fade-in">
              <Formik
                initialValues={formDataContext}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  await sleep(250);
                  if (!profileNames.includes(values.name)) {
                    submitProfile(values);
                    setError(null);
                  } else {
                    setExistingName(values.name);
                    setError("Profile name already exists");
                  }
                }}
                onReset={() => {
                  cancelProfile();
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                  submitForm,
                }) => (
                  <Form className="block w-full lg:w-3/4 xl:w-2/5 mx-auto px-6">
                    <h1 className="block text-white text-3xl sm:text-6xl font-semibold my-3 sm:my-6">
                      Add Profile
                    </h1>
                    <h2 className="text-gray-400 text-xl sm:text-2xl">
                      Add a profile for another person watching Netflix.
                    </h2>
                    <div className="flex w-full my-5 border-t border-b border-gray-700 py-4">
                      <div className="flex items-center w-full text-center my-3 cursor-pointer">
                        <div
                          className="group relative"
                          onClick={() =>
                            values.name
                              ? openAvatarSelectionPrompt()
                              : submitForm()
                          }
                        >
                          <div
                            className="profile-avatar w-16 h-16 xs:w-20 xs:h-20 md:w-36 md:h-36 flex flex-col mx-auto bg-cover rounded-md text-white"
                            style={{
                              backgroundImage: `url("/images/profiles/avatars/${
                                currentAvatar || defaultAvatar
                              }.png")`,
                            }}
                          ></div>
                          {/* Hovered */}
                          <div className="opacity-0 -z-1 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:z-auto absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 transition ease-out duration-150">
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
                        </div>
                        <div className="w-full px-3 sm:px-6">
                          <Name
                            type="text"
                            id="name"
                            name="name"
                            maxLength="15"
                            minLength="1"
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            value={values.name || ""}
                            errors={errors.name}
                            touched={touched.name}
                            placeholder="Name"
                            strapiError={error}
                          />
                        </div>
                        <div className="group relative flex flex-col items-center justify-start">
                          <div className="flex items-center h-5">
                            <Field
                              id="kid"
                              aria-describedby="kid-description"
                              name="kid"
                              type="checkbox"
                              onChange={handleChange}
                              className="ring-1 ring-gray-500 focus:ring-0 outline-none w-6 h-6 sm:h-8 sm:w-8 text-gray-900 border border-gray-700 bg-gray-900 cursor-pointer"
                            />
                            <label
                              htmlFor="kid"
                              className="font-medium text-white text-left leading-none pl-2 cursor-pointer"
                            >
                              Kid?
                            </label>
                          </div>
                          <div className="tooltip hidden absolute bottom-0 sm:flex flex-col items-end md:items-center justify-end w-72 mb-10 ml-8 transform transition opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 ease-out duration-150">
                            <span className="relative z-10 px-4 py-3 text-lg font-medium leading-none text-gray-900 whitespace-no-wrap bg-white">
                              If selected, this profile will only see TV shows
                              and movies rated for ages 12 and under.
                            </span>
                            <div className="w-5 h-5 -mt-3 transform rotate-45 bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col w-full border-b border-gray-700 sm:pb-4">
                      <h2 className="text-gray-400 text-2xl mb-1">
                        Autoplay controls
                      </h2>
                      <div className="group flex flex-col items-start w-full text-center my-3 cursor-pointer">
                        <div className="relative flex flex-col items-start mb-5 sm:mb-3">
                          <div className="flex items-center h-5">
                            <Field
                              id="autoPlayNextEpisode"
                              aria-describedby="autoPlayNextEpisode-description"
                              name="autoPlayNextEpisode"
                              type="checkbox"
                              onChange={handleChange}
                              className="ring-1 ring-gray-500 focus:ring-0 outline-none w-6 h-6 sm:h-8 sm:w-8 text-gray-900 border border-gray-700 bg-gray-900 cursor-pointer"
                            />
                            <label
                              htmlFor="autoPlayNextEpisode"
                              className="font-medium text-white text-left leading-none pl-2 cursor-pointer"
                            >
                              Autoplay next episode in a series on all devices.
                            </label>
                          </div>
                        </div>
                        <div className="group flex items-center w-full text-center my-3 cursor-pointer">
                          <div className="relative flex flex-col items-start mb-3">
                            <div className="flex items-center h-5">
                              <Field
                                id="autoPlayPreviews"
                                aria-describedby="autoPlayPreviews-description"
                                name="autoPlayPreviews"
                                type="checkbox"
                                onChange={handleChange}
                                className="ring-1 ring-gray-500 focus:ring-0 outline-none w-6 h-6 sm:h-8 sm:w-8 text-gray-900 border border-gray-700 bg-gray-900 cursor-pointer"
                              />
                              <label
                                htmlFor="autoPlayPreviews"
                                className="font-medium text-white text-left leading-none pl-2 cursor-pointer"
                              >
                                Autoplay previews while browsing on all devices.
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex my-4 mt-8 sm:mt-12">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center bg-white hover:bg-netflix-red focus:bg-netflix-red text-gray-900 hover:text-white focus:text-white text-sm sm:text-2xl font-bold uppercase tracking-widest focus:outline-none px-6 py-2"
                      >
                        {isSubmitting ? (
                          <>
                            Processing
                            <svg
                              className="motion-safe:animate-spin ml-3 -mr-1 h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </>
                        ) : (
                          <>Continue</>
                        )}
                      </button>
                      <button
                        type="reset"
                        className="bg-transparent border border-gray-400 hover:border-white focus:border-white text-gray-400 hover:text-white focus:text-white text-sm sm:text-2xl font-bold uppercase tracking-widest focus:outline-none px-6 py-2 ml-6"
                      >
                        Cancel
                      </button>
                    </div>
                    <HandleInputOnChange />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Profile>
      )}
    </>
  );
};

export default AddNewProfile;
