import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "@/context/AuthContext";
import Logo from "./Logo";

export const ProfileNavigation = (props) => {
  // Destructure the props
  const { isLoggedIn, isRegistered, user } = props;

  // Bring in `logout` from the auth context
  const { logout } = useContext(AuthContext);

  console.log("user?.isLoggedIn: ", user?.isLoggedIn);

  return (
    <>
      <header className="navigation relative w-full">
        <div className="navigation-content w-full absolute overflow-hidden z-10">
          <div className="navbar bg-transparent relative pt-4 z-20">
            {/* Container */}
            <div className="flex justify-between items-start max-w-screen-3xl mx-auto px-6 py-2 sm:px-12 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/">
                  <a>
                    <Logo className={`h-8 sm:h-8 w-auto text-netflix-red`} />
                  </a>
                </Link>
              </div>
              <div className="-mr-2 -my-2 md:hidden">
                <button
                  type="button"
                  className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-netflix"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="sr-only">Open menu</span>
                  {/* Heroicon name: menu */}
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
              </div>
              {!user?.profile ? (
                <nav className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                  {user?.isLoggedIn ? (
                    <>
                      <button
                        type="submit"
                        onClick={() => logout()}
                        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-1 border border-gray-400 hover:border-white rounded-sm text-base font-medium text-gray-400 hover:text-white bg-transparent focus:outline-none transition ease-out duration-700"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <a className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-1 border border-transparent rounded-sm text-base font-medium text-white bg-netflix-red hover:bg-netflix-red-light transition ease-out duration-700">
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
