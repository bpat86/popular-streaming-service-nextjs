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
      <div className="flex flex-col justify-start w-full h-18">
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
            className={`input-dark block w-full h-14 px-3 pt-6 appearance-none bg-gray-700 border-0 border-transparent focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-inset text-base rounded-sm ${
              errors && touched && errors
                ? "border-b-2 border-netflix-orange focus:border-netflix-orange"
                : ""
            } ${className ? className : ""}`}
          />
          <label
            htmlFor={name}
            className="flex text-base font-medium text-gray-400 items-center absolute top-0 bottom-0 px-3 py-4 h-14 duration-200 origin-0 select-none pointer-events-none"
          >
            {label}
          </label>
          {errors && touched && errors && (
            <div className="input-error text-netflix-orange text-xs font-medium mt-1 px-1">
              {errors && touched && errors}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InputDark;
