const InputDark = ({
  strapiError,
  errors,
  touched,
  value,
  type,
  id,
  name,
  autoComplete = "none",
  tabIndex = 0,
  minLength = 1,
  maxLength = 24,
  placeholder,
  className,
  handleChange,
  handleBlur,
}) => {
  return (
    <>
      <div className="flex flex-col justify-start w-full h-12 sm:h-14 mt-2">
        <div className="profile-input relative focus-within:border-transparent">
          <input
            aria-invalid={
              (errors && touched && errors) || strapiError ? "true" : "false"
            }
            autoComplete={autoComplete}
            tabIndex={tabIndex}
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            className="input-profile block w-full h-10 sm:h-12 px-3 appearance-none bg-gray-500 focus:outline-none border-0 focus:ring-2 focus:ring-gray-500 focus:ring-inset text-lg sm:text-xl tracking-wider rounded-sm placeholder-gray-300"
          />
          {errors && touched && errors && (
            <div className="input-error text-netflix-red-light text-sm font-medium text-left mt-1 px-1">
              {errors && touched && errors}
            </div>
          )}
          {strapiError && (
            <div className="input-error text-netflix-red-light text-sm font-medium text-left mt-1 px-1">
              {strapiError}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InputDark;
