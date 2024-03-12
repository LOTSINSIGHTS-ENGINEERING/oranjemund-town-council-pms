import writeXlsxFile from "write-excel-file";
import { IScorecardMetadata } from "../../../shared/models/ScorecardMetadata";

interface ITableRowItem {
  employeeName: string; // "Name",
  department: string; // "Department",
  position: string; // "position",
  supervisor: string; // "Supervisor",
  scorecard: string; // "Scorecard",
  quarter1Review: string; // "Q1 Review",
  quarter2Review: string; // "Midterm Review",
  quarter3Review: string; // "Q3 Review",
  quarter4Review: string; // "Assessment (Review)",
}

const PERFORMANCE_HEADER_ROW: any = [
  {
    value: "Employee Name",
    fontWeight: "bold",
    backgroundColor: "#F4B084",
  },
  {
    value: "Department",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Position",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Supervisor",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Scorecard",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Quarter 2 Review",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Midterm Review",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Quarter 3 Review",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Final Assessment",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
];

const PEFORMANCE_STATUS_COLUMNS = [
  { width: 40 }, // Name
  { width: 40 }, // Dapartment
  { width: 40 }, // Supervisor
  { width: 15 }, // Scorecard
  { width: 15 }, // Q2 Review
  { width: 15 }, // Midterm Review
  { width: 15 }, // Q3 Review
  { width: 15 }, // Final Assessment
];

const TableExcelDefinition = (
  scorecards: IScorecardMetadata[]
): ITableRowItem[] => {
  const tableRows: ITableRowItem[] = scorecards.map((scorecard) => {
    const row: ITableRowItem = {
      employeeName: scorecard.displayName,
      department: scorecard.departmentName,
      position: scorecard.jobTitle,
      supervisor: scorecard.supervisorName,
      scorecard: scorecard.agreementDraft.status, // "Scorecard",
      quarter1Review: scorecard.quarter1Review.status, // "Q1 Review",
      quarter2Review: scorecard.quarter2Review.status, // "Midterm Review",
      quarter3Review: scorecard.quarter3Review.status, // "Q3 Review",
      quarter4Review: scorecard.quarter4Review.status, // "Assessment (Review)",
    };

    return row;
  });

  const sortRows = (a: ITableRowItem, b: ITableRowItem) =>
    a.employeeName.localeCompare(b.employeeName);
  return tableRows.sort(sortRows);
};

type FormatColumnParams = {
  value: string | null;
  type?:
    | string
    | "String"
    | "Currency"
    | "Number"
    | "Percentage"
    | "Date"
    | "Time";
  symbol?: string;
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  fontWeight?: "bold";
  rowSpan?: number;
};
const formatColumn = ({
  value,
  backgroundColor,
  borderColor = "#DFDFDF",
  color = "#000000",
  rowSpan,
  fontWeight,
}: FormatColumnParams) => {
  const capitalize = (s: any) =>
    (s && s[0].toUpperCase() + s.slice(1)) || " - ";

  return {
    type: String,
    value: capitalize(value),
    wrap: true,
    alignVertical: "top",
    backgroundColor: backgroundColor,
    color,
    borderColor,
    fontWeight,
    rowSpan,
  };
};

export const exportPerformanceStatusOverview = async (
  title: string,
  scorecards: IScorecardMetadata[]
) => {
  // Get the rows
  const rows = TableExcelDefinition(scorecards);

  const statusColor = (status: string) => {
    switch (status) {
      case "approved":
        return {
          bg: "#F3FCF2",
          text: "#2AA820",
        };

      case "submitted":
        return {
          bg: "#E4EEFD",
          text: "#2F80ED",
        };

      case "pending":
        return {
          bg: "#FDEAEC",
          text: "#DC3545",
        };

      case "cancelled":
        return {
          bg: "#FDEAEC",
          text: "#DC3545",
        };

      default:
        return {
          bg: "#FDEAEC",
          text: "#DC3545",
        };
    }
  };

  const dataRows = rows.map((row) => {
    return [
      formatColumn({
        value: row.employeeName,
      }), // EmployeeName

      formatColumn({
        value: row.department,
      }), // Department
      formatColumn({
        value: row.position,
      }), // position

      formatColumn({
        value: row.supervisor,
      }), // Supervisor

      formatColumn({
        value: row.scorecard,
        backgroundColor: statusColor(row.scorecard).bg,
        color: statusColor(row.scorecard).text,
        fontWeight: "bold",
      }), // Scorecard

      formatColumn({
        value: "-",
      }), // Q1 Review

      formatColumn({
        value: row.quarter2Review,
        backgroundColor: statusColor(row.quarter2Review).bg,
        color: statusColor(row.quarter2Review).text,
        fontWeight: "bold",
      }), // Q2 Review

      formatColumn({
        value: "-",
      }), // Q3 Review

      formatColumn({
        value: row.quarter4Review,
        backgroundColor: statusColor(row.quarter4Review).bg,
        color: statusColor(row.quarter4Review).text,
        fontWeight: "bold",
      }), // Q4 Review
    ];
  });

  const data = [PERFORMANCE_HEADER_ROW, ...dataRows];

  await writeXlsxFile(data, {
    columns: PEFORMANCE_STATUS_COLUMNS, // (optional) column widths, etc.
    fileName: `${title}.xlsx`,
    sheet: "Data",
    fontFamily: "Candara",
    fontSize: 12,
  });
};
