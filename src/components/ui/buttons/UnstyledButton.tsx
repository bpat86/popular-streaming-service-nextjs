import { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

export interface UnstyledButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  type: "button" | "submit" | "reset";
  tabIndex?: number;
  onClick?: (e: MouseEvent) => void;
}

const UnstyledButton = ({
  children,
  className,
  type,
  ...restProps
}: UnstyledButtonProps) => {
  return (
    <button type={type} className={className} {...restProps}>
      {children}
    </button>
  );
};

export default UnstyledButton;
