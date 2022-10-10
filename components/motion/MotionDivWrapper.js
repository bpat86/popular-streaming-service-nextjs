import { forwardRef } from "react";
import { motion } from "framer-motion";

const MotionDivWrapper = forwardRef(({ children, ...props }, ref) => {
  return (
    <motion.div ref={ref} {...props}>
      {children}
    </motion.div>
  );
});

MotionDivWrapper.displayName = "MotionDivWrapper";
export default MotionDivWrapper;
