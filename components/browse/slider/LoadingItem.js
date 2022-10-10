const LoadingItem = (props) => {
  const { widthPercent } = props;

  return (
    <div
      className={`slider-item slider-item-`}
      // style={{ width: `${widthPercent}%` }}
    >
      <div className="boxart-size-16x9 bg-gray-800 slider-refocus"></div>
    </div>
  );
};

export default LoadingItem;
