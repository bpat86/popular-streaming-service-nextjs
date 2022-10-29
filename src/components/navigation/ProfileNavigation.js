import Link from "next/link";
import { useContext } from "react";

import AuthContext from "@/context/AuthContext";

import Logo from "./Logo";

export const ProfileNavigation = ({ user }) => {
  // Bring in `logout` from the auth context
  const { logout } = useContext(AuthContext);

  return (
    <>
      <header className="navigation relative w-full">
        <div className="navigation-content absolute z-10 w-full overflow-hidden">
          <div className="navbar relative z-20 bg-transparent pt-4">
            {/* Container */}
            <div className="max-w-screen-3xl mx-auto flex items-start justify-between px-6 py-2 sm:px-12 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/">
                  <a>
                    <Logo className="h-8 w-auto text-netflix-red sm:h-8" />
                  </a>
                </Link>
              </div>
              {/* <div className="-my-2 -mr-2 md:hidden">
                <button
                  type="button"
                  className="focus:ring-netflix inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset"
                >
                  <span className="sr-only">Open menu</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div> */}
              {!user?.profile ? (
                <nav className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                  {user?.isLoggedIn ? (
                    <>
                      <button
                        type="submit"
                        onClick={() => logout()}
                        className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-sm border border-gray-400 bg-transparent px-4 py-1 text-base font-medium text-gray-400 transition duration-700 ease-out hover:border-white hover:text-white focus:outline-none"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <a className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-sm border border-transparent bg-netflix-red px-4 py-1 text-base font-medium text-white transition duration-700 ease-out hover:bg-netflix-red-light">
                          Sign In
                        </a>
                      </Link>
                    </>
                  )}
                </nav>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="navbar-replacement"></div>
      </header>
    </>
  );
};

export default ProfileNavigation;
