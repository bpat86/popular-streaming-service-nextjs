import MotionDivWrapper from "@/lib/MotionDivWrapper";

import { transitions } from "@/actions/Actions";

const PageTransitions = ({ children, variants }) => {
  return (
    <MotionDivWrapper
      key="transitions"
      variants={variants || transitions.simpleFadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </MotionDivWrapper>
  );
};

export default PageTransitions;
