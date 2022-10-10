import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import ProfileContext from "@/context/ProfileContext";
import AuthContext from "@/context/AuthContext";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const UserDropdown = (props) => {
  const { isActive, user, profiles } = props;
  const { logout } = useContext(AuthContext);
  const { manageProfilesHandler, makeProfileActive, activeProfile } =
    useContext(ProfileContext);

  const getTotalProfiles = () => {
    console.log("profiles: ", profiles);
    return profiles && profiles.map((profile) => profile).length;
  };

  return isActive ? (
    <Menu as="div" className="relative inline-block text-left bg-transparent">
      <div className="flex items-center">
        <div className="group bg-transparent rounded-full flex items-center justify-center text-gray-100 hover:text-gray-200 focus:outline-none mr-4 cursor-pointer">
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
        <Menu.Button className="group bg-transparent rounded-full flex items-center justify-center text-gray-100 hover:text-gray-200 focus:outline-none cursor-pointer ml-2">
          {({ open }) => (
            <>
              <span className="sr-only">Open profile menu</span>
              <span className="text-sm font-semibold mr-2">
                {activeProfile?.attributes.name}
              </span>
              <div
                className="profile-avatar w-8 h-8 flex flex-col mx-auto bg-cover rounded-md"
                style={{
                  backgroundImage: `url("/images/profiles/avatars/${activeProfile?.attributes.avatar}.png")`,
                }}
              ></div>
              <svg
                aria-hidden="true"
                width="8"
                height="6"
                fill="none"
                className={`text-gray-300 ml-1.5 transform transition ease-out duration-300 ${
                  open ? "rotate-0" : "-rotate-180"
                }`}
              >
                <path
                  d="M7 1.5l-3 3-3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
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
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-sm shadow-lg bg-black bg-opacity-95 text-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none"
          static
        >
          <div className="relative py-4">
            <div className="px-3 space-y-3 cursor-pointer">
              {profiles &&
                profiles.map((profile) => {
                  if (
                    profile.attributes.name !== activeProfile?.attributes.name
                  ) {
                    return (
                      <Menu.Item as="div" key={profile.id}>
                        {({ active }) => (
                          <>
                            <div
                              className="group flex items-center justify-start"
                              onClick={() => {
                                makeProfileActive(profile);
                              }}
                            >
                              <div
                                className={
                                  "profile-avatar w-8 h-8 flex flex-col bg-cover rounded-md mr-2"
                                }
                                style={{
                                  backgroundImage: `url("/images/profiles/avatars/${profile.attributes.avatar}.png")`,
                                }}
                              ></div>
                              <span className="text-sm font-semibold group-hover:underline mr-4">
                                {profile.attributes.name}
                              </span>
                            </div>
                          </>
                        )}
                      </Menu.Item>
                    );
                  }
                })}
            </div>
            <div
              className={`px-3 ${
                profiles && profiles.map((profile) => profile).length < 2
                  ? "pt-0"
                  : "pt-5"
              }`}
            >
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={classNames(
                      active
                        ? "text-sm font-semibold hover:underline"
                        : "text-gray-100",
                      "flex items-center w-full text-left text-sm font-semibold focus:outline-none"
                    )}
                    onClick={() => manageProfilesHandler()}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-none mr-3 text-gray-300"
                    >
                      <rect
                        x="4.75"
                        y="6.75"
                        width="4.5"
                        height="4.5"
                        rx="2.25"
                        stroke="#D4D4D4"
                        strokeWidth="1.5"
                      ></rect>
                      <rect
                        x="10.75"
                        y="2.75"
                        width="4.5"
                        height="4.5"
                        rx="2.25"
                        stroke="#D4D4D4"
                        strokeWidth="1.5"
                      ></rect>
                      <path
                        d="M11.179 16.52c-.854-1.416-2.035-2.77-4.171-2.77s-3.318 1.353-4.171 2.77a.484.484 0 00.425.73h7.492c.379 0 .62-.406.425-.73zM12.75 9.75c2.14 0 3.51 1.358 4.418 2.776.204.32-.035.724-.414.724H12.75"
                        stroke="#D4D4D4"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                    {getTotalProfiles() < 2
                      ? "Manage Profile"
                      : "Manage Profiles"}
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="border-t border-gray-800 mt-4 pt-4 px-3 space-y-3">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/my-account"
                    className={classNames(
                      active ? "text-sm hover:underline" : "text-gray-100",
                      "flex items-center w-full text-left text-sm font-bold focus:outline-none"
                    )}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="flex-none mr-3 text-gray-300"
                    >
                      <rect
                        x="7.75"
                        y="5.75"
                        width="4.5"
                        height="4.5"
                        rx="2.25"
                      ></rect>
                      <rect
                        x="2.75"
                        y="2.75"
                        width="14.5"
                        height="14.5"
                        rx="7.25"
                      ></rect>
                      <path d="M14.618 15.5A5.249 5.249 0 0010 12.75a5.249 5.249 0 00-4.618 2.75"></path>
                    </svg>
                    Account
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={classNames(
                      active ? "text-sm hover:underline" : "text-gray-100",
                      "flex items-center w-full text-left text-sm font-bold focus:outline-none"
                    )}
                    onClick={() => logout()}
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      fill="none"
                      className="flex-none mr-3 text-gray-300"
                    >
                      <path
                        d="M10.25 3.75H9A6.25 6.25 0 002.75 10v0A6.25 6.25 0 009 16.25h1.25M10.75 10h6.5M14.75 12.25l2.5-2.25-2.5-2.25"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
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
        className={
          "flex items-center w-full text-left text-sm text-gray-100 font-bold focus:outline-none"
        }
        onClick={() => logout()}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          fill="none"
          className="flex-none mr-3 text-gray-300"
        >
          <path
            d="M10.25 3.75H9A6.25 6.25 0 002.75 10v0A6.25 6.25 0 009 16.25h1.25M10.75 10h6.5M14.75 12.25l2.5-2.25-2.5-2.25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        Sign out of Netflix
      </button>
    </>
  );
};

export default UserDropdown;
