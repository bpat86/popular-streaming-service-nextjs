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
          className="stripe-input-label flex text-base font-medium text-gray-500 items-center absolute top-0 bottom-0 px-3 py-4 h-14 duration-300 origin-0 select-none pointer-events-none"
        >
          Card number
        </label>
        {errors.cardNumber && touched.cardNumber && errors.cardNumber && (
          <div className="input-error text-netflix-red text-sm mt-1 px-1">
            {(errors.cardNumber && touched.cardNumber && errors.cardNumber) ||
              stripeError.toString()}
          </div>
        )}
      </div>
    </>
  );
};

export default CardNumber;
