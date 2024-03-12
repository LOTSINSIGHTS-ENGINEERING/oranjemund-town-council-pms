import { useState } from "react";

/**
 * This filter was developed by NAFTAL NGESHEYA for LEGION BUSINESS OPERARATIONS CONSULTING AND TECHNOLOGIOES.
 * This is version 1.0 of the Filter.
 * The filter offers advanced filter capabitilies similar to those found in excel
 * Copyrights reserved
 */

type FiltersTypes = {
  //strings
  stringValueA: string;
  stringValueB: string;
  stringValueC: string;
  stringValueD: string;
  stringValueE: string;

  //min-max
  minValueA: number | null;
  minValueB: number | null;
  minValueC: number | null;
  minValueD: number | null;
  minValueE: number | null;

  maxValueA: number | null;
  maxValueB: number | null;
  maxValueC: number | null;
  maxValueD: number | null;
  maxValueE: number | null;

  //check selectors
  checkedOptionsFilter: string[];
  checkedOptionsA: string[];
  checkedOptionsB: string[];
  checkedOptionsC: string[];
  checkedOptionsD: string[];
  checkedOptionsE: string[];

  fromDateFilterA: string;
  fromDateFilterB: string;
  fromDateFilterC: string;
  fromDateFilterD: string;
  fromDateFilterE: string;

  toDateFilterA: string;
  toDateFilterB: string;
  toDateFilterC: string;
  toDateFilterD: string;
  toDateFilterE: string;

  //toggle selector
  checkedFilterA: boolean;
  checkedFilterB: boolean;
  checkedFilterC: boolean;
  checkedFilterD: boolean;
  checkedFilterE: boolean;
};

export const useExcelLikeFilters = () => {
  const stringOptions = [
    { value: "contains", label: "Contains" },
    { value: "starts with", label: "Starts with" },
    { value: "ends with", label: "Ends with" },
  ];

  const numberOptions = [
    { value: "equal to", label: "Equal to" },
    { value: "greater than", label: "Greater Than" },
    { value: "less than", label: "Less Than" },
  ];

  const initialFilters: FiltersTypes = {
    //strings
    stringValueA: "",
    stringValueB: "",
    stringValueC: "",
    stringValueD: "",
    stringValueE: "",

    //min-max
    minValueA: null,
    minValueB: null,
    minValueC: null,
    minValueD: null,
    minValueE: null,

    maxValueA: null,
    maxValueB: null,
    maxValueC: null,
    maxValueD: null,
    maxValueE: null,

    //check selectors
    checkedOptionsFilter: [""],
    checkedOptionsA: [""],
    checkedOptionsB: [""],
    checkedOptionsC: [""],
    checkedOptionsD: [""],
    checkedOptionsE: [""],

    fromDateFilterA: "",
    fromDateFilterB: "",
    fromDateFilterC: "",
    fromDateFilterD: "",
    fromDateFilterE: "",

    toDateFilterA: "",
    toDateFilterB: "",
    toDateFilterC: "",
    toDateFilterD: "",
    toDateFilterE: "",

    //toggle selector
    checkedFilterA: false,
    checkedFilterB: false,
    checkedFilterC: false,
    checkedFilterD: false,
    checkedFilterE: false,
  };
  const [filters, setFilters] = useState<FiltersTypes>(initialFilters);

  const [sort, setSort] = useState({ column: "", direction: "" });
  const [sortDirection, setSortDirection] = useState("");

  const handleSort = (column: string) => {
    if (sort.column === column) {
      setSort({
        column,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
      setSortDirection(sort.direction === "asc" ? "desc" : "asc");
    } else {
      setSort({ column, direction: "asc" });
      setSortDirection("asc");
    }
  };

  const handleCheckedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, checkedFilterA: e.target.checked });
  };

  const handleCheckedOptionsChange = (field: string) => {
    let checkedOptionsFilter = [...filters.checkedOptionsA];
    if (checkedOptionsFilter.includes(field)) {
      checkedOptionsFilter = checkedOptionsFilter.filter(
        (checkedOption) => checkedOption !== field
      );
    } else {
      checkedOptionsFilter.push(field);
    }
    setFilters({ ...filters, checkedOptionsFilter });
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleFilterChange = (
    filterName: string,
    value: string | number | boolean | undefined
  ) => {
    setFilters({ ...filters, [filterName]: value });
  };

  return {
    initialFilters,
    filters,
    sort,
    sortDirection,
    stringOptions,
    numberOptions,
    handleSort,
    handleCheckedChange,
    handleCheckedOptionsChange,
    handleClearFilters,
    handleFilterChange,
  };
};
