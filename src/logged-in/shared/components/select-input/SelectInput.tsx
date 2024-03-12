import React, { DetailedHTMLProps, OptionHTMLAttributes, useEffect, useState } from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";

type HTMLOptionProps = DetailedHTMLProps<
  OptionHTMLAttributes<HTMLOptionElement>,
  HTMLOptionElement
>;
interface IOptionProps extends HTMLOptionProps {
  value: string | number;
  children: JSX.Element[] | JSX.Element;
  setValue?: React.Dispatch<React.SetStateAction<string | number>>;
}
export const SelectInputOption = (props: IOptionProps) => {
  const { id, className, children, setValue, value } = props;

  const onSelect = () => {
    if (!setValue) return;
    setValue(value);
  };

  return (
    <div
      className={`select-input__dropdown-option ${className}`}
      id={id}
      onClick={onSelect}
    >
      {children}
    </div>
  );
};

interface ISelectInputProps {
  id?: string;
  className?: string;
  value: string | number;
  placeholder?: string;
  children: JSX.Element[] | JSX.Element;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
}
const SelectInput = (props: ISelectInputProps) => {
  const {
    // id,
    className,
    value,
    onChange,
    children,
    // required,
    // disabled,
  } = props;
  const [_value, _setValue] = useState<string | number>(value);
  const [isExpanded, setisExpanded] = useState(false);
  const isArray = Array.isArray(children);

  const toggleExpanded = () => {
    setisExpanded(!isExpanded);
  };

  useEffect(() => {
    if (onChange) onChange(_value);
  }, [_value]);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <div
      className={
        "select-input " +
        (isExpanded ? "select-input--expanded " : "select-input--hidden ") +
        className
      }
      onClick={toggleExpanded}
    >
      <div className="select-input__value">
        <p>{_value}</p>
        <div className="icon">
          <span className="icon__up">▲</span>
          <span className="icon__down">▼</span>
        </div>
      </div>

      <div
        className={
          "select-input__dropdown-option-list " +
          (isExpanded
            ? "select-input__dropdown-option-list--expanded"
            : "select-input__dropdown-option-list--hidden")
        }
      >
        <ErrorBoundary>
          {isArray &&
            children.map((child: JSX.Element, index) => {
              return (
                <ErrorBoundary key={index}>
                  {React.cloneElement(child, {
                    setValue: _setValue,
                  })}
                </ErrorBoundary>
              );
            })}
        </ErrorBoundary>

        <ErrorBoundary>
          {!isArray &&
            React.cloneElement(children, {
              setValue: _setValue,
            })}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default SelectInput;
