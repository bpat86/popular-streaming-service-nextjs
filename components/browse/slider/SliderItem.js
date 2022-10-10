import { motion } from "framer-motion";

const SliderItem = (props) => {
  const {
    children,
    sliderIsAnimating,
    fullDataLoaded,
    viewportPosition,
    viewportIndex,
  } = props;

  /**
   * Shrink removal animation when item is removed from user list
   * @returns {Object}
   */
  const removeFromListAnimationProps = () => {
    return !sliderIsAnimating
      ? {
          exit: {
            scaleX: 0,
            scaleY: 0,
            opacity: 0,
            transition: {
              delay: 0.12,
              opacity: {
                delay: 0.3,
                duration: 0.36,
                ease: "linear",
              },
              duration: 0.36,
              ease: [0.21, 0, 0.07, 1],
            },
          },
        }
      : {};
  };

  return (
    <motion.div
      className={
        fullDataLoaded
          ? `slider-item slider-item-${viewportIndex}${
              viewportPosition ? " " + viewportPosition : ""
            }`
          : `slider-item slider-item-`
      }
      {...removeFromListAnimationProps()}
    >
      {fullDataLoaded ? (
        children
      ) : (
        <div className="boxart-size-16x9 bg-gray-800 animate-pulse"></div>
      )}
    </motion.div>
  );
};

export default SliderItem;
