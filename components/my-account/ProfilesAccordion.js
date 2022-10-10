import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ProfilesAccordion = ({ id, avatar, name, maturity, children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <motion.div
        key={id}
        className={`flex items-center w-full relative border-t-2 first-of-type:border-none border-gray-100 bg-white space-x-4 py-5 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500`}
        onClick={() => (expanded ? setExpanded(false) : setExpanded(true))}
      >
        <div className="flex-shrink-0">
          <img
            className="w-16 h-16 rounded-md"
            src={`/images/profiles/avatars/${avatar}.png`}
            alt=""
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-base font-bold text-gray-700">{name}</p>
          <p className="text-sm text-gray-500 truncate">
            {maturity ? "TV-PG PG and below" : "All Maturity Ratings"}
          </p>
        </div>
        <span className={`text-gray-500 px-1`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 ${
              expanded ? "-rotate-180" : "rotate-0"
            } ease-out duration-300`}
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
      </motion.div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
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
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-gray-500"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilesAccordion;
