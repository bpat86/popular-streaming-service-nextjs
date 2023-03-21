import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineEdit } from "react-icons/md";
import { z } from "zod";
import { shallow } from "zustand/shallow";

import ProfileGateLayout from "@/components/pages/layouts/ProfileGateLayout";
import { UseProfileProps } from "@/middleware/useProfiles";
import { IUser } from "@/pages/api/strapi/users/types";
import useProfileStore from "@/store/ProfileStore";
import { IProfile, IProfileAttributes } from "@/store/types";

import SelectAvatar from "./SelectAvatar";
const schema = z.object({
  name: z.string().min(1).max(12),
  avatar: z.string(),
  kid: z.boolean(),
  autoPlayNextEpisode: z.boolean(),
  autoPlayPreviews: z.boolean(),
});

type AddProfileProps = {
  user: IUser;
  profiles: IProfile[];
  mutate?: any;
  error?: any;
  isLoading?: boolean;
  isValidating?: boolean;
};

export default function AddProfile({
  user,
  profiles,
  mutate,
}: AddProfileProps) {
  const names = profiles?.map((profile: IProfile) => profile.attributes.name);
  const {
    manageProfilesModeEnabled,
    toggleManageProfilesMode,
    promptSelectAvatar,
    togglePromptSelectAvatar,
    createProfile,
    setProfiles,
    profileAttributes,
    setProfileAttributes,
    resetProfile,
    toggleAll,
  } = useProfileStore(
    (state) => ({
      manageProfilesModeEnabled: state.manageProfilesModeEnabled,
      toggleManageProfilesMode: state.toggleManageProfilesMode,
      promptSelectAvatar: state.promptSelectAvatar,
      togglePromptSelectAvatar: state.togglePromptSelectAvatar,
      createProfile: state.createProfile,
      setProfiles: state.setProfiles,
      profileAttributes: state.profileAttributes,
      setProfileAttributes: state.setProfileAttributes,
      resetProfile: state.resetProfile,
      toggleAll: state.toggleAll,
    }),
    shallow
  );
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: profileAttributes,
    resolver: zodResolver(schema),
    mode: "onBlur", // "onChange"
  });
  const [nameError, setNameError] = useState<boolean>(false);

  /**
   * Open the avatar selection screen prompt
   */
  function handlePromptSelectAvatar() {
    // Get the form values
    const [name, kid, autoPlayNextEpisode, autoPlayPreviews] = getValues([
      "name",
      "kid",
      "autoPlayNextEpisode",
      "autoPlayPreviews",
    ]);
    // Set the name text value in the context
    setProfileAttributes({
      ...profileAttributes,
      name,
      kid,
      autoPlayNextEpisode,
      autoPlayPreviews,
    });
    // Set manage profiles mode to false
    manageProfilesModeEnabled && toggleManageProfilesMode();
    // Set open select avatar screen to true
    !promptSelectAvatar && togglePromptSelectAvatar();
  }

  /**
   * Return to the who's watching screen
   */
  function handleCancel() {
    resetProfile();
    toggleAll();
  }

  /**
   * Create a new user profile
   */
  function handleSave(formValues: IProfileAttributes) {
    if (names?.includes(formValues.name)) return setNameError(true);
    const attributes = {
        ...formValues,
        user: user.id,
        avatar: profileAttributes.avatar,
      },
      newProfile = {
        id: Date.now(),
        attributes: {
          ...formValues,
          avatar: profileAttributes.avatar,
        },
      };
    setProfiles([...profiles]);
    setProfileAttributes(attributes);
    // Create a new profile and update the cache
    mutate(createProfile(attributes), {
      optimisticData: {
        profiles: [...profiles, newProfile],
      },
      rollbackOnError: true,
      populateCache: (
        profile: IProfile,
        cachedProfiles: UseProfileProps["data"]
      ) => {
        const { profiles } = cachedProfiles;
        return { profiles: [...profiles, profile] };
      },
      revalidate: false,
    });
    // Return to the who's watching screen
    toggleAll();
  }

  // Select avatar screen
  if (promptSelectAvatar) {
    return (
      <ProfileGateLayout
        {...{
          user,
          title: "Select Avatar",
        }}
      >
        <SelectAvatar />
      </ProfileGateLayout>
    );
  }

  // Add profile screen
  return (
    <ProfileGateLayout
      {...{
        user,
        title: "Add Profile",
      }}
    >
      <div className="fixed inset-0 overflow-y-scroll sm:overflow-hidden">
        <div className="fade-in mt-20 mb-12 flex min-h-full w-full flex-col items-center justify-center sm:fixed sm:inset-0 sm:my-0 sm:h-screen">
          <form
            onReset={handleCancel}
            onSubmit={handleSubmit(handleSave)}
            className="mx-auto block w-full space-y-6 px-6 lg:w-3/4 xl:w-2/5"
          >
            <h1 className="block text-3xl font-medium text-white sm:text-6xl">
              Add Profile
            </h1>
            <h2 className="text-xl text-zinc-400 sm:text-2xl">
              Add a profile for another person watching Netflix.
            </h2>
            <div className="flex w-full space-y-6 border-t border-b border-zinc-700">
              <div className="my-6 flex w-full items-center text-center">
                <div className="group relative">
                  <div
                    className="profile-avatar xs:w-20 xs:h-20 mx-auto flex h-16 w-16 flex-col rounded-md bg-cover text-white md:h-36 md:w-36"
                    style={{
                      backgroundImage: `url("/images/profiles/avatars/${profileAttributes.avatar}.png")`,
                    }}
                  />
                  {/* Hovered state */}
                  <div
                    onClick={handlePromptSelectAvatar}
                    className="absolute bottom-0 left-0 -z-1 m-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-70 opacity-0 transition duration-150 ease-out group-hover:pointer-events-auto group-hover:z-auto group-hover:opacity-100"
                  >
                    <MdOutlineEdit className="h-8 w-8 text-2xl text-white" />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-6">
                  <div className="mt-2 flex h-12 w-full flex-col justify-start sm:h-14">
                    <div className="profile-input relative focus-within:border-transparent">
                      <input
                        aria-invalid={errors ? "true" : "false"}
                        autoComplete="none"
                        tabIndex={0}
                        type="text"
                        id="name"
                        maxLength={15}
                        minLength={2}
                        placeholder="Name"
                        className="input-profile block h-10 w-full appearance-none rounded-sm border-0 bg-zinc-500 px-3 text-lg tracking-wider placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500 sm:h-12 sm:text-xl"
                        {...register("name", {
                          required: true,
                          minLength: 2,
                          maxLength: 15,
                        })}
                      />
                      {errors.name && (
                        <div className="input-error mt-1 px-1 text-left text-sm font-medium text-netflix-red-light">
                          Name is required.
                        </div>
                      )}
                      {nameError && (
                        <div className="input-error mt-1 px-1 text-left text-sm font-medium text-netflix-red-light">
                          Name is already in use.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="group relative flex flex-col items-center justify-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="kid"
                      aria-describedby="kid-description"
                      type="checkbox"
                      // onChange={handleChange}
                      className="h-6 w-6 cursor-pointer border border-zinc-700 bg-zinc-900 text-zinc-900 outline-none ring-1 ring-zinc-500 focus:ring-0 sm:h-8 sm:w-8"
                      {...register("kid")}
                    />
                    <label
                      htmlFor="kid"
                      className="cursor-pointer pl-3 text-left font-medium leading-none text-white"
                    >
                      Kid?
                    </label>
                  </div>
                  {/* Tooltip */}
                  <div className="tooltip absolute bottom-0 mb-10 ml-8 hidden w-72 scale-95 transform flex-col items-end justify-end opacity-0 transition duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 sm:flex md:items-center">
                    <span className="whitespace-no-wrap relative z-10 bg-white px-4 py-3 text-lg font-medium leading-none text-zinc-900">
                      If selected, this profile will only see TV shows and
                      movies rated for ages 12 and under.
                    </span>
                    <div className="-mt-3 h-5 w-5 rotate-45 transform bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col space-y-6 border-b border-zinc-700 sm:pb-4">
              <h2 className="text-2xl text-zinc-400">Autoplay controls</h2>
              <div className="group flex w-full cursor-pointer flex-col items-start text-center sm:space-y-4">
                <div className="relative mb-5 flex flex-col items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="autoPlayNextEpisode"
                      aria-describedby="autoPlayNextEpisode-description"
                      type="checkbox"
                      // onChange={handleChange}
                      className="h-6 w-6 cursor-pointer border border-zinc-700 bg-zinc-900 text-zinc-900 outline-none ring-1 ring-zinc-500 focus:ring-0 sm:h-8 sm:w-8"
                      {...register("autoPlayNextEpisode")}
                    />
                    <label
                      htmlFor="autoPlayNextEpisode"
                      className="cursor-pointer pl-3 text-left font-medium leading-none text-white"
                    >
                      Autoplay next episode in a series on all devices.
                    </label>
                  </div>
                </div>
                <div className="group my-3 flex w-full cursor-pointer items-center text-center">
                  <div className="relative mb-3 flex flex-col items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="autoPlayPreviews"
                        aria-describedby="autoPlayPreviews-description"
                        type="checkbox"
                        // onChange={handleChange}
                        className="h-6 w-6 cursor-pointer border border-zinc-700 bg-zinc-900 text-zinc-900 outline-none ring-1 ring-zinc-500 focus:ring-0 sm:h-8 sm:w-8"
                        {...register("autoPlayPreviews")}
                      />
                      <label
                        htmlFor="autoPlayPreviews"
                        className="cursor-pointer pl-3 text-left font-medium leading-none text-white"
                      >
                        Autoplay previews while browsing on all devices.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 mt-8 flex space-x-3 sm:mt-12 sm:space-x-6">
              <button
                type="submit"
                className="flex items-center bg-white px-6 py-2 text-sm font-medium tracking-wider text-zinc-900 hover:bg-netflix-red hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none sm:text-2xl"
              >
                Continue
              </button>
              <button
                type="reset"
                className="border border-zinc-400 bg-transparent px-6 py-2 text-sm font-medium tracking-wider text-zinc-400 hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none sm:text-2xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProfileGateLayout>
  );
}