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
    // If there are no sliders, render a message
    if (!model || model.length === 0)
      return (
        <div className="my-list flex min-h-screen items-center justify-center">
          <h2 className="text-3xl text-white">
            Looks like something went wrong.
          </h2>
        </div>
      );
    // Render the sliders
    return model
      .filter((slider) => slider.data.length > 0)
      .map((slider, idx) => {
        return (
          <Row
            key={`${idx}${slider.name.toLowerCase().split(" ").join("")}_${
              slider.id
            }`}
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
      });
  };

  /**
   * Render the slider component
   */
  return <>{handleSliders()}</>;
};

export default Sliders;
