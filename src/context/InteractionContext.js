import { createContext, useState } from "react";

const InteractionContext = createContext();

export const InteractionProvider = ({ children }) => {
  // State
  const [watchModeEnabled, setWatchModeEnabled] = useState(false);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  /**
   * Enable audio globally
   */
  const enableAudio = () => {
    setAudioEnabled(true);
  };

  /**
   * Disable audio globally
   */
  const disableAudio = () => {
    setAudioEnabled(false);
  };

  /**
   * Return if audio is enabled globally
   * @returns {Boolean}
   */
  const audioIsEnabled = () => {
    return audioEnabled;
  };

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
        enableAudio,
        disableAudio,
        audioIsEnabled,
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
