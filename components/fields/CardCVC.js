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
        className={`w-full h-14 px-3 py-5 bg-white border border-gray-200 focus:border-gray-300 focus:outline-none focus:ring-0 focus:ring-gray-300 focus:ring-inset sm:text-base text-gray-800 rounded-sm ${
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
          <div className="input-error text-netflix-red text-sm mt-1 px-1">
            {(errors.cardNumber && touched.cardNumber && errors.cardNumber) ||
              stripeError.toString()}
          </div>
        )}
      </div>
    </>
  );
};

export default CardCVC;
