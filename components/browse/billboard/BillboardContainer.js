import { InView } from "react-intersection-observer";
import Billboard from "@/components/browse/billboard/Billboard";

const BillboardContainer = ({ model, shouldFreeze }) => {
  return (
    (model?.id && (
      <InView initialInView={true}>
        {({ ref, inView, entry }) => (
          <Billboard
            ref={ref}
            inView={inView}
            isIntersecting={entry?.isIntersecting}
            model={model}
            shouldFreeze={shouldFreeze}
          />
        )}
      </InView>
    )) || <></>
  );
};

export default BillboardContainer;
