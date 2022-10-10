import Link from "next/link";
import { motion } from "framer-motion";
import { useContext } from "react";

import AuthContext from "@/context/AuthContext";
import ProfileContext from "@/context/ProfileContext";
import ProfilesDropdown from "@/components/navigation/ProfilesDropdown";
import Logo from "./Logo";

export const AccountNavigation = (props) => {
  // Destructure the props
  const { isLoggedIn, isActive, isRegistered, user, activeProfile } = props;

  return (
    <motion.div
      className="pinned-navigation"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] },
      }}
    >
      <div className="pinned-navigation-container">
        <header
          className={`main-navigation-content w-full fixed bg-gray-900 transition ease-out duration-150`}
        >
          <div className="main-navbar h-[68px] flex justify-between items-center relative max-w-screen-3xl mx-auto px-6 sm:px-12 md:justify-start md:space-x-10">
            <div className="flex justify-start">
              <Link href={`${isActive ? "/browse" : "/my-account"}`}>
                <a>
                  <Logo className={`h-6 w-auto text-netflix-red`} />
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
            <nav className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              {isLoggedIn ? (
                <>
                  <div className="mr-auto">
                    <ul className="flex items-center list-none space-x-6">
                      <li>
                        <Link href={`${isActive ? "/browse" : "/my-account"}`}>
                          <a>
                            <span className="text-sm text-white transition ease-out duration-700">
                              Home
                            </span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${
                            isActive ? "/browse/genre/tv" : "/my-account"
                          }`}
                        >
                          <a>
                            <span className="text-sm text-white hover:text-gray-300 transition ease-out duration-300">
                              TV Shows
                            </span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${
                            isActive ? "/browse/genre/movies" : "/my-account"
                          }`}
                        >
                          <a>
                            <span className="text-sm text-white hover:text-gray-300 transition ease-out duration-300">
                              Movies
                            </span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${
                            isActive ? "/browse/latest" : "/my-account"
                          }`}
                        >
                          <a>
                            <span className="text-sm text-white hover:text-gray-300 transition ease-out duration-300">
                              New & Popular
                            </span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href={`${isActive ? "/browse" : "/my-account"}`}>
                          <a>
                            <span className="text-sm text-white hover:text-gray-300 transition ease-out duration-300">
                              My List
                            </span>
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="ml-auto">
                    <ProfilesDropdown {...props} />
                  </div>
                </>
              ) : (
                <></>
              )}
            </nav>
          </div>
        </header>
      </div>
    </motion.div>
  );
};

export default AccountNavigation;
