import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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
    const isFocused = inputRef.current?.classList?.contains(
      "StripeElement--focus"
    );

    if (!isFocused && stripeError) {
      setShowErrorBorder(true);
    } else if (isFocused) {
      setShowErrorBorder(false);
    }
  }, [stripeError, inputRef]);

  return (
    <>
      <div className="relative flex h-18 w-full flex-col justify-start">
        <div
          className={`${
            showErrorBorder
              ? "flex h-14 w-full items-center rounded-sm border border-netflix-red bg-white py-6 px-3 text-zinc-800 duration-150 ease-out focus:border-zinc-400 focus:outline-none focus:ring-0 focus:ring-inset focus:ring-zinc-400 sm:text-base"
              : "flex h-14 w-full items-center rounded-sm border border-zinc-300 bg-white py-6 px-3 text-zinc-800 duration-150 ease-out focus:border-zinc-400 focus:outline-none focus:ring-0 focus:ring-inset focus:ring-zinc-400 sm:text-base"
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
            className="input-error mt-1 px-1 text-xs font-normal tracking-wide text-netflix-red"
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
