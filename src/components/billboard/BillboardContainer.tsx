import { InView } from "react-intersection-observer";

import Billboard from "@/components/billboard/Billboard";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { IModel, PreviewModalStore } from "@/store/types";

type BillboardContainerProps = {
  model: IModel;
  shouldFreeze?: boolean;
};

const previewModalStateByIdSelector = (state: PreviewModalStore) =>
  state.previewModalStateById;

export default function BillboardContainer({
  model,
  shouldFreeze,
}: BillboardContainerProps) {
  const previewModalStateById = usePreviewModalStore(
    previewModalStateByIdSelector
  );

  /**
   * Determine if a preview modal is currently open
   */
  function isPreviewModalOpen() {
    return previewModalStateById !== undefined &&
      Object.values(previewModalStateById).some(({ isOpen }) => isOpen)
      ? true
      : false;
  }

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
}
