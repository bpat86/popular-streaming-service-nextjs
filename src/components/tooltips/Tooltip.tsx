import { MutableRefObject, ReactNode, useContext, useMemo } from "react";

import TooltipDialog from "@/components/tooltips/TooltipDialog";
import TooltipWrapper from "@/components/tooltips/TooltipWrapper";
import InteractionContext from "@/context/InteractionContext";
import { useElementRect } from "@/hooks/useElementRect";
import { useHover } from "@/hooks/useHover";
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import usePreviewModalStore from "@/store/PreviewModalStore";

type TooltipProps = {
  className?: string;
  text: string;
  children: ReactNode;
};

const Tooltip = ({ className, text, children }: TooltipProps) => {
  const { tooltipsAreEnabled } = useContext(InteractionContext);
  const [triggerRef, triggerRect, hovered] = useHover();
  const [tooltipRef, tooltipRect] = useElementRect({
    textChange: text,
    stateChange: hovered,
  });

  /**
   * Determine if a preview modal is currently open
   */
  function isPreviewModalOpen() {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return (
      previewModalStateById &&
      Object.values(previewModalStateById).some(({ isOpen }) => isOpen)
    );
  }

  const style = useMemo(() => {
    const rect = triggerRect as DOMRect;
    const left = rect.left + window.scrollX - rect.width / 2 + rect.width / 2,
      topOffset = rect.top + window.scrollY,
      top =
        Math.round(topOffset - (rect.height - rect.height) / 2) -
        rect.height * 1.5;
    return hovered &&
      tooltipRect &&
      tooltipsAreEnabled() &&
      isPreviewModalOpen()
      ? {
          top: "".concat(top.toString(), "px"),
          left: "".concat(left.toString(), "px"),
          transformOrigin: "top center",
          zIndex: 9999999,
          opacity: 1,
        }
      : { opacity: 0 };
  }, [hovered, triggerRect, tooltipRect, tooltipsAreEnabled]);

  return (
    <TooltipWrapper as="div" ref={triggerRef} className={className}>
      <AnimatePresenceWrapper>
        {hovered && isPreviewModalOpen() && (
          <TooltipDialog
            ref={tooltipRef as MutableRefObject<HTMLDivElement>}
            className="tooltip pointer-events-none absolute flex select-none items-center justify-center whitespace-nowrap rounded bg-zinc-100 px-5 py-2 text-[0.65rem] font-bold text-zinc-900 shadow-lg sm:text-[1.1rem] xl:text-[1.15rem]"
            style={style}
          >
            <div className="caret absolute -bottom-[7px] -z-1 h-5 w-5 rotate-45 bg-zinc-100" />
            {text}
          </TooltipDialog>
        )}
        {children}
      </AnimatePresenceWrapper>
    </TooltipWrapper>
  );
};

export default Tooltip;
