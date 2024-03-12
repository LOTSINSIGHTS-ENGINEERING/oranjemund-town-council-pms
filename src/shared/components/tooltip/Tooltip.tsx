import React, { Fragment } from "react";
import ReactTooltip from "@reach/tooltip";

interface IProps {
  label: string;
  children: React.ReactNode;
}
const Tooltip = (props: IProps) => {
  return (
    <ReactTooltip label={props.label} className="react-tooltip">
      <button>ToolTop</button>
    </ReactTooltip>
  );
};

export default Tooltip;
