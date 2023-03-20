import { shallow } from "zustand/shallow";

import useProfileStore from "@/store/ProfileStore";

type ConfirmAvatarProps = {
  newAvatar: string;
};

export default function ConfirmAvatar({ newAvatar }: ConfirmAvatarProps) {
  const {
    promptSelectAvatar,
    togglePromptSelectAvatar,
    promptConfirmAvatar,
    togglePromptConfirmAvatar,
    profileAttributes,
    setProfileAttributes,
  } = useProfileStore(
    (state) => ({
      promptSelectAvatar: state.promptSelectAvatar,
      togglePromptSelectAvatar: state.togglePromptSelectAvatar,
      promptConfirmAvatar: state.promptConfirmAvatar,
      togglePromptConfirmAvatar: state.togglePromptConfirmAvatar,
      profileAttributes: state.profileAttributes,
      setProfileAttributes: state.setProfileAttributes,
    }),
    shallow
  );

  /**
   * Return to the avatar selection screen without confirming new avatar image
   */
  function handleCancel() {
    promptConfirmAvatar && togglePromptConfirmAvatar();
  }

  /**
   * Set new avatar image
   */
  function handleConfirm() {
    // Save the new avatar image
    setProfileAttributes({
      ...profileAttributes,
      avatar: newAvatar,
    });
    // Return to selection screen
    promptConfirmAvatar && togglePromptConfirmAvatar();
    promptSelectAvatar && togglePromptSelectAvatar();
  }

  return (
    <div className="fixed inset-0">
      <div className="fade-in fixed inset-0 flex w-full flex-col items-center justify-center">
        <div className="mx-auto block w-auto space-y-6">
          <h1 className="block text-center text-3xl font-medium text-white sm:text-6xl">
            Change Profile Icon?
          </h1>
          <div className="flex w-full items-center border-t border-b border-zinc-700 py-6 text-center">
            <div className="relative ml-auto px-6">
              <div
                className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover text-white ring-inset hover:ring-4 hover:ring-white md:h-36 md:w-36"
                style={{
                  backgroundImage: `url("/images/profiles/avatars/${profileAttributes.avatar}.png")`,
                }}
              />
            </div>
            <div>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 24 24"
                className="h-12 w-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
              </svg>
            </div>
            <div className="relative mr-auto px-6">
              <div
                className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover text-white ring-inset hover:ring-4 hover:ring-white md:h-36 md:w-36"
                style={{
                  backgroundImage: `url("/images/profiles/avatars/${newAvatar}.png")`,
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-8">
            <button
              type="submit"
              className="flex items-center bg-white px-6 py-2 font-medium tracking-wider text-zinc-900 hover:bg-netflix-red	 hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none"
              onClick={handleConfirm}
            >
              Let's Do It
            </button>
            <button
              type="button"
              className="border border-zinc-400 bg-transparent px-6 py-2 font-medium tracking-wider text-zinc-400 hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none"
              onClick={handleCancel}
            >
              Not Yet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
