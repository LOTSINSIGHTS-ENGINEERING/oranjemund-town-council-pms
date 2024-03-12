import React from "react";
import ErrorBoundary from "../error-boundary/ErrorBoundary";

interface IProps {
  pos?:
    | "bottom-justify"
    | "bottom-left"
    | "bottom-right"
    | "top-justify"
    | "top-left"
    | "top-right";
  children: React.ReactNode;
}
const Dropdown = (props: IProps) => {
  const { pos = "bottom-justify", children } = props;

  return (
    <ErrorBoundary>
      <div
        className="kit-dropdown"
        data-uk-dropdown={`mode: hover; pos: ${pos}`}
      >
        <ul className="kit-dropdown-nav uk-nav uk-dropdown-nav">{children}</ul>
      </div>
    </ErrorBoundary>
  );
};

export default Dropdown;
