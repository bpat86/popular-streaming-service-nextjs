import { Form, Formik } from "formik";

import Profile from "@/components/layouts/ProfileGateLayout";

import SelectAvatar from "./SelectAvatar";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DeleteConfirm = (props) => {
  // Get state from our props
  const {
    formDataContext,
    setFormDataContext,
    name,
    profileID,
    defaultAvatar,
    currentAvatar,
    deleteProfile,
    selectAvatarPrompt,
    closeSelectAvatarPrompt,
    resetFormState,
  } = props;

  /**
   * Return to step one without editing a profile
   */
  const cancelDelete = () => {
    resetFormState();
    // Return to the who's watching screen
    closeSelectAvatarPrompt();
  };

  /**
   * Delete a profile
   * @param {Object} values
   */
  const submitDeleteProfile = async () => {
    const profile = {
      profileID,
    };
    setFormDataContext(profile);
    deleteProfile(profile);
  };

  return (
    <>
      {selectAvatarPrompt ? (
        // Select avatar screen
        <SelectAvatar {...props} />
      ) : (
        // Edit a profile screen
        <Profile {...props} title="Delete Profile">
          <div className="fixed inset-0 overflow-y-scroll sm:overflow-hidden">
            <div className="fade-in mt-20 mb-12 flex min-h-full w-full flex-col items-center justify-center sm:fixed sm:inset-0 sm:my-0 sm:h-screen">
              <Formik
                initialValues={formDataContext}
                onSubmit={async () => {
                  await sleep(250);
                  submitDeleteProfile();
                }}
                onReset={() => {
                  cancelDelete();
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="mx-auto block w-full px-6 lg:w-3/4 xl:w-2/5">
                    <h1 className="block text-3xl font-semibold text-white sm:text-6xl">
                      Delete Profile?
                    </h1>
                    <div className="my-5 flex w-full border-t border-b border-zinc-700 py-4">
                      <div className="my-3 flex w-full items-center text-center">
                        <div className="relative">
                          <div
                            className="profile-avatar xs:w-20 xs:h-20 mx-auto flex h-16 w-16 flex-col rounded-md bg-cover text-white md:h-36 md:w-36"
                            style={{
                              backgroundImage: `url("/images/profiles/avatars/${
                                currentAvatar || defaultAvatar
                              }.png")`,
                            }}
                          ></div>
                          <div className="mt-3 text-zinc-400">
                            {name || formDataContext.name}
                          </div>
                        </div>
                        <div className="group relative flex flex-col items-center justify-center">
                          <div className="flex h-5 items-center justify-center">
                            <div className="pl-6 text-left text-lg text-white sm:text-xl">
                              This profile's history — including My List,
                              ratings and activity — will be gone forever, and
                              you won't be able to access it again.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="my-4 mt-8 flex space-x-3 sm:mt-12 sm:space-x-6">
                      <button
                        type="button"
                        className="bg-white px-6 py-2 text-sm font-bold uppercase tracking-widest text-zinc-900 hover:bg-netflix-red hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none sm:text-2xl"
                        onClick={() => cancelDelete()}
                      >
                        Keep Profile
                      </button>
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center border border-zinc-400 bg-transparent px-6 py-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none sm:text-2xl"
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
                          <>Delete Profile</>
                        )}
                      </button>
                    </div>
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

export default DeleteConfirm;
