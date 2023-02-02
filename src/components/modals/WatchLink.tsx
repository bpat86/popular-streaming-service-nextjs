import Link from "next/link";
import { MouseEvent, ReactNode } from "react";

type WatchLinkProps = {
  children: ReactNode;
  className?: string;
  href: {
    pathname: string;
    query: {
      mediaId: string;
    };
  };
  onClick?: (e: MouseEvent<Element>) => void;
  tabIndex?: number;
};

export const WatchLink = ({
  children,
  className,
  href,
  onClick,
  tabIndex,
}: WatchLinkProps) => {
  return (
    <Link href={href} legacyBehavior={true} prefetch={false}>
      <a
        className={className}
        onClick={onClick}
        tabIndex={tabIndex}
        role="link"
      >
        {children}
      </a>
    </Link>
  );
};
