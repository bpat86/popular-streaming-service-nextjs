import { InView } from "react-intersection-observer";
import { shallow } from "zustand/shallow";

import Billboard from "@/components/billboard/Billboard";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { IModel } from "@/store/types";

type BillboardContainerProps = {
  model: IModel;
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
    return !!(
      previewModalStateById &&
      Object.values(previewModalStateById).some(({ isOpen }) => isOpen)
    );
  };

  return (
    <InView initialInView={true} threshold={0.4}>
      {({ ref, inView }) => (
        <Billboard
          ref={ref}
          inView={inView}
          model={model}
          shouldFreeze={shouldFreeze || isPreviewModalOpen()}
        />
      )}
    </InView>
  );
};

export default BillboardContainer;
