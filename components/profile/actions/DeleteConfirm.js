import { useState, useEffect } from "react";
import { Formik, Form } from "formik";

import Profile from "@/components/layouts/ProfilesLayout";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DeleteConfirm = (props) => {
  // Get state from our props
  const {
    user,
    config,
    loading,
    error,
    formDataContext,
    setFormDataContext,
    name,
    profileID,
    defaultAvatar,
    setDefaultAvatar,
    previousAvatar,
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
    console.log("config: ", config);
    console.log("submitDeleteProfile profileID: ", profileID);
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
            <div className="sm:fixed sm:inset-0 flex flex-col items-center justify-center w-full min-h-full sm:h-screen mt-20 mb-12 sm:my-0 fade-in">
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
                  <Form className="block w-full lg:w-3/4 xl:w-2/5 mx-auto px-6">
                    <h1 className="block text-white text-3xl sm:text-6xl font-semibold">
                      Delete Profile?
                    </h1>
                    <div className="flex w-full my-5 border-t border-b border-gray-700 py-4">
                      <div className="flex items-center w-full text-center my-3">
                        <div className="relative">
                          <div
                            className="profile-avatar w-16 h-16 xs:w-20 xs:h-20 md:w-36 md:h-36 flex flex-col mx-auto bg-cover rounded-md text-white"
                            style={{
                              backgroundImage: `url("/images/profiles/avatars/${
                                currentAvatar || defaultAvatar
                              }.png")`,
                            }}
                          ></div>
                          <div className="text-gray-400 mt-3">
                            {name || formDataContext.name}
                          </div>
                        </div>
                        <div className="group relative flex flex-col items-center justify-center">
                          <div className="flex items-center justify-center h-5">
                            <div className="text-lg sm:text-xl text-white text-left pl-6">
                              This profile's history — including My List,
                              ratings and activity — will be gone forever, and
                              you won't be able to access it again.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex my-4 mt-8 sm:mt-12 space-x-3 sm:space-x-6">
                      <button
                        type="button"
                        className="bg-white hover:bg-netflix-red focus:bg-netflix-red text-gray-900 hover:text-white focus:text-white text-sm sm:text-2xl font-bold uppercase tracking-widest focus:outline-none px-6 py-2"
                        onClick={() => cancelDelete()}
                      >
                        Keep Profile
                      </button>
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center bg-transparent border border-gray-400 hover:border-white focus:border-white text-gray-400 hover:text-white focus:text-white text-sm sm:text-2xl font-bold uppercase tracking-widest focus:outline-none px-6 py-2"
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
