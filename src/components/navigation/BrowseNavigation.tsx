import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";

import ProfilesDropdown from "@/components/navigation/ProfilesDropdown";
import clsxm from "@/lib/clsxm";
import usePreviewModalStore from "@/store/PreviewModalStore";

// import usePreviewModalStore from "@/store/PreviewModalStore";
import UnstyledLink from "../ui/links/UnstyledLink";
import Logo from "./Logo";

// Clamp a number between a min and max value
function clamp(number: number, min: any, max: any) {
  return Math.min(Math.max(number, min), max);
}

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
  const scrollYBackgroundColorProgress = useTransform(scrollY, [0, 1], [0, 1]);
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

type BrowseNavigationProps = {
  isLoggedIn?: boolean;
};

export default function BrowseNavigation({
  isLoggedIn,
  ...rest
}: BrowseNavigationProps) {
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
          className={clsxm(
            "navigation transform-opacity fixed top-0 w-full transform-gpu",
            [
              usePreviewModalStore.getState().isDetailModal()
                ? "transition-none"
                : "transition-colors duration-700 ease-out",
            ]
          )}
          style={{
            // y: useTransform(scrollYBoundedProgressThrottled, [0, 1], [0, -68]),
            backgroundColor: useMotionTemplate`rgb(24 24 27 / ${useTransform(
              scrollYBackgroundColorProgressThrottled,
              [1, 0],
              [1, 0]
            )})`,
          }}
        >
          <div className="navigation-inner relative mx-auto flex h-[68px] items-center justify-between px-6 sm:px-12 md:justify-start md:space-x-10">
            <div className="z-1 flex justify-start">
              <UnstyledLink href="/browse">
                <Logo className="h-6 w-auto cursor-pointer text-netflix-red" />
              </UnstyledLink>
            </div>
            <nav className="z-1 hidden items-center justify-end md:flex md:flex-1 lg:w-0">
              {isLoggedIn ? (
                <>
                  <div className="mr-auto">
                    <ul className="flex list-none items-center space-x-6">
                      <li>
                        <Link
                          href="/browse"
                          scroll={false}
                          className="cursor-pointer text-sm text-white transition duration-700 ease-out hover:text-zinc-300"
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/genre/tv"
                          scroll={false}
                          className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300"
                        >
                          TV Shows
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/genre/movies"
                          scroll={false}
                          className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300"
                        >
                          Movies
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/latest"
                          scroll={false}
                          className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300"
                        >
                          New & Popular
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/browse/my-list"
                          scroll={false}
                          className="cursor-pointer text-sm text-white transition duration-300 ease-out hover:text-zinc-300"
                        >
                          My List
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 to-transparent" />
        </motion.header>
      </div>
    </div>
  );
}
