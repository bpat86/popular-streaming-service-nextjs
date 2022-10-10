import Row from "./Row";

const Sliders = ({ model }) => {
  /**
   * Create the different Slider components.
   * @returns
   */
  const handleSliders = () => {
    return model?.filter((slider) => slider?.data)?.length > 0 ? (
      model?.map(
        (slider, idx) =>
          slider?.data?.length > 0 && (
            <Row
              key={slider?.listContext + idx}
              model={slider?.data}
              enablePeek={true}
              enableLooping={true}
              isMyListRow={slider?.isMyListRow}
              listContext={slider?.listContext}
              mediaType={slider?.type}
              myListRowItemsLength={
                slider?.isMyListRow ? slider?.data?.length : null
              }
              previewModalEnabled={true}
              rowNum={slider?.id}
              sliderNum={idx}
              subheader={false}
              title={slider?.name}
            />
          )
      )
    ) : (
      <div className="my-list flex items-center justify-center min-h-screen">
        <h2 className="text-3xl text-white">
          You haven't added anything to your list yet!
        </h2>
      </div>
    );
  };

  return handleSliders();
};

export default Sliders;
