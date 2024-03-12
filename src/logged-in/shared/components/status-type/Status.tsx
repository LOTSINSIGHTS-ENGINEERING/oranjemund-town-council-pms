import React from "react";

interface StatusProps {
  type: "red" | "green" | "blue" | "warning" | "archived" | string;
  value: string;
  hasMarginRight?: boolean;
}
const Status = (props: StatusProps) => {
  const { type, value, hasMarginRight = false } = props;

  return (
    <>
      {value && (
        <span
          className={`status ${type} ${
            hasMarginRight ? "uk-margin-small-right" : ""
          }`}
        >
          {value}
        </span>
      )}
    </>
  );
};

export default Status;
