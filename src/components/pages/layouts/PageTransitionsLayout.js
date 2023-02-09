import { transitions } from "@/actions/Actions";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

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
