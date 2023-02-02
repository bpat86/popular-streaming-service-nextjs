import Image from "next/image";
import { useState } from "react";

import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

const ProfilesAccordion = ({ id, avatar, name, maturity, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <MotionDivWrapper
        key={id}
        className="relative flex w-full items-center space-x-4 border-t-2 border-zinc-100 bg-white py-5 first-of-type:border-none focus-within:ring-2 focus-within:ring-zinc-500 focus-within:ring-offset-2"
        onClick={() => (expanded ? setExpanded(false) : setExpanded(true))}
      >
        <div className="flex-shrink-0">
          <div className="relative h-16 w-16">
            <Image
              fill
              className="rounded-md"
              src={`/images/profiles/avatars/${avatar}.png`}
              alt=""
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-base font-bold text-zinc-700">{name}</p>
          <p className="truncate text-sm text-zinc-500">
            {maturity ? "TV-PG PG and below" : "All Maturity Ratings"}
          </p>
        </div>
        <span className="px-1 text-zinc-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              expanded ? "-rotate-180" : "rotate-0"
            } duration-300 ease-out`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </MotionDivWrapper>
      <AnimatePresenceWrapper initial={false}>
        {expanded && (
          <MotionDivWrapper
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <MotionDivWrapper
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-zinc-500"
            >
              {children}
            </MotionDivWrapper>
          </MotionDivWrapper>
        )}
      </AnimatePresenceWrapper>
    </>
  );
};

export default ProfilesAccordion;
