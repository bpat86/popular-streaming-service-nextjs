import { InView } from "react-intersection-observer";
import { shallow } from "zustand/shallow";

import Billboard from "@/components/billboard/Billboard";
import usePreviewModalStore from "@/store/PreviewModalStore";

type BillboardContainerProps = {
  model: any;
  shouldFreeze?: boolean;
};

const BillboardContainer = ({
  model,
  shouldFreeze,
}: BillboardContainerProps) => {
  const previewModalStateById = usePreviewModalStore(
    (state) => state.previewModalStateById,
    shallow
  );
  /**
   * Determine if a preview modal is currently open
   */
  const isPreviewModalOpen = () => {
    return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
  };

  return (
    <InView initialInView={true}>
      {({ ref, inView, entry }): JSX.Element => (
        <Billboard
          ref={ref}
          inView={inView}
          isIntersecting={entry?.isIntersecting}
          model={model}
          shouldFreeze={shouldFreeze ?? isPreviewModalOpen()}
        />
      )}
    </InView>
  );
};

export default BillboardContainer;
