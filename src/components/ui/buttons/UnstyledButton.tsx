import { ButtonHTMLAttributes, ReactNode } from "react";

export interface UnstyledButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  type: "button" | "submit" | "reset";
  tabIndex?: number;
  onClick?: () => void;
}

const UnstyledButton = ({
  children,
  className,
  onClick,
  type,
  ...restProps
}: UnstyledButtonProps) => {
  return (
    <button type={type} className={className} onClick={onClick} {...restProps}>
      {children}
    </button>
  );
};

export default UnstyledButton;
