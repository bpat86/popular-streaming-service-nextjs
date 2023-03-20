import { Form, Formik } from "formik";
import { useEffect } from "react";

import Profile from "@/components/pages/layouts/ProfileGateLayout";

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
          <div className="fade-in fixed inset-0 flex w-full flex-col items-center justify-center">
            <Formik
              initialValues={formDataContext}
              onSubmit={async () => {
                await sleep(250);
                confirmAvatar();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mx-auto block w-auto">
                  <h1 className="my-6 block text-center text-2xl font-semibold text-white sm:text-4xl">
                    Change Profile Icon?
                  </h1>
                  <div className="my-5 flex w-full border-t border-b border-zinc-700 py-4">
                    <div className="group my-3 flex w-full cursor-pointer items-center text-center">
                      <div className="relative ml-auto px-6">
                        <div
                          className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover text-white ring-inset hover:ring-4 hover:ring-white md:h-36 md:w-36"
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
                          className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover text-white ring-inset hover:ring-4 hover:ring-white md:h-36 md:w-36"
                          style={{
                            backgroundImage: `url("/images/profiles/avatars/${currentAvatar}.png")`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="my-4 mt-12 flex items-center justify-center">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="flex items-center bg-white px-6 py-2 font-bold uppercase tracking-widest text-zinc-900 hover:bg-netflix-red hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none"
                    >
                      {isSubmitting ? (
                        <>
                          Continue
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
                        <>Let's Do It</>
                      )}
                    </button>
                    <button
                      type="button"
                      className="ml-6 border border-zinc-400 bg-transparent px-6 py-2 font-bold uppercase tracking-widest text-zinc-400 hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none"
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
