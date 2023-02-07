import Link from "next/link";
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  ReactNode,
  useRef,
} from "react";

type TitleCardLinkProps = {
  children: ReactNode;
  className?: string;
  itemTabbable?: boolean;
  onClick: (
    e: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>,
    ref: MutableRefObject<HTMLAnchorElement>
  ) => void;
  onFocus: (e: FocusEvent<HTMLAnchorElement>) => void;
  watchURL: string;
};

const TitleCardLink = ({
  children,
  className = "",
  itemTabbable,
  onClick,
  watchURL,
  onFocus,
}: TitleCardLinkProps) => {
  const watchLinkAnchorRef = useRef<HTMLAnchorElement | null>(null);
  return (
    <Link
      ref={watchLinkAnchorRef}
      className={className}
      tabIndex={itemTabbable ? 0 : -1}
      aria-hidden={itemTabbable ? false : true}
      onClick={(e) =>
        onClick(e, watchLinkAnchorRef as MutableRefObject<HTMLAnchorElement>)
      }
      onFocus={onFocus}
      href={watchURL}
    >
      {children}
    </Link>
  );
};

export default TitleCardLink;
