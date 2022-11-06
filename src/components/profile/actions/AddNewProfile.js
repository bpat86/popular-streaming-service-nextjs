import { Field, Form, Formik, useFormikContext } from "formik";
import { useContext, useEffect, useState } from "react";
import * as yup from "yup";

import Profile from "@/components/layouts/ProfileGateLayout";
import SelectAvatar from "@/components/profile/actions/SelectAvatar";
import Name from "@/components/profile/fields/Name";
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
  user,
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
            <div className="fade-in mt-20 mb-12 flex min-h-full w-full flex-col items-center justify-center sm:fixed sm:inset-0 sm:my-0 sm:h-screen">
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
                  <Form className="mx-auto block w-full px-6 lg:w-3/4 xl:w-2/5">
                    <h1 className="my-3 block text-3xl font-semibold text-white sm:my-6 sm:text-6xl">
                      Add Profile
                    </h1>
                    <h2 className="text-xl text-gray-400 sm:text-2xl">
                      Add a profile for another person watching Netflix.
                    </h2>
                    <div className="my-5 flex w-full border-t border-b border-gray-700 py-4">
                      <div className="my-3 flex w-full cursor-pointer items-center text-center">
                        <div
                          className="group relative"
                          onClick={() =>
                            values.name
                              ? openAvatarSelectionPrompt()
                              : submitForm()
                          }
                        >
                          <div
                            className="profile-avatar xs:w-20 xs:h-20 mx-auto flex h-16 w-16 flex-col rounded-md bg-cover text-white md:h-36 md:w-36"
                            style={{
                              backgroundImage: `url("/images/profiles/avatars/${
                                currentAvatar || defaultAvatar
                              }.png")`,
                            }}
                          ></div>
                          {/* Hovered */}
                          <div className="pointer-events-none absolute inset-0 -z-1 flex items-center justify-center bg-black bg-opacity-60 opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:z-auto group-hover:opacity-100">
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
                          <div className="flex h-5 items-center">
                            <Field
                              id="kid"
                              aria-describedby="kid-description"
                              name="kid"
                              type="checkbox"
                              onChange={handleChange}
                              className="h-6 w-6 cursor-pointer border border-gray-700 bg-gray-900 text-gray-900 outline-none ring-1 ring-gray-500 focus:ring-0 sm:h-8 sm:w-8"
                            />
                            <label
                              htmlFor="kid"
                              className="cursor-pointer pl-2 text-left font-medium leading-none text-white"
                            >
                              Kid?
                            </label>
                          </div>
                          <div className="tooltip absolute bottom-0 mb-10 ml-8 hidden w-72 scale-95 transform flex-col items-end justify-end opacity-0 transition duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 sm:flex md:items-center">
                            <span className="whitespace-no-wrap relative z-10 bg-white px-4 py-3 text-lg font-medium leading-none text-gray-900">
                              If selected, this profile will only see TV shows
                              and movies rated for ages 12 and under.
                            </span>
                            <div className="-mt-3 h-5 w-5 rotate-45 transform bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col border-b border-gray-700 sm:pb-4">
                      <h2 className="mb-1 text-2xl text-gray-400">
                        Autoplay controls
                      </h2>
                      <div className="group my-3 flex w-full cursor-pointer flex-col items-start text-center">
                        <div className="relative mb-5 flex flex-col items-start sm:mb-3">
                          <div className="flex h-5 items-center">
                            <Field
                              id="autoPlayNextEpisode"
                              aria-describedby="autoPlayNextEpisode-description"
                              name="autoPlayNextEpisode"
                              type="checkbox"
                              onChange={handleChange}
                              className="h-6 w-6 cursor-pointer border border-gray-700 bg-gray-900 text-gray-900 outline-none ring-1 ring-gray-500 focus:ring-0 sm:h-8 sm:w-8"
                            />
                            <label
                              htmlFor="autoPlayNextEpisode"
                              className="cursor-pointer pl-2 text-left font-medium leading-none text-white"
                            >
                              Autoplay next episode in a series on all devices.
                            </label>
                          </div>
                        </div>
                        <div className="group my-3 flex w-full cursor-pointer items-center text-center">
                          <div className="relative mb-3 flex flex-col items-start">
                            <div className="flex h-5 items-center">
                              <Field
                                id="autoPlayPreviews"
                                aria-describedby="autoPlayPreviews-description"
                                name="autoPlayPreviews"
                                type="checkbox"
                                onChange={handleChange}
                                className="h-6 w-6 cursor-pointer border border-gray-700 bg-gray-900 text-gray-900 outline-none ring-1 ring-gray-500 focus:ring-0 sm:h-8 sm:w-8"
                              />
                              <label
                                htmlFor="autoPlayPreviews"
                                className="cursor-pointer pl-2 text-left font-medium leading-none text-white"
                              >
                                Autoplay previews while browsing on all devices.
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="my-4 mt-8 flex sm:mt-12">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center bg-white px-6 py-2 text-sm font-bold uppercase tracking-widest text-gray-900 hover:bg-netflix-red hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none sm:text-2xl"
                      >
                        {isSubmitting ? (
                          <>
                            Processing
                            <svg
                              className="ml-3 -mr-1 h-6 w-6 motion-safe:animate-spin"
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
                        className="ml-6 border border-gray-400 bg-transparent px-6 py-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none sm:text-2xl"
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
