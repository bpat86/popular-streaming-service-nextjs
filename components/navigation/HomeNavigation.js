import { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import AuthContext from "@/context/AuthContext";
import Logo from "./Logo";

export const HomeNavigation = (props) => {
  // Destructure the props
  const { isLoggedIn, user } = props;

  // Bring in `logout` from the auth context
  const { logout } = useContext(AuthContext);

  // Set initial state
  const [isOpen, setIsOpen] = useState(false);
  const header = useRef();

  useEffect(() => {
    if (header.current) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
   * @param {number} scrollSpeed
   */
  const scrollingFast = (scrollSpeed) => {
    return Math.abs(scrollSpeed) > 120;
  };

  /**
   * Scroll handler logic
   */
  const handleScroll = () => {
    if (!header.current) return;
    // Set variables
    const startScroll = window.scrollTop;
    window.scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const endScroll = Math.max(window.scrollTop, 0);
    // When scrolled to top / bottom of page
    if (window.scrollTop <= 0 || maxScrollDistance() <= 0) {
      (window.navigationTop = 0),
        (header.current.style.position = "fixed"),
        (header.current.style.top = "");
    }
    // When user scrolls to bottom
    else if (window.scrollTop >= maxScrollDistance()) {
      // console.log("You've hit rock bottom...");
    }
    // When user scrolls quickly
    else if (scrollingFast(window.scrollTop - startScroll)) {
      (window.navigationTop = endScroll - getHeaderHeight()),
        (header.current.style.top = window.navigationTop + "px"),
        (header.current.style.position = "");
    }
    // When user scrolls up
    else if (window.scrollTop < startScroll) {
      const navigationHeight = Math.max(
        window.scrollTop - getHeaderHeight(),
        0
      );
      window.navigationTop > endScroll
        ? ((window.navigationTop = endScroll),
          (header.current.style.position = "fixed"),
          (header.current.style.top = ""))
        : (!window.navigationTop || window.navigationTop < navigationHeight) &&
          ((window.navigationTop = navigationHeight),
          (header.current.style.top = window.navigationTop + "px"));
      console.log("scrolling up");
    } else {
      window.scrollTop > startScroll &&
        (isOpen
          ? ((window.navigationTop = endScroll),
            (header.current.style.top = ""),
            (header.current.style.position = "fixed"))
          : "fixed" === header.current.style.position &&
            ((window.navigationTop = endScroll),
            (header.current.style.top = window.navigationTop + "px"),
            (header.current.style.position = "")));
      // console.log("scrolling down");
    }
  };

  return (
    <>
      <header className="navigation relative w-full">
        <div
          ref={header}
          className="navigation-content w-full absolute overflow-hidden backdrop-filter backdrop-blur-sm sm:backdrop-blur-0 z-10"
        >
          <div className="navbar bg-transparent relative pt-4 z-20">
            {/* Container */}
            <div className="flex justify-between items-start max-w-screen-3xl mx-auto px-6 py-2 sm:px-12 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/">
                  <a>
                    <Logo className={`h-12 sm:h-12 w-auto text-netflix-red`} />
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
                    <button
                      type="submit"
                      onClick={() => logout()}
                      className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-1 border border-transparent rounded-sm text-base font-medium text-white bg-netflix-red hover:bg-netflix-red-light focus:outline-none transition ease-out duration-700"
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
            </div>
          </div>
        </div>
        <div className="navbar-replacement"></div>
      </header>
    </>
  );
};

export default HomeNavigation;
