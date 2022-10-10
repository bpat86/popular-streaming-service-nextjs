export default {
  simpleFadeIn: {
    initial: { opacity: 0, transition: { duration: 0.2 } },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  fadeOutZoomIn: {
    initial: {
      scale: 1,
      opacity: 0,
      y: 0,
    },
    animate: {
      opacity: 1,
      transition: { duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] },
    },
    exit: {
      scale: 1.04,
      y: -60,
      opacity: 0,
      transformOrigin: "0 0", // top
      transition: {
        duration: 0.75,
        ease: "easeIn",
      },
    },
  },
};
