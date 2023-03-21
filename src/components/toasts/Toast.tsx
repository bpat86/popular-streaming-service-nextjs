import { AnimatePresence, motion } from "framer-motion";
import { resolveValue, Toaster, ToastIcon } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      toastOptions={{
        position: "bottom-right",
        success: {
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          iconTheme: {
            primary: "rgb(212 212 216)",
            secondary: "rgb(63 63 70)",
          },
        },
        error: {
          iconTheme: {
            primary: "rgb(212 212 216)",
            secondary: "rgb(63 63 70)",
          },
        },
      }}
    >
      {(t) => (
        <AnimatePresence>
          {t.visible && (
            <motion.div
              className="flex transform rounded-lg bg-zinc-700 p-4 text-zinc-400 shadow-lg"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.9,
                transition: { duration: 0.3, ease: "easeIn" },
              }}
            >
              <ToastIcon toast={t} />
              <p className="pl-1.5 tracking-wide">
                {resolveValue(t.message, t)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Toaster>
  );
}
