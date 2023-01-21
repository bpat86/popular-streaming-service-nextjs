import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import AuthContext from "@/context/AuthContext";

import Logo from "./Logo";

export const AuthNavigation = ({ isLoggedIn }) => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef();
  const navigationTopRef = useRef();

  useEffect(() => {
    if (headerRef.current) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Returns height of header element
   */
  const getHeaderHeight = () => {
    return 97; // window.innerWidth <= 540 ? 124 : 80
  };

  /**
   * Returns the scroll distance limit
   */
  const maxScrollDistance = () => {
    return (
      Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      ) - window.innerHeight
    );
  };

  /**
   * Detect a really fast scroll
   * @param scrollSpeed
   * @returns boolean
   */
  const scrollingFast = (scrollSpeed = 0) => {
    return Math.abs(scrollSpeed) > 120;
  };

  /**
   * Scroll handler logic
   */
  const handleScroll = () => {
    if (!headerRef.current) return;
    const startScroll = window.scrollY || 0;
    // Set variables
    window.scrollY = document.documentElement.scrollTop || 0;
    const endScroll = Math.max(window.scrollY, 0);
    // When scrolled to top / bottom of page
    if (window.scrollY <= 0 || maxScrollDistance() <= 0) {
      navigationTopRef.current = 0;
      headerRef.current.style.position = "fixed";
      headerRef.current.style.top = "";
    }
    // When user scrolls to bottom
    else if (window.scrollY >= maxScrollDistance()) {
      // console.log("You've hit rock bottom...");
    }
    // When user scrolls quickly
    else if (scrollingFast(window.scrollY - startScroll)) {
      navigationTopRef.current = endScroll - getHeaderHeight();
      headerRef.current.style.top = navigationTopRef.current + "px";
      headerRef.current.style.position = "";
    }
    // When user scrolls up
    else if (window.scrollY < startScroll) {
      const navigationHeight = Math.max(window.scrollY - getHeaderHeight(), 0);
      navigationTopRef.current > endScroll
        ? ((navigationTopRef.current = endScroll),
          (headerRef.current.style.position = "fixed"),
          (headerRef.current.style.top = ""))
        : (!navigationTopRef.current ||
            navigationTopRef.current < navigationHeight) &&
          ((navigationTopRef.current = navigationHeight),
          (headerRef.current.style.top = navigationTopRef.current + "px"));
      // console.log("scrolling up");
    } else {
      window.scrollY > startScroll &&
        "fixed" === headerRef.current.style.position &&
        ((navigationTopRef.current = endScroll),
        (headerRef.current.style.top = navigationTopRef.current + "px"),
        (headerRef.current.style.position = ""));
      // console.log("scrolling down");
    }
  };

  return (
    <>
      {
        <header className="navigation relative z-10 w-full">
          <div
            ref={headerRef}
            className="navigation-content absolute z-10 w-full overflow-hidden"
          >
            <div className="navbar relative z-20 border-b border-gray-200 bg-white bg-opacity-90 py-4 backdrop-blur-sm backdrop-filter">
              {/* Container */}
              <div className="max-w-screen-3xl mx-auto flex items-center justify-between px-6 py-2 sm:px-12 md:justify-start md:space-x-10">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                  <Link href="/" legacyBehavior>
                    <a>
                      <Logo className="h-12 w-auto text-netflix-red sm:h-12" />
                    </a>
                  </Link>
                </div>
                <div className="-my-2 -mr-2 md:hidden">
                  <button
                    type="button"
                    className="focus:ring-netflix inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset"
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
                <nav className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
                  {isLoggedIn ? (
                    <>
                      <button
                        type="submit"
                        onClick={() => logout()}
                        className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded border border-transparent px-5 py-1 text-lg font-semibold text-gray-800 transition duration-700 ease-out focus:outline-none"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" legacyBehavior>
                        <a className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded border border-transparent px-5 py-1 text-lg font-semibold text-gray-800  transition duration-700 ease-out focus:outline-none">
                          Sign In
                        </a>
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
          <div className="navbar-replacement"></div>
        </header>
      }
    </>
  );
};

export default AuthNavigation;
