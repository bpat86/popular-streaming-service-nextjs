import { motion } from "framer-motion";
import transitions from "../motion/transitions";

const PageTransitions = ({ children, variants }) => {
  return (
    <motion.div
      key="transitions"
      variants={variants || transitions.simpleFadeIn}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
    >
      {children}
    </motion.div>
  );
};

export default PageTransitions;
