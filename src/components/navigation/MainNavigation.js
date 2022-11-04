// Hooks
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link";
import { memo, useRef, useState } from "react";

// Components
import ProfilesDropdown from "@/components/navigation/ProfilesDropdown";

import Logo from "./Logo";

export const MainNavigation = memo(({ isLoggedIn, ...rest }) => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef();

  /**
   * Add a background color class when user scrolls down
   */
  useScrollPosition(
    ({ currPos }) => {
      currPos.y > 0 ? setScrolled(true) : setScrolled(false);
    },
    [],
    headerRef,
    true,
    50
  );

  const grayBackgroundNav = scrolled
    ? "bg-gray-900 ease-out duration-200 delay-150"
    : "ease-out duration-200 delay-150";

  return (
    <div className="pinned-navigation">
      <div className="pinned-navigation-container">
        <header
          ref={headerRef}
          className={`main-navigation-content fixed w-full ${grayBackgroundNav}`}
        >
          <div className="main-navbar max-w-screen-3xl relative mx-auto flex h-[68px] items-center justify-between px-6 sm:px-12 md:justify-start md:space-x-10">
            <div className="flex justify-start">
              <Link href="/browse" legacyBehavior>
                <a>
                  <Logo className="h-6 w-auto cursor-pointer text-netflix-red" />
                </a>
              </Link>
            </div>
            <nav className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
              {isLoggedIn ? (
                <>
                  <div className="mr-auto">
                    <ul className="flex list-none items-center space-x-6">
                      <li>
                        <Link href="/browse" scroll={false} legacyBehavior>
                          <a className="cursor-pointer text-sm text-white transition duration-700 ease-out hover:text-gray-300">
                            Home
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/genre/tv"
                          scroll={false}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-gray-300">
                            TV Shows
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/genre/movies"
                          scroll={false}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-gray-300">
                            Movies
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/latest"
                          scroll={false}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-gray-300">
                            New & Popular
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/my-list"
                          scroll={false}
                          legacyBehavior
                        >
                          <a className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-gray-300">
                            My List
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="ml-auto">
                    <ProfilesDropdown {...rest} />
                  </div>
                </>
              ) : (
                <></>
              )}
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
});

export default MainNavigation;
