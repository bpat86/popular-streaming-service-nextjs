import { shallow } from "zustand/shallow";

import { UseProfileProps } from "@/middleware/useProfiles";
import useProfileStore from "@/store/ProfileStore";
import { IProfile } from "@/store/types";

type ConfirmDeleteProfileProps = {
  profiles: IProfile[];
  mutate?: any;
};

export default function ConfirmDeleteProfile({
  profiles,
  mutate,
}: ConfirmDeleteProfileProps) {
  const {
    profileAttributes,
    editableProfile,
    promptConfirmDeleteProfile,
    deleteProfile,
    togglePromptConfirmDeleteProfile,
  } = useProfileStore(
    (state) => ({
      profileAttributes: state.profileAttributes,
      editableProfile: state.editableProfile,
      promptConfirmDeleteProfile: state.promptConfirmDeleteProfile,
      deleteProfile: state.deleteProfile,
      togglePromptConfirmDeleteProfile: state.togglePromptConfirmDeleteProfile,
    }),
    shallow
  );

  /**
   * Return to step one without editing a profile
   */
  function handleCancel() {
    promptConfirmDeleteProfile && togglePromptConfirmDeleteProfile();
  }

  /**
   * Delete the profile
   */
  function handleConfirm() {
    if (!editableProfile) return;
    // Delete the profile and update the cache
    mutate(deleteProfile(editableProfile.id), {
      optimisticData: {
        profiles: profiles.filter(
          (profile) => profile.id !== editableProfile.id
        ),
      },
      rollbackOnError: true,
      populateCache: (
        profile: IProfile,
        cachedProfiles: UseProfileProps["data"]
      ) => {
        const { profiles } = cachedProfiles;
        return {
          profiles: profiles.filter((p) => p.id !== profile.id),
        };
      },
      revalidate: false,
    });
  }

  return (
    <div className="fixed inset-0 overflow-y-scroll sm:overflow-hidden">
      <div className="fade-in mt-20 mb-12 flex min-h-full w-full flex-col items-center justify-center sm:fixed sm:inset-0 sm:my-0 sm:h-screen">
        <div className="mx-auto block w-full space-y-6 px-6 lg:w-3/4 xl:w-2/5">
          <h1 className="block text-3xl font-medium text-white sm:text-6xl">
            Delete Profile?
          </h1>
          <div className="flex w-full items-center border-t border-b border-zinc-700 py-6 text-center">
            <div className="ml-auto flex items-center">
              <div className="relative space-y-3 rounded-lg border border-zinc-700 p-4 pb-2.5">
                <div
                  className="profile-avatar xs:w-20 xs:h-20 mx-auto flex h-16 w-16 flex-col rounded-md bg-cover text-white md:h-36 md:w-36"
                  style={{
                    backgroundImage: `url("/images/profiles/avatars/${profileAttributes.avatar}.png")`,
                  }}
                />
                <h3 className="text-zinc-400">{profileAttributes.name}</h3>
              </div>
              <p className="mx-6 text-left text-lg leading-normal text-white sm:text-xl sm:leading-normal md:text-2xl md:leading-normal">
                This profile's history — including My List, ratings and activity
                — will be gone forever, and you won't be able to access it
                again.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-8">
            <button
              type="button"
              className="bg-white px-6 py-2 text-sm font-medium tracking-wider text-zinc-900 hover:bg-netflix-red hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none sm:text-2xl"
              onClick={handleCancel}
            >
              Keep Profile
            </button>
            <button
              type="button"
              className="flex items-center border border-zinc-400 bg-transparent px-6 py-2 text-sm font-medium tracking-wider text-zinc-400 hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none sm:text-2xl"
              onClick={handleConfirm}
            >
              Delete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
