import React from "react";

const CombineContexts = (props) => {
  const { contextProviders = [], children } = props;

  return (
    <>
      {contextProviders.reduceRight((accumulator, CurrentProvider) => {
        return <CurrentProvider>{accumulator}</CurrentProvider>;
      }, children)}
    </>
  );
};

export default CombineContexts;
