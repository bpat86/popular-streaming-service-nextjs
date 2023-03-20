import { createContext, useState } from "react";

const InteractionContext = createContext();

export const InteractionProvider = ({ children }) => {
  const [watchModeEnabled, setWatchModeEnabled] = useState(false);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false);

  /**
   * Enable watch mode globally
   */
  const enableWatchMode = () => {
    setWatchModeEnabled(true);
  };

  /**
   * Disable watch mode globally
   */
  const disableWatchMode = () => {
    setWatchModeEnabled(false);
  };

  /**
   * Determine if watch mode is enabled
   * @returns {Boolean}
   */
  const isWatchModeEnabled = () => {
    return watchModeEnabled;
  };

  /**
   * Enable modal tooltips globally
   */
  const enableTooltips = () => {
    setTooltipsEnabled(true);
  };

  /**
   * Disable modal tooltips globally
   */
  const disableTooltips = () => {
    setTooltipsEnabled(false);
  };

  /**
   * Determine if tooltips are enabled
   */
  const tooltipsAreEnabled = () => {
    return tooltipsEnabled;
  };

  return (
    <InteractionContext.Provider
      value={{
        isWatchModeEnabled,
        enableWatchMode,
        disableWatchMode,
        enableTooltips,
        disableTooltips,
        tooltipsAreEnabled,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
};

export default InteractionContext;
