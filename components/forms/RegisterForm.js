import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import * as yup from "yup";
import InputLight from "@/components/fields/InputLight";

const validationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be 6 characters minimum")
    .required("Password is required"),
});

export const RegisterForm = (props) => {
  // Destructure the props
  const { loading, formData, setFormData, registrationStepTwo, strapiError } =
    props;
  return (
    <>
      {strapiError && (
        <>
          <div className="rounded-sm w-full bg-netflix-orange-light mt-2 mb-3 p-3">
            <h3 className="text-base font-semibold text-white leading-tight">
              {strapiError}
            </h3>
          </div>
        </>
      )}
      <Formik
        initialValues={formData}
        onSubmit={async (values) => {
          setFormData(values);
          registrationStepTwo(values);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className="w-full space-y-5 mt-2">
            {/* Email */}
            <InputLight
              autoComplete="email"
              type="email"
              id="email"
              name="email"
              maxLength="50"
              minLength="5"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.email}
              errors={errors.email}
              touched={touched.email}
              label="Email"
            />
            {/* Password */}
            <InputLight
              autoComplete="password"
              type="password"
              id="password"
              name="password"
              maxLength="62"
              minLength="6"
              handleChange={handleChange}
              handleBlur={handleBlur}
              value={values.password}
              errors={errors.password}
              touched={touched.password}
              label="Password"
            />
            {/* Submit button */}
            <div>
              {loading || isSubmitting ? (
                <button
                  disabled
                  type="submit"
                  className="w-full flex items-center justify-center mt-6 py-3 px-4 h-14 rounded-sm text-base font-semibold tracking-wide text-white bg-red-800 bg-opacity-80 focus:outline-none transition ease-out duration-700"
                >
                  Processing
                  <svg
                    className="motion-safe:animate-spin ml-2 -mr-1 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </button>
              ) : (
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full flex items-center justify-center mt-6 py-3 px-4 h-14 rounded-sm text-base font-semibold tracking-wide text-white bg-netflix-red hover:bg-netflix-red-light focus:outline-none transition ease-out duration-700"
                >
                  Continue
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

RegisterForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};
