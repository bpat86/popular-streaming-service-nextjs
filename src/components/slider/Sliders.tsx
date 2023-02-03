import { ISlider } from "@/pages/api/tmdb/types";

import Row from "./Row";

type SlidersProps = {
  model: ISlider[];
};

const Sliders = ({ model }: SlidersProps) => {
  /**
   * Render the slider row components
   */
  const handleSliders = () => {
    return model?.filter((slider) => slider?.data)?.length > 0 ? (
      model?.map((slider, idx) => {
        if (slider.data.length > 0) {
          return (
            <Row
              key={`${slider.id}_${idx}`}
              model={slider.data}
              enablePeek={true}
              enableLooping={true}
              isMyListRow={slider.isMyListRow}
              listContext={slider.listContext}
              mediaType={slider.type}
              myListRowItemsLength={slider.isMyListRow ? slider.data.length : 0}
              previewModalEnabled={true}
              rowNum={slider.id}
              sliderNum={idx}
              title={slider.name}
            />
          );
        }
        return <></>;
      })
    ) : (
      <div className="my-list flex min-h-screen items-center justify-center">
        <h2 className="text-3xl text-white">
          You haven't added anything to your list yet!
        </h2>
      </div>
    );
  };

  /**
   * Render the slider component
   */
  return <>{handleSliders()}</>;
};

export default Sliders;
