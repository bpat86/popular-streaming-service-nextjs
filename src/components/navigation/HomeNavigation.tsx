import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useContext, useState } from "react";

import AuthContext from "@/context/AuthContext";

import Logo from "./Logo";

// Clamp a number between a min and max value
const clamp = (number: number, min: any, max: any) =>
  Math.min(Math.max(number, min), max);

// Bounded scroll hook
function useBoundedScroll(bounds: number) {
  const { scrollY } = useScroll();
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, bounds],
    [0, 1]
  );
  // This is the progress of the background color value as it changes from 0 to 1
  const scrollYBackgroundColorProgress = useTransform(scrollY, [0, 50], [0, 1]);
  // Motion value event listener to update the bounded scroll value
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    const diff = latest - previous;
    const newScrollYBounded = scrollYBounded.get() + diff;
    scrollYBounded.set(clamp(newScrollYBounded, 0, bounds));
  });
  // Return the bounded scroll and progress values
  return {
    scrollYBounded,
    scrollYBoundedProgress,
    scrollYBackgroundColorProgress,
  };
}

type HomeNavigationProps = {
  isLoggedIn?: boolean;
};

export const HomeNavigation = ({ isLoggedIn }: HomeNavigationProps) => {
  // Bring in `logout` from the auth context
  const { logout } = useContext(AuthContext);

  // Set initial state
  const [isOpen, setIsOpen] = useState(false);

  // Get the bounded scroll values
  const { scrollYBoundedProgress, scrollYBackgroundColorProgress } =
    useBoundedScroll(200);
  // Throttle the bounded scroll progress value
  const scrollYBoundedProgressThrottled = useTransform(
    scrollYBoundedProgress,
    [0, 0.4, 1],
    [0, 0, 1]
  );
  // Throttle the background color progress value
  const scrollYBackgroundColorProgressThrottled = useTransform(
    scrollYBackgroundColorProgress,
    [0, 0.4, 1],
    [0, 0, 1]
  );

  return (
    <div className="max-w-screen-3xl mx-auto flex w-full flex-1 overflow-hidden">
      <div className="z-50 flex-1 overflow-y-scroll">
        <motion.header
          className="fixed w-full"
          style={{
            y: useTransform(scrollYBoundedProgressThrottled, [0, 1], [0, -97]),
            backgroundColor: useMotionTemplate`rgb(24 24 27 / ${useTransform(
              scrollYBackgroundColorProgressThrottled,
              [1, 0],
              [0.97, 0]
            )})`,
          }}
        >
          {/* Container */}
          <div className="max-w-screen-3xl relative mx-auto flex h-[97px] items-center justify-between px-6 sm:px-12 md:justify-start md:space-x-10">
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
                className="focus:ring-netflix inline-flex items-center justify-center rounded-md bg-white p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset"
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
              {isLoggedIn && logout ? (
                <>
                  <button
                    type="submit"
                    onClick={() => logout()}
                    className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-sm border border-transparent bg-netflix-red px-4 py-1 text-base font-medium text-white transition duration-700 ease-out hover:bg-netflix-red-light focus:outline-none"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" legacyBehavior>
                    <a className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-sm border border-transparent bg-netflix-red px-4 py-1 text-base font-medium text-white transition duration-700 ease-out hover:bg-netflix-red-light">
                      Sign In
                    </a>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </motion.header>
      </div>
    </div>
  );
};

export default HomeNavigation;
