import { FaPlusCircle } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { shallow } from "zustand/shallow";

import ProfileGateLayout from "@/components/pages/layouts/ProfileGateLayout";
import UnstyledLink from "@/components/ui/links/UnstyledLink";
import clsxm from "@/lib/clsxm";
import { IUser } from "@/pages/api/strapi/users/types";
import useProfileStore from "@/store/ProfileStore";
import { IProfile } from "@/store/types";

type WhosWatchingProps = {
  user: IUser;
  profiles: IProfile[];
  mutate?: any;
  error?: any;
  isLoading?: boolean;
  isValidating?: boolean;
  manageProfilesModeEnabled?: boolean;
};

export default function WhosWatching({
  user,
  profiles,
  isLoading,
  isValidating,
  manageProfilesModeEnabled,
}: WhosWatchingProps) {
  const {
    addProfileModeEnabled,
    toggleAddProfileMode,
    setProfileAttributes,
    setActiveProfile,
    resetProfile,
    editModeEnabled,
    toggleEditMode,
    setEditableProfile,
  } = useProfileStore(
    (state) => ({
      addProfileModeEnabled: state.addProfileModeEnabled,
      toggleAddProfileMode: state.toggleAddProfileMode,
      manageProfilesModeEnabled: state.manageProfilesModeEnabled,
      setProfileAttributes: state.setProfileAttributes,
      setActiveProfile: state.setActiveProfile,
      resetProfile: state.resetProfile,
      editModeEnabled: state.editModeEnabled,
      toggleEditMode: state.toggleEditMode,
      setEditableProfile: state.setEditableProfile,
    }),
    shallow
  );

  /**
   * Open the Add New Profile prompt
   */
  function handleCreateProfile() {
    resetProfile();
    !addProfileModeEnabled && toggleAddProfileMode();
  }

  /**
   * Get the updated profile data and open the Edit Profile prompt
   */
  function handleEditProfile(profile: IProfile) {
    setProfileAttributes(profile.attributes);
    setEditableProfile(profile);
    !editModeEnabled && toggleEditMode();
  }

  /**
   * Set profile as active when clicked
   */
  function handleSetActiveProfile(profile: IProfile) {
    const { id, attributes } = profile;
    const activeProfile = {
      id,
      attributes,
    };
    setActiveProfile(activeProfile);
  }

  // Show loading placeholders / skeletons
  if (isLoading || (isValidating && !profiles)) {
    return (
      <ProfileGateLayout
        {...{
          user,
          title: "Who's watching?",
        }}
      >
        <div className="fixed inset-0">
          <div className="fade-in fixed inset-0 flex flex-col items-center justify-center">
            <h1 className="block text-4xl font-medium tracking-wide text-white sm:text-6xl">
              {manageProfilesModeEnabled
                ? "Manage Profiles:"
                : "Who's watching?"}
            </h1>
            <ul className="my-8 mb-20 flex w-full flex-row flex-wrap justify-center space-x-8">
              <li className="my-3 flex animate-pulse flex-col items-center justify-center text-center">
                <div className="relative">
                  <div className="profile-avatar-loading mx-auto flex h-32 w-32 flex-col rounded-md bg-zinc-800 md:h-44 md:w-44" />
                </div>
                <dl className="mt-3 flex flex-grow flex-col items-center justify-center">
                  <dd className="h-6 w-24 rounded-xl bg-zinc-800" />
                </dl>
              </li>
              <li className="my-3 flex animate-pulse flex-col items-center justify-center text-center">
                <div className="relative">
                  <div className="profile-avatar-loading mx-auto flex h-32 w-32 flex-col rounded-md bg-zinc-800 md:h-44 md:w-44" />
                </div>
                <dl className="mt-3 flex flex-grow flex-col items-center justify-center">
                  <dd className="h-6 w-24 rounded-xl bg-zinc-800" />
                </dl>
              </li>
              <button
                type="button"
                aria-label="Loading..."
                className="my-3 flex animate-pulse flex-col items-center justify-center text-center"
              >
                <div className="relative">
                  <div className="profile-avatar-loading mx-auto flex h-32 w-32 flex-col rounded-md bg-zinc-800 md:h-44 md:w-44" />
                </div>
                <dl className="mt-3 flex flex-grow flex-col items-center justify-center">
                  <dd className="h-6 w-24 rounded-xl bg-zinc-800" />
                </dl>
              </button>
            </ul>
            <button
              type="button"
              aria-label="Manage Profiles"
              className="mt-2 animate-pulse border border-zinc-400 px-8 py-3 text-xl font-medium tracking-wider text-zinc-400 focus:outline-none"
            >
              Loading Profiles...
            </button>
          </div>
        </div>
      </ProfileGateLayout>
    );
  }

  // Show profiles
  return (
    <ProfileGateLayout
      {...{
        user,
        title: "Who's watching?",
      }}
    >
      <div className="fixed inset-0">
        <div className="fade-in fixed inset-0 flex flex-col items-center justify-center">
          <h1 className="block text-4xl font-medium tracking-wide text-white sm:text-6xl">
            {manageProfilesModeEnabled ? "Manage Profiles:" : "Who's watching?"}
          </h1>
          <ul className="my-8 mb-20 flex w-full flex-row flex-wrap justify-center space-x-8">
            {profiles?.map((profile: IProfile) => {
              return (
                <li
                  key={profile.id}
                  id={profile.id}
                  tabIndex={0}
                  className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center"
                >
                  <div className="relative">
                    <div
                      className="profile-avatar mx-auto flex h-32 w-32 flex-col rounded-md bg-cover ring-inset group-hover:ring-4 group-hover:ring-white group-focus:ring-4 group-focus:ring-white md:h-44 md:w-44"
                      style={{
                        backgroundImage: `url("/images/profiles/avatars/${profile.attributes.avatar}.png")`,
                      }}
                      onClick={() => handleSetActiveProfile(profile)}
                    />
                    {manageProfilesModeEnabled && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70"
                        onClick={() => handleEditProfile(profile)}
                      >
                        <MdOutlineEdit className="h-12 w-12 text-2xl text-white" />
                      </div>
                    )}
                  </div>
                  <dl className="mt-4 flex flex-grow flex-col justify-between">
                    <dt className="sr-only">{`Profile name: ${profile.attributes.name}`}</dt>
                    <dd className="text-2xl text-zinc-400 group-hover:text-white">
                      {profile.attributes.name}
                    </dd>
                  </dl>
                </li>
              );
            })}
            <button
              tabIndex={0}
              type="button"
              className="group my-3 flex cursor-pointer flex-col items-center justify-center text-center focus:outline-none"
              aria-label="Add a profile"
              onClick={handleCreateProfile}
            >
              <div className="profile-avatar mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-md	transition duration-200 ease-out group-hover:bg-white group-focus:bg-white md:h-44 md:w-44">
                <FaPlusCircle className="h-28 w-28 text-zinc-400" />
              </div>
              <dl className="mt-4 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Add Profile</dt>
                <dd className="text-2xl text-zinc-400 group-hover:text-white">
                  Add Profile
                </dd>
              </dl>
            </button>
          </ul>
          {profiles?.length > 0 && (
            <UnstyledLink
              tabIndex={0}
              aria-label="Manage Profiles"
              href={manageProfilesModeEnabled ? "/browse" : "/manage-profiles"}
              className={clsxm([
                manageProfilesModeEnabled
                  ? "border border-transparent bg-white px-8 py-3 text-xl font-medium tracking-wider text-zinc-900 hover:bg-netflix-red hover:text-white focus:bg-netflix-red focus:text-white focus:outline-none"
                  : "border border-zinc-400 px-8 py-3 text-xl font-medium tracking-wider text-zinc-400 hover:border-white hover:text-white focus:border-white focus:text-white focus:outline-none",
              ])}
            >
              {manageProfilesModeEnabled ? "Done" : "Manage Profiles"}
            </UnstyledLink>
          )}
        </div>
      </div>
    </ProfileGateLayout>
  );
}
