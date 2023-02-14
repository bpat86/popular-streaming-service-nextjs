import UnstyledButton, {
  UnstyledButtonProps,
} from "@/components/ui/buttons/UnstyledButton";

interface ButtonFactoryProps extends UnstyledButtonProps {
  showTooltip?: boolean;
}

const ButtonFactory = ({ children, showTooltip, type }: ButtonFactoryProps) => {
  if (showTooltip) {
    return <></>;
  }

  return <UnstyledButton type={type}>{children}</UnstyledButton>;
};

export default ButtonFactory;
