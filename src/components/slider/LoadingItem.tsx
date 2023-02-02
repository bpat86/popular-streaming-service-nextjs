const LoadingItem = ({ width }: { width?: number }) => {
  return (
    <div
      className="slider-item slider-item-"
      // style={{ width: `${width}%` }}
    >
      <div className="boxart-size-16x9 slider-refocus bg-zinc-800"></div>
    </div>
  );
};

export default LoadingItem;
