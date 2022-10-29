const BasicInputLight = ({
  errors,
  touched,
  value,
  type,
  id,
  name,
  label,
  autoComplete = "none",
  tabIndex = 0,
  minLength = 1,
  maxLength = 100,
  handleChange,
  handleBlur,
}) => {
  return (
    <>
      <div className="flex h-16 w-full flex-col justify-start">
        <div className="auth-focus-input relative focus-within:border-transparent">
          <input
            aria-invalid={errors && touched && errors ? "true" : "false"}
            autoComplete={autoComplete}
            tabIndex={tabIndex}
            type={type}
            id={id}
            name={name}
            placeholder=" "
            maxLength={maxLength}
            minLength={minLength}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            className={`input-light block h-14 w-full appearance-none rounded-sm border border-gray-200 bg-white px-3 pt-6 text-base text-gray-800 focus:border-gray-300 focus:outline-none focus:ring-0 focus:ring-inset focus:ring-gray-300 ${
              errors && touched && errors ? "border-netflix-red" : ""
            }`}
          />
          <label
            htmlFor={name}
            className="pointer-events-none absolute top-0 bottom-0 flex h-14 origin-0 select-none items-center px-3 py-4 text-base font-medium text-gray-500 duration-200"
          >
            {label}
          </label>
          {errors && touched && errors && (
            <div className="input-error mt-1 px-1 text-xs font-medium text-netflix-red">
              {errors && touched && errors}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BasicInputLight;
