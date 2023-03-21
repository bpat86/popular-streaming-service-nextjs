import { useState } from "react";
import { shallow } from "zustand/shallow";

import useProfileStore from "@/store/ProfileStore";
import { IProfileAttributes } from "@/store/types";

import ConfirmAvatar from "./confirm/ConfirmAvatar";

export default function SelectAvatar() {
  const {
    promptSelectAvatar,
    togglePromptSelectAvatar,
    promptConfirmAvatar,
    togglePromptConfirmAvatar,
    profileAttributes,
  } = useProfileStore(
    (state) => ({
      promptSelectAvatar: state.promptSelectAvatar,
      togglePromptSelectAvatar: state.togglePromptSelectAvatar,
      promptConfirmAvatar: state.promptConfirmAvatar,
      togglePromptConfirmAvatar: state.togglePromptConfirmAvatar,
      profileAttributes: state.profileAttributes,
    }),
    shallow
  );
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  /**
   * Hardcode some avatars for now
   */
  const avatars = {
    avatars: [
      { id: 0, image: "aviators" },
      { id: 1, image: "chicken" },
      { id: 2, image: "ckdaniel" },
      { id: 3, image: "ckjohnny" },
      { id: 4, image: "green" },
      { id: 5, image: "jvn" },
      { id: 6, image: "kids" },
      { id: 7, image: "panda" },
      { id: 8, image: "pink" },
      { id: 9, image: "purple" },
      { id: 10, image: "red" },
      { id: 11, image: "robot" },
      { id: 12, image: "stbilly" },
      { id: 13, image: "stdustin" },
      { id: 14, image: "steleven" },
      { id: 15, image: "ststeve" },
      { id: 16, image: "yellow" },
    ],
  };

  /**
   * Select and avatar and redirect to the confirmation screen
   */
  function updateAvatar(avatar: IProfileAttributes["avatar"]) {
    // Update the new avatar state
    setNewAvatar(avatar);
    // Redirect to the confrimation screen
    !promptConfirmAvatar && togglePromptConfirmAvatar();
  }

  /**
   * Return to step one without creating a profile
   */
  function cancelSelection() {
    promptSelectAvatar && togglePromptSelectAvatar();
  }

  // Show the avatar confirmation screen
  if (promptConfirmAvatar && newAvatar) {
    return <ConfirmAvatar newAvatar={newAvatar} />;
  }

  // Show the avatar selection screen
  return (
    <div className="fixed inset-0">
      <div className="fade-in fixed inset-0 flex w-full flex-col items-center justify-center">
        <div className="fixed inset-0 bg-zinc-900">
          <div className="fade-in fixed inset-0 flex w-full flex-col items-center justify-center md:-ml-16">
            <div className="mx-auto mt-44 block h-full min-h-screen w-full overflow-y-scroll px-6 md:w-2/3">
              <div className="flex w-full items-center ">
                <h1 className="my-6 flex items-center justify-start font-bold text-white">
                  <button
                    type="submit"
                    className="flex items-center justify-center py-2 pr-4 font-bold uppercase tracking-widest text-white hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none"
                    onClick={cancelSelection}
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={0}
                      viewBox="0 0 24 24"
                      className="h-14 w-14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
                    </svg>
                  </button>
                  <div className="flex flex-col space-y-2">
                    <span className="text-2xl sm:text-4xl">Edit Profile</span>
                    <span className="text-xl sm:text-2xl">
                      Choose a profile icon.
                    </span>
                  </div>
                </h1>
                <div className="ml-auto flex items-center">
                  {profileAttributes.name && (
                    <h3 className="text-zinc-400">{profileAttributes.name}</h3>
                  )}
                  <div
                    className="profile-avatar mx-auto ml-6 flex h-16 w-16 flex-col rounded-md bg-cover text-white md:h-20 md:w-20"
                    style={{
                      backgroundImage: `url("/images/profiles/avatars/${profileAttributes.avatar}.png")`,
                    }}
                  />
                </div>
              </div>
              <div className="mt-24 mb-16 py-4 md:ml-20">
                <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-6 xl:gap-10">
                  {avatars?.avatars
                    .filter(
                      (avatar) => avatar.image !== profileAttributes.avatar
                    )
                    ?.map((avatar, idx) => (
                      <li
                        key={`${idx}-${avatar.id}`}
                        id={`avatar-${avatar.id}`}
                        className="relative"
                      >
                        <div
                          className="profile-avatar group aspect-w-1 aspect-h-1 block w-full cursor-pointer overflow-hidden rounded-md bg-cover ring-inset hover:ring-4 hover:ring-white"
                          style={{
                            backgroundImage: `url('/images/profiles/avatars/${avatar.image}.png')`,
                          }}
                          onClick={() => updateAvatar(avatar.image)}
                        />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
