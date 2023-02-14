import Link, { LinkProps } from "next/link";
import { forwardRef, KeyboardEvent, MouseEvent, ReactNode } from "react";

import clsxm from "@/lib/clsxm";

export interface UnstyledLinkProps extends LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  openNewTab?: boolean;
  tabIndex?: number;
  onFocus?: () => void;
  onClick?: (
    e: MouseEvent<HTMLAnchorElement> | KeyboardEvent<HTMLAnchorElement>
  ) => void;
}

const UnstyledLink = forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  ({ children, className, href, openNewTab = false, ...restProps }, ref) => {
    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith("/") && !href.startsWith("#");
    // If the href is empty, return an empty fragment
    if (!href) return <></>;
    // If the href is not a new tab, return a Link component
    if (!isNewTab) {
      return (
        <Link ref={ref} href={href} className={className} {...restProps}>
          {children}
        </Link>
      );
    }
    // If the href is a new tab, return an anchor tag
    return (
      <Link
        ref={ref}
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        className={clsxm(className)}
        {...restProps}
      >
        {children}
      </Link>
    );
  }
);

export default UnstyledLink;
