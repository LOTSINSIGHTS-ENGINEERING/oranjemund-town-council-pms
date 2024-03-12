import Select, { SingleValue } from "react-select";
import ErrorBoundary from "../error-boundary/ErrorBoundary";

export interface IOption {
  value: string;
  label: string;
  color?: string;
  isDisabled?: boolean;
}

export interface IGroupedOption {
  label: string;
  options: IOption[];
}

interface IProps {
  readonly isClearable?: boolean;
  readonly isLoading?: boolean;
  readonly isSearchable?: boolean;
  options: IOption[];
  groupedOptions?: IGroupedOption[];
  width?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  hideSelectedOptions?: boolean;
  valueOption?: IOption;
  onChange: (value: string) => void;
}
const SingleSelect = (props: IProps) => {
  const {
    isClearable = true,
    isLoading = false,
    isSearchable = true,
    required = false,
    hideSelectedOptions = false,
    options,
    groupedOptions,
    width = "100%",
    name = "",
    placeholder = "Search...",
    value,
    onChange,
  } = props;

  const SingleSelect = (props: IProps) => {
    const {
      isClearable = true,
      isLoading = false,
      isSearchable = true,
      required = false,
      hideSelectedOptions = false,
    } = props;

    const { options }: { options: IOption[] } = props;

    // Rest of the component logic
  };



  const formatGroupLabel = (data: IGroupedOption) => (
    <div className="grouped-label">
      <span>{data.label}</span>
      <span className="grouped-badge">{data.options.length}</span>
    </div>
  );

  const getValue = () => {
    if (!value) return;
    return options.find((option) => option.value === value);
  };

  const handleChange = (current: SingleValue<IOption>, actionMeta: any) => {
    if (!current && actionMeta && actionMeta.action === "clear") onChange("");
    if (current) onChange(current.value); // TODO: remove on if-onChange
  };

  if (groupedOptions)
    return (
      <ErrorBoundary>
        <div
          style={{
            width,
          }}
        >
          <ErrorBoundary>
            <Select<IOption, false, IGroupedOption>
              className="single-select"
              classNamePrefix="select"
              isLoading={isLoading}
              isClearable={isClearable}
              isSearchable={isSearchable}
              defaultValue={options[1]}
              onChange={handleChange}
              value={getValue()}
              name={name}
              options={groupedOptions}
              formatGroupLabel={formatGroupLabel}
              placeholder={placeholder}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <div id="hidden-input">
              <input
                id={`single-select-${name}`}
                defaultValue={value}
                type="text"
                required={required}
              />
            </div>
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div
        style={{
          width,
        }}
      >
        <ErrorBoundary>
          <Select
            className="single-select"
            classNamePrefix="select"
            isLoading={isLoading}
            isClearable={isClearable}
            isSearchable={isSearchable}
            hideSelectedOptions={hideSelectedOptions}
            onChange={handleChange}
            value={getValue()}
            name={name}
            options={options}
            placeholder={placeholder}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <div id="hidden-input">
            <input
              id={`single-select-${name}`}
              defaultValue={value}
              type="text"
              required={required}
            />
          </div>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default SingleSelect;
