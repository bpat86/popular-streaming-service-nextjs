import { useEffect } from "react";

import Profile from "@/components/layouts/ProfilesLayout";
import AvatarConfirm from "@/components/profile/actions/AvatarConfirm";

const SelectAvatar = (props) => {
  const {
    formDataContext,
    setFormDataContext,
    name,
    kid,
    autoPlayNextEpisode,
    autoPlayPreviews,
    defaultAvatar,
    currentAvatar,
    setCurrentAvatar,
    setPreviousAvatar,
    avatarConfirmPrompt,
    setAvatarConfirmPrompt,
    closeAvatarConfirmPrompt,
  } = props;

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
   * @param {String} clickedImage
   */
  const updateAvatar = (clickedImage) => {
    // Update current avatar state
    setCurrentAvatar(clickedImage);
    // Update the previous avatar state
    setPreviousAvatar(currentAvatar || defaultAvatar);
    // Update our context
    setFormDataContext({
      avatar: currentAvatar,
      name,
      kid,
      autoPlayNextEpisode,
      autoPlayPreviews,
    });
    // Redirect to the confrimation screen
    setAvatarConfirmPrompt(true);
  };

  /**
   * Return to step one without creating a profile
   */
  const cancelSelection = () => {
    closeAvatarConfirmPrompt();
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <>
      {avatarConfirmPrompt ? (
        <AvatarConfirm {...props} />
      ) : (
        <Profile {...props}>
          <div className="fixed inset-0">
            <div className="fade-in fixed inset-0 flex w-full flex-col items-center justify-center">
              <div className="fixed inset-0 bg-gray-900">
                <div className="fade-in fixed inset-0 flex w-full flex-col items-center justify-center md:-ml-16">
                  <div className="mx-auto mt-44 block h-full min-h-screen w-full overflow-y-scroll px-6 md:w-2/3">
                    <div className="flex w-full items-center ">
                      <h1 className="my-6 flex items-center justify-start font-bold text-white">
                        <button
                          type="submit"
                          className="ml-1 flex items-center justify-center py-2 pr-5 font-bold uppercase tracking-widest text-white hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none"
                          onClick={() => cancelSelection()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-14 w-14"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <div className="flex flex-col">
                          <span className="text-2xl sm:text-4xl">
                            Edit Profile
                          </span>
                          <span className="text-xl sm:text-2xl">
                            Choose a profile icon.
                          </span>
                        </div>
                      </h1>
                      <div className="ml-auto flex items-center">
                        <span className="font-semibold">
                          {formDataContext.name}
                        </span>
                        <div
                          className="profile-avatar mx-auto ml-6 flex h-16 w-16 flex-col rounded-md bg-cover text-white md:h-20 md:w-20"
                          style={{
                            backgroundImage: `url("/images/profiles/avatars/${
                              currentAvatar || defaultAvatar
                            }.png")`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-24 mb-16 py-4 md:ml-20">
                      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8 lg:grid-cols-6 xl:gap-10">
                        {avatars &&
                          avatars.avatars
                            .filter((avatar) => avatar.image !== currentAvatar)
                            .map((avatar, idx) => (
                              <li
                                key={idx}
                                id={`avatar-${avatar.id}`}
                                className="relative"
                              >
                                <div
                                  className="profile-avatar group aspect-w-1 aspect-h-1 block w-full cursor-pointer overflow-hidden rounded-md bg-cover ring-inset hover:ring-4 hover:ring-white"
                                  style={{
                                    backgroundImage: `url('/images/profiles/avatars/${avatar.image}.png')`,
                                  }}
                                  onClick={() => updateAvatar(avatar.image)}
                                ></div>
                              </li>
                            ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Profile>
      )}
    </>
  );
};

export default SelectAvatar;
