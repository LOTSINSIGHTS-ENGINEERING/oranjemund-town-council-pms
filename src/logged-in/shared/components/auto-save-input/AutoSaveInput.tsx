import React, { Fragment, useEffect, useState } from "react";
import TextInput from "./TextInput";
import "./AutoSaveInput.scss";

/**
 * This is a component to be used in the AutoSaveInput component.
 * It is used to display the value of the input in the form of a
 * text field. on hover, will display an active text field.
 * On click / on focus, show active text field. Default, show inactive text field.
 *
 * Accepted types: Date, Number, Text,
 *
 * @param {string} value - The value of the input.
 * @param {string} placeholder - The placeholder of the input.
 * @param {string} className - The class name of the input.
 * @param {string} id - The id of the input.
 * @param {string} name - The name of the input.
 * @param {string} type - The type of the input.
 * @param {string} onChange - The onChange event of the input.
 * @param {string} onBlur - The onBlur event of the input.
 * @param {string} onFocus - The onFocus event of the input.
 * @returns {JSX.Element}
 */

interface IProps {
  name: string;
  value: string;
  onChange: (
    type: "Date" | "Text" | "Number"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: "Date" | "Number" | "Text";
  disabled?: boolean;
  outlined?: boolean;
}
const AutoSaveInput = (props: IProps) => {
  const { value } = props;

  const [currentValue, setCurrentValue] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
    props.onChange(props.type)(e);
  };

  useEffect(() => {
    setCurrentValue(`${value || 0}`);
  }, [value]);

  return (
    <Fragment>
      {(props.type === "Text" || props.type === "Number") && (
        <TextInput
          name={props.name}
          value={currentValue}
          onChange={onChange}
          disabled={props.disabled}
          outlined={props.outlined}
        />
      )}
    </Fragment>
  );
};

export default AutoSaveInput;
