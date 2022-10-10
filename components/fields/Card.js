import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";

const Card = forwardRef((props, inputRef) => {
  const {
    name,
    setStripeError,
    stripeError,
    handleChange,
    handleBlur,
    component: CardElement,
  } = props;
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "15px",
        fontFamily: "Nunito Sans, Helvetica, sans-serif",
        fontWeight: "400",
        fontSmoothing: "antialiased",
      },
      invalid: {
        color: "rgba(115, 115, 115, 1)",
        iconColor: "#e50914",
      },
    },
  };
  const [showErrorBorder, setShowErrorBorder] = useState(false);
  const elementRef = useRef();
  useImperativeHandle(inputRef, () => ({
    focus: () => {
      const isEmpty = document
        .querySelector(`#${name}`)
        .classList.contains("StripeElement--empty");
      const isFocused = document
        .querySelector(`#${name}`)
        .classList.contains("StripeElement--focus");

      if (isFocused) {
        setStripeError(null);
      }
    },
    blur: () => {
      const isFocused = document
        .querySelector(`#${name}`)
        .classList.contains("StripeElement--focus");
      const isEmpty = document
        .querySelector(`#${name}`)
        .classList.contains("StripeElement--empty");

      if (!isFocused && isEmpty) {
        setStripeError("Your card number is incomplete.");
      }
    },
  }));

  useEffect(() => {
    const isEmpty = inputRef.current?.classList?.contains(
      "StripeElement--empty"
    );
    const isFocused = inputRef.current?.classList?.contains(
      "StripeElement--focus"
    );

    if (!isFocused && stripeError) {
      setShowErrorBorder(true);
    } else if (isFocused) {
      setShowErrorBorder(false);
    }
  }, [inputRef.current, stripeError]);

  return (
    <>
      <div className="flex flex-col justify-start w-full relative h-18">
        <div
          className={`${
            showErrorBorder
              ? "flex items-center w-full h-14 py-6 px-3 bg-white border border-netflix-red focus:border-gray-400 focus:outline-none focus:ring-0 focus:ring-gray-400 focus:ring-inset sm:text-base text-gray-800 rounded-sm ease-out duration-150"
              : "flex items-center w-full h-14 py-6 px-3 bg-white border border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-0 focus:ring-gray-400 focus:ring-inset sm:text-base text-gray-800 rounded-sm ease-out duration-150"
          }`}
        >
          <CardElement
            id={name}
            name={name}
            className="w-full py-6"
            options={cardElementOptions}
            onChange={handleChange}
            onBlur={handleBlur}
            onReady={(element) => (elementRef.current = element)}
          />
        </div>
        {stripeError && (
          <div
            className="input-error text-netflix-red text-xs font-normal tracking-wide mt-1 px-1"
            role="alert"
          >
            {stripeError}
          </div>
        )}
      </div>
    </>
  );
});

export default Card;
