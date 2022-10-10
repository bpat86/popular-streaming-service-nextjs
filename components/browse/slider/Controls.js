import debounce from "lodash.debounce";

const SliderControls = (props) => {
  const {
    enablePeek,
    isAnimating,
    onClick,
    modalOpen,
    moveDirection,
    showNextButton,
    sliderActions,
    sliderHasMovedOnce,
  } = props;

  const handleOnClick = debounce((e) => {
    if (isAnimating) return;
    onClick(e);
  }, 200);

  return showNextButton ? (
    <span
      tabIndex={sliderHasMovedOnce ? 0 : -1}
      role="button"
      className={`handle ${
        moveDirection === sliderActions.MOVE_DIRECTION_PREV
          ? "handlePrev active"
          : "handleNext active"
      }`}
      aria-label={`${
        moveDirection === sliderActions.MOVE_DIRECTION_PREV
          ? "See previous titles"
          : "See more titles"
      }`}
      onClick={handleOnClick}
    >
      <div
        className={`${
          moveDirection === sliderActions.MOVE_DIRECTION_PREV
            ? "previous"
            : "next"
        } flex items-center justify-center ${
          enablePeek
            ? "bg-black bg-opacity-50 hover:bg-opacity-80"
            : "bg-transparent hover:bg-black hover:bg-opacity-80"
        } w-6 sm:w-12 h-full cursor-pointer pointer-events-auto transition duration-100 ease-out`}
      >
        {moveDirection === sliderActions.MOVE_DIRECTION_PREV
          ? !modalOpen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-7 h-7 xl:w-10 xl:h-10 transition transform scale-100 hover:scale-150 duration-75 ease-out`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )
          : !modalOpen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-7 h-7 xl:w-10 xl:h-10 transition transform scale-100 hover:scale-150 duration-75 ease-out`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
      </div>
    </span>
  ) : (
    <></>
  );
};

export default SliderControls;
