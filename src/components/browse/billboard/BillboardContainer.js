import { InView } from "react-intersection-observer";
import shallow from "zustand/shallow";

import Billboard from "@/components/browse/billboard/Billboard";

// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";

const BillboardContainer = ({ model, shouldFreeze }) => {
  const previewModalStateById = usePreviewModalStore(
    (state) => state.previewModalStateById,
    shallow
  );
  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = () => {
    return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
  };

  return (
    (model?.id && (
      <InView initialInView={true}>
        {({ ref, inView, entry }) => (
          <Billboard
            ref={ref}
            inView={inView}
            isIntersecting={entry?.isIntersecting}
            model={model}
            shouldFreeze={shouldFreeze ?? isPreviewModalOpen()}
          />
        )}
      </InView>
    )) || <></>
  );
};

export default BillboardContainer;
