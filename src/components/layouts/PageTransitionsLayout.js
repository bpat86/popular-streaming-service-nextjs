import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

import { transitions } from "@/actions/Actions";

const PageTransitionsLayout = ({ children, variants }) => {
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

export default PageTransitionsLayout;
