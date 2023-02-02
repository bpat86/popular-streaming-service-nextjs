import { CardNumberElement } from "@stripe/react-stripe-js";

const CardNumber = ({ values, stripeError, errors, touched }) => {
  const inputOptions = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      },
      invalid: {
        color: "#737373",
        iconColor: "#e50914",
      },
    },
  };
  return (
    <>
      <div className="relative">
        <CardNumberElement
          id="cardNumber"
          name="cardNumber"
          value={values.cardNumber}
          options={inputOptions}
          className={`stripe-input ${
            (errors.cardNumber && touched.cardNumber && errors.cardNumber) ||
            stripeError
              ? "border-netflix-red"
              : ""
          }`}
        />
        <label
          htmlFor="cardNumber"
          className="stripe-input-label pointer-events-none absolute top-0 bottom-0 flex h-14 origin-0 select-none items-center px-3 py-4 text-base font-medium text-zinc-500 duration-300"
        >
          Card number
        </label>
        {errors.cardNumber && touched.cardNumber && errors.cardNumber && (
          <div className="input-error mt-1 px-1 text-sm text-netflix-red">
            {(errors.cardNumber && touched.cardNumber && errors.cardNumber) ||
              stripeError.toString()}
          </div>
        )}
      </div>
    </>
  );
};

export default CardNumber;
