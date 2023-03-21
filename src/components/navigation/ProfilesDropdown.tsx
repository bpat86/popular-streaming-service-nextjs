import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useContext } from "react";

import AuthContext from "@/context/AuthContext";
import clsxm from "@/lib/clsxm";
import useProfiles from "@/middleware/useProfiles";
import useProfileStore from "@/store/ProfileStore";
import { IProfile } from "@/store/types";

type UserDropdownProps = {
  isActive: boolean;
};

export default function UserDropdown({ isActive }: UserDropdownProps) {
  const { logout } = useContext(AuthContext);
  const { profiles } = useProfiles();
  const {
    activeProfile,
    setActiveProfile,
    manageProfilesModeEnabled,
    toggleManageProfilesMode,
  } = useProfileStore();

  /**
   * Count the number of profiles.
   */
  function getProfilesCount() {
    return (
      (profiles && profiles.map((profile: IProfile) => profile).length) || 0
    );
  }

  /**
   * Handle the click event for the "Manage Profiles" button.
   */
  function handleManageProfiles() {
    !manageProfilesModeEnabled && toggleManageProfilesMode();
  }

  /**
   * Activate a profile.
   */
  function handleSetActiveProfile(profile: IProfile) {
    setActiveProfile(profile);
  }

  return isActive ? (
    <Menu as="div" className="relative inline-block bg-transparent text-left">
      <div className="flex items-center">
        <div className="group mr-4 flex cursor-pointer items-center justify-center rounded-full bg-transparent text-zinc-100 hover:text-zinc-200 focus:outline-none">
          <span className="sr-only">Search</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <Menu.Button className="group ml-2 flex cursor-pointer items-center justify-center rounded-full bg-transparent text-zinc-100 hover:text-zinc-200 focus:outline-none">
          {({ open }) => (
            <>
              <span className="sr-only">Open profile menu</span>
              {activeProfile && (
                <>
                  <span className="mr-2 text-sm font-semibold">
                    {activeProfile.attributes.name}
                  </span>
                  <div
                    className="profile-avatar mx-auto flex h-8 w-8 flex-col rounded-md bg-cover"
                    style={{
                      backgroundImage: `url("/images/profiles/avatars/${activeProfile.attributes.avatar}.png")`,
                    }}
                  />
                </>
              )}
              <svg
                aria-hidden="true"
                width="8"
                height="6"
                fill="none"
                className={clsxm(
                  "ml-1.5 transform text-zinc-300 transition duration-300 ease-out",
                  [open ? "rotate-0" : "-rotate-180"]
                )}
              >
                <path
                  d="M7 1.5l-3 3-3-3"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="div"
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-sm bg-black bg-opacity-95 text-zinc-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          static
        >
          <div className="relative py-4">
            <div className="cursor-pointer space-y-3 px-3">
              {profiles
                ?.filter((profile: IProfile, idx: number) => {
                  if (!profile || !activeProfile) return <Fragment key={idx} />;
                  return (
                    profile.attributes.name !== activeProfile.attributes.name
                  );
                })
                ?.map((profile: IProfile, idx: number) => {
                  if (!profile) return <Fragment key={idx} />;
                  return (
                    <Menu.Item as="div" key={`${idx}_${profile.id}`}>
                      {() => (
                        <div
                          className="group flex items-center justify-start"
                          onClick={() => handleSetActiveProfile(profile)}
                        >
                          <div
                            className="profile-avatar mr-2 flex h-8 w-8 flex-col rounded-md bg-cover"
                            style={{
                              backgroundImage: `url("/images/profiles/avatars/${profile.attributes.avatar}.png")`,
                            }}
                          ></div>
                          <span className="mr-4 text-sm font-semibold group-hover:underline">
                            {profile.attributes.name}
                          </span>
                        </div>
                      )}
                    </Menu.Item>
                  );
                })}
            </div>
            <div
              className={clsxm("px-3", [
                profiles &&
                profiles?.map((profile: IProfile) => profile).length < 2
                  ? "pt-0"
                  : "pt-5",
              ])}
            >
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={clsxm(
                      "flex w-full items-center text-left text-sm font-semibold focus:outline-none",
                      [
                        active
                          ? "text-sm font-semibold hover:underline"
                          : "text-zinc-100",
                      ]
                    )}
                    onClick={handleManageProfiles}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 flex-none text-zinc-300"
                    >
                      <rect
                        x="4.75"
                        y="6.75"
                        width="4.5"
                        height="4.5"
                        rx="2.25"
                        stroke="#D4D4D4"
                        strokeWidth={1.5}
                      />
                      <rect
                        x="10.75"
                        y="2.75"
                        width="4.5"
                        height="4.5"
                        rx="2.25"
                        stroke="#D4D4D4"
                        strokeWidth={1.5}
                      />
                      <path
                        d="M11.179 16.52c-.854-1.416-2.035-2.77-4.171-2.77s-3.318 1.353-4.171 2.77a.484.484 0 00.425.73h7.492c.379 0 .62-.406.425-.73zM12.75 9.75c2.14 0 3.51 1.358 4.418 2.776.204.32-.035.724-.414.724H12.75"
                        stroke="#D4D4D4"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                      />
                    </svg>
                    {getProfilesCount() < 2
                      ? "Manage Profile"
                      : "Manage Profiles"}
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="mt-4 space-y-3 border-t border-zinc-800 px-3 pt-4">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/my-account"
                    className={clsxm(
                      "flex w-full items-center text-left text-sm font-bold focus:outline-none",
                      [active ? "text-sm hover:underline" : "text-zinc-100"]
                    )}
                    legacyBehavior={false}
                  >
                    <>
                      <svg
                        aria-hidden="true"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="mr-3 flex-none text-zinc-300"
                      >
                        <rect
                          x="7.75"
                          y="5.75"
                          width="4.5"
                          height="4.5"
                          rx="2.25"
                        />
                        <rect
                          x="2.75"
                          y="2.75"
                          width="14.5"
                          height="14.5"
                          rx="7.25"
                        />
                        <path d="M14.618 15.5A5.249 5.249 0 0010 12.75a5.249 5.249 0 00-4.618 2.75" />
                      </svg>
                      Account
                    </>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={clsxm(
                      "flex w-full items-center text-left text-sm font-bold focus:outline-none",
                      [active ? "text-sm hover:underline" : "text-zinc-100"]
                    )}
                    onClick={logout}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      fill="none"
                      className="mr-3 flex-none text-zinc-300"
                    >
                      <path
                        d="M10.25 3.75H9A6.25 6.25 0 002.75 10v0A6.25 6.25 0 009 16.25h1.25M10.75 10h6.5M14.75 12.25l2.5-2.25-2.5-2.25"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Sign out of Netflix
                  </button>
                )}
              </Menu.Item>
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  ) : (
    <>
      <button
        type="submit"
        className="flex w-full items-center text-left text-sm font-bold text-zinc-100 focus:outline-none"
        onClick={logout}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          fill="none"
          className="mr-3 flex-none text-zinc-300"
        >
          <path
            d="M10.25 3.75H9A6.25 6.25 0 002.75 10v0A6.25 6.25 0 009 16.25h1.25M10.75 10h6.5M14.75 12.25l2.5-2.25-2.5-2.25"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Sign out of Netflix
      </button>
    </>
  );
}