import { CardCvcElement } from "@stripe/react-stripe-js";

const CardCVC = ({ values, stripeError, errors, touched }) => {
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
        className={`h-14 w-full rounded-sm border border-gray-200 bg-white px-3 py-5 text-gray-800 focus:border-gray-300 focus:outline-none focus:ring-0 focus:ring-inset focus:ring-gray-300 sm:text-base ${
          (errors.cardNumber && touched.cardNumber && errors.cardNumber) ||
          stripeError
            ? "border-netflix-red"
            : ""
        }`}
      >
        <CardCvcElement
          id="expirationDate"
          name="expirationDate"
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

export default CardCVC;
