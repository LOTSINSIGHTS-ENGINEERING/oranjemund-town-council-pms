import React, { Fragment, useEffect, useState } from "react";

interface IProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  outlined?: boolean;
}
const TextInput = (props: IProps) => {
  const defaultMinWidth = 7;
  const [isFocus, setisFocus] = useState(false);
  const [minWidth, setMinWidth] = useState(defaultMinWidth);
  const outlinedCss = props.outlined ? "auto-save__outlined" : "";

  const onFocus = () => {
    setisFocus(true);
  };

  const onBlur = () => {
    setisFocus(false);
    setMinWidth(defaultMinWidth);
  };

  useEffect(() => {
    if (!isFocus) return;
    const width = props.value.length < 20 ? props.value.length + 4 : 20;
    setMinWidth(width);
  }, [isFocus, props.value.length]);

  return (
    <Fragment>
      <input
        className={`auto-save__input ${outlinedCss} auto-save__text-input uk-input uk-form-small`}
        onFocus={onFocus}
        onBlur={onBlur}
        name={props.name}
        type="text"
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled || false}
        style={{ minWidth: `${minWidth}ch` }}
      />
    </Fragment>
  );
};

export default TextInput;
