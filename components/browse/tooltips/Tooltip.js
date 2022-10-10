import { useContext, useMemo } from "react";
import InteractionContext from "@/context/InteractionContext";
import TooltipWrapper from "@/components/browse/tooltips/TooltipWrapper";
import TooltipDialog from "@/components/browse/tooltips/TooltipDialog";

import { useElementRect } from "@/hooks/useElementRect";
import { useHover } from "@/hooks/useHover";

const Tooltip = (props) => {
  const { className, text, children } = props;
  const { tooltipsAreEnabled, previewModalStateById, isPreviewModalOpen } =
    useContext(InteractionContext);
  const [triggerRef, triggerRect, hovered] = useHover();
  const [tooltipRef, tooltipRect] = useElementRect({
    textChange: text,
    stateChange: hovered,
  });

  const style = useMemo(() => {
    let left =
        triggerRect.left +
        window.scrollX -
        tooltipRect.width / 2 +
        triggerRect.width / 2,
      topOffset = triggerRect.top + window.scrollY,
      top =
        Math.round(topOffset - (tooltipRect.height - triggerRect.height) / 2) -
        tooltipRect.height * 1.5;
    return hovered &&
      tooltipRect &&
      tooltipsAreEnabled() &&
      isPreviewModalOpen()
      ? {
          top: "".concat(top, "px"),
          left: "".concat(left, "px"),
          transformOrigin: "top center",
          zIndex: 9999999,
          opacity: 1,
        }
      : { opacity: 0 };
  }, [hovered, text, triggerRect, tooltipRect, previewModalStateById]);

  return (
    <TooltipWrapper as={"div"} ref={triggerRef} className={className}>
      {hovered && isPreviewModalOpen() && (
        <TooltipDialog
          ref={tooltipRef}
          className="tooltip flex items-center justify-center absolute whitespace-nowrap bg-gray-100 text-gray-900 text-[0.65rem] sm:text-[1.1rem] xl:text-[1.15rem] font-bold px-5 py-2 rounded pointer-events-none select-none shadow-lg"
          style={style}
        >
          <div className="caret absolute -bottom-[7px] bg-gray-100 w-5 h-5 rotate-45 -z-1" />
          {text}
        </TooltipDialog>
      )}
      {children}
    </TooltipWrapper>
  );
};

export default Tooltip;
