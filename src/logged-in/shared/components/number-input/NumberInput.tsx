import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";

export const NumberInputValue = (value: any) => {
  // check if value is a string, return null
  if (typeof value === "string") return null;
  // check if value is a number, return number
  if (typeof value === "number") return value;

  // else return number
  return Number(value);
};

interface INumberInputProps {
  id?: string;
  className?: string;
  placeholder?: string;
  value: string | number | null;
  onChange: (value: string | number) => void;
  max?: number;
  min?: number;
  required?: boolean;
  disabled?: boolean;
}
const NumberInput = (props: INumberInputProps) => {
  const {
    id,
    className,
    value,
    max,
    min,
    placeholder,
    required,
    disabled,
    onChange,
  } = props;

  const [_value, _setValue] = useState<string | number | null>("");
  const [_nan, _setNaN] = useState(false);

  const _className = _nan ? `${className} uk-form-danger` : `${className}`;

  /**
   * Returns the value of the input
   */
  const handleChange = (e: any) => {
    const val = e.floatValue;

    const nan = isNaN(val) && required === true;
    _setNaN(nan);

    if (val !== undefined) {
      if (max && val > max) {
        _setValue(max);
        onChange(max);
      } else if (min && val < min) {
        _setValue(min);
        onChange(min);
      } else {
        _setValue(val);
        onChange(val);
      }
    } else {
      _setValue("");
      onChange("");
    }
  };

  useEffect(() => {
    if (value !== null && value !== undefined) _setValue(value);
    else _setValue("");
  }, [value]);

  return (
    <ErrorBoundary>
      <div className="number-input">
        <NumericFormat
          id={id}
          className={_className}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          thousandsGroupStyle="thousand"
          displayType="input"
          decimalSeparator="."
          type="text"
          value={_value}
          onValueChange={handleChange}
          thousandSeparator
          allowNegative
          min={min}
          max={max}
        />
        {_nan && (
          <span className="input-error">
            <span data-uk-icon="icon: info; ratio: .5"></span> Must be a number
          </span>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default NumberInput;
