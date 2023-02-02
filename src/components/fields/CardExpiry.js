import { CardExpiryElement } from "@stripe/react-stripe-js";

const CardExpiry = ({ values, stripeError, errors, touched }) => {
  const inputOptions = {
    style: {
      base: {
        fontSize: "16px",
      },
      invalid: {
        color: "#737373",
        iconColor: "#e50914",
      },
    },
  };
  return (
    <>
      <div
        className={`h-14 w-full rounded-sm border border-zinc-200 bg-white px-3 py-5 text-zinc-800 focus:border-zinc-300 focus:outline-none focus:ring-0 focus:ring-inset focus:ring-zinc-300 sm:text-base ${
          (errors.cardNumber && touched.cardNumber && errors.cardNumber) ||
          stripeError
            ? "border-netflix-red"
            : ""
        }`}
      >
        <CardExpiryElement
          id="securityCode"
          name="securityCode"
          value={values.cardNumber}
          options={inputOptions}
        />
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

export default CardExpiry;
