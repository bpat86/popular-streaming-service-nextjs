import { useEffect } from "react";
import { Formik, Form } from "formik";

import Profile from "@/components/layouts/ProfilesLayout";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const AvatarConfirm = (props) => {
  // Get state from our props
  const {
    formDataContext,
    setFormDataContext,
    name,
    kid,
    autoPlayNextEpisode,
    autoPlayPreviews,
    currentAvatar,
    previousAvatar,
    setCurrentAvatar,
    closeAvatarConfirmPrompt,
    setAvatarConfirmPrompt, // temp
  } = props;

  /**
   * Return to the avatar selection screen without confirming new avatar image
   */
  const cancelAvatarConfirm = () => {
    // Reset to the default values
    setCurrentAvatar(previousAvatar);
    // Return to Select Avatar step
    setAvatarConfirmPrompt(false);
  };

  /**
   * Set new avatar image
   */
  const confirmAvatar = () => {
    // Save the selection in our context
    setFormDataContext({
      avatar: currentAvatar,
      name,
      kid,
      autoPlayNextEpisode,
      autoPlayPreviews,
    });
    // Return to selection screen
    closeAvatarConfirmPrompt();
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      <Profile {...props}>
        <div className="fixed inset-0">
          <div className="fixed inset-0 flex flex-col items-center justify-center w-full fade-in">
            <Formik
              initialValues={formDataContext}
              onSubmit={async () => {
                await sleep(250);
                confirmAvatar();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="block w-auto mx-auto">
                  <h1 className="block text-white text-2xl sm:text-4xl font-semibold text-center my-6">
                    Change Profile Icon?
                  </h1>
                  <div className="flex w-full my-5 border-t border-b border-gray-700 py-4">
                    <div className="group flex items-center w-full text-center my-3 cursor-pointer">
                      <div className="relative ml-auto px-6">
                        <div
                          className="profile-avatar w-32 h-32 md:w-36 md:h-36 flex flex-col mx-auto bg-cover rounded-md text-white ring-inset hover:ring-4 hover:ring-white"
                          style={{
                            backgroundImage: `url("/images/profiles/avatars/${previousAvatar}.png")`,
                          }}
                        ></div>
                      </div>
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                      <div className="relative mr-auto px-6">
                        <div
                          className="profile-avatar w-32 h-32 md:w-36 md:h-36 flex flex-col mx-auto bg-cover rounded-md text-white ring-inset hover:ring-4 hover:ring-white"
                          style={{
                            backgroundImage: `url("/images/profiles/avatars/${currentAvatar}.png")`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center my-4 mt-12">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="flex items-center bg-white hover:bg-netflix-red focus:bg-netflix-red text-gray-900 hover:text-white focus:text-white font-bold uppercase tracking-widest focus:outline-none px-6 py-2"
                    >
                      {isSubmitting ? (
                        <>
                          Continue
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
                        <>Let's Do It</>
                      )}
                    </button>
                    <button
                      type="button"
                      className="bg-transparent border border-gray-400 hover:border-white focus:border-white text-gray-400 hover:text-white focus:text-white font-bold uppercase tracking-widest focus:outline-none px-6 py-2 ml-6"
                      onClick={() => cancelAvatarConfirm()}
                    >
                      Not Yet
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Profile>
    </>
  );
};

export default AvatarConfirm;
