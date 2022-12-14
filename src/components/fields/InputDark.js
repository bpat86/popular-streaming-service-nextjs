const InputDark = ({
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
  className,
  handleChange,
  handleBlur,
}) => {
  return (
    <>
      <div className="flex h-18 w-full flex-col justify-start">
        <div className="focus-input relative focus-within:border-transparent">
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
            className={`input-dark block h-14 w-full appearance-none rounded-sm border-0 border-transparent bg-gray-700 px-3 pt-6 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-700 ${
              errors && touched && errors
                ? "border-b-2 border-netflix-orange focus:border-netflix-orange"
                : ""
            } ${className ? className : ""}`}
          />
          <label
            htmlFor={name}
            className="pointer-events-none absolute top-0 bottom-0 flex h-14 origin-0 select-none items-center px-3 py-4 text-base font-medium text-gray-400 duration-200"
          >
            {label}
          </label>
          {errors && touched && errors && (
            <div className="input-error mt-1 px-1 text-xs font-medium text-netflix-orange">
              {errors && touched && errors}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InputDark;
