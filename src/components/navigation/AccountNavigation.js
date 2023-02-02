import Link from "next/link";

import ProfilesDropdown from "@/components/navigation/ProfilesDropdown";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

import Logo from "./Logo";

export const AccountNavigation = (props) => {
  const { isLoggedIn, isActive } = props;

  return (
    <MotionDivWrapper
      className="pinned-navigation"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] },
      }}
    >
      <div className="pinned-navigation-container">
        <header className="main-navigation-content fixed w-full bg-zinc-900 transition duration-150 ease-out">
          <div className="main-navbar max-w-screen-3xl relative mx-auto flex h-[68px] items-center justify-between px-6 sm:px-12 md:justify-start md:space-x-10">
            <div className="flex justify-start">
              <Link
                href={`${isActive ? "/browse" : "/my-account"}`}
                legacyBehavior
              >
                <a>
                  <Logo className="h-6 w-auto cursor-pointer text-netflix-red" />
                </a>
              </Link>
            </div>
            <div className="-my-2 -mr-2 md:hidden">
              <button
                type="button"
                className="focus:ring-netflix inline-flex items-center justify-center rounded-md bg-white p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset"
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
            <nav className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
              {isLoggedIn ? (
                <>
                  <div className="mr-auto">
                    <ul className="flex list-none items-center space-x-6">
                      <li>
                        <Link href={`${isActive ? "/browse" : "/my-account"}`}>
                          <span className="cursor-pointer text-sm text-white transition duration-700 ease-out">
                            Home
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${
                            isActive ? "/browse/genre/tv" : "/my-account"
                          }`}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300">
                            TV Shows
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${
                            isActive ? "/browse/genre/movies" : "/my-account"
                          }`}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300">
                            Movies
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${
                            isActive ? "/browse/latest" : "/my-account"
                          }`}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300">
                            New & Popular
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`${isActive ? "/browse" : "/my-account"}`}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300">
                            My List
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
    </MotionDivWrapper>
  );
};

export default AccountNavigation;
