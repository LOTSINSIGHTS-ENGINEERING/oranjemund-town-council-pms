import { dateFormat } from "../../logged-in/shared/utils/utils";

export const dataFormat = (
  dataType:
    | string
    | "Date"
    | "Percentage"
    | "Number"
    | "Currency"
    | "Time"
    | "Custom",
  value: number | null | string,
  dataSymbol: string,
  symbolPos?: "prefix" | "suffix"
) => {
  if ((!value || value === undefined) && value !== 0) return "-";

  switch (dataType) {
    case "Date":
      return dateFormat(value);
    case "Percentage":
      return `${value}%`;
    case "Number":
      return numberFormat(Number(value));
    case "Currency":
      const val = currencyFormat(value, dataSymbol);
      return `${val}`;
    case "Time":
      return `${value} ${dataSymbol}`;
    case "Custom":
      return `${value} (${dataSymbol})`;
    default:
      return `${value} ${dataSymbol}`;
  }
};

export const currencyFormat = (
  value: number | null | string,
  currency = "NAD"
) => {
  // if is not a number, or undefine, return empty string
  if (value === null || value === undefined) return "-";
  const numValue = Number(value);
  if (isNaN(numValue)) return "-";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NAD",
    }).format(numValue);
  } catch (error) {
    console.log("Catch error", error);
    return `${currency} ${value}`;
  }
};

export const numberFormat = (value: number) => {
  if (value === 0) return "0";
  // if is not a number, or undefine, return empty string
  if (!value || isNaN(value)) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "decimal",
  }).format(value);
};
