import writeXlsxFile from "write-excel-file";
import { dataFormat } from "../../../shared/functions/Directives";
import { IEmployeeTableRowItem } from "../../../shared/functions/scorecard-pdf/IndividualPerformanceAgreementDocument";
import { fullPerspectiveName } from "../../../shared/interfaces/IPerspectiveTabs";
import { IMeasure } from "../../../shared/models/Measure";
import { IObjective } from "../../../shared/models/Objective";

const EMPLOYEE_HEADER_ROW: any = [
  {
    value: "Perspectives",
    fontWeight: "bold",
    backgroundColor: "#F4B084",
  },
  {
    value: "Contributory Departmental Objective",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Individual Scorecard Contribution",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Weight",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Measures/KPI",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Baseline",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Annual Target",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Rating Scale 1-5",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Key Initiatives",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Target Date",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Source of Evidence",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Comments",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
];

const SCORECARD_COLUMNS = [
  { width: 10 }, // Perspectives
  { width: 40 }, // Objectives
  { width: 40 }, // Contributory Objectives
  { width: 10 }, // Weight
  { width: 25 }, // Measures/KPI
  { width: 15 }, // Baseline
  { width: 15 }, // Annual Target
  { width: 15 }, // Rating Scale 1-5
  { width: 40 }, // Key Initiatives
  { width: 15 }, // Target Date
  { width: 25 }, // Source of Evidence
  { width: 40 }, // Comments
];

const EmployeeExcelDefinition = (
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
): IEmployeeTableRowItem[] => {
  const tableRows: IEmployeeTableRowItem[] = measures.map((m) => {
    // get contributory objective
    const contributory = contributoryObjectives.find(
      (o) => o.id === m.objective
    );

    // get strategic objective
    const strategic = objectives.find((s) => {
      if (!contributory) return false;
      return s.id === contributory.parent;
    });

    const ratingScale = () => {
      const r1 = m.rating1
        ? `1 = ${dataFormat(m.dataType, m.rating1, m.dataSymbol)}`
        : "";
      const r2 = m.rating2
        ? `2 = ${dataFormat(m.dataType, m.rating2, m.dataSymbol)}`
        : "";
      const r3 = m.rating3
        ? `3 = ${dataFormat(m.dataType, m.rating3, m.dataSymbol)}`
        : "";
      const r4 = m.rating4
        ? `4 = ${dataFormat(m.dataType, m.rating4, m.dataSymbol)}`
        : "";
      const r5 = m.rating5
        ? `5 = ${dataFormat(m.dataType, m.rating5, m.dataSymbol)}`
        : "";

      const scale = `${r1}\n${r2}\n${r3}\n${r4}\n${r5}`;
      return scale;
    };

    const row: IEmployeeTableRowItem = {
      perspective: fullPerspectiveName(
        contributory ? contributory.perspective : ""
      ),
      strategicObjective: strategic ? strategic.description : "unknown",
      contributoryObjective: contributory ? contributory.description : "unkown",
      weight: contributory ? contributory.weight || 0 : 0,
      measure: m ? m.description : "unknown",
      baseline: m ? m.baseline || 0 : "",
      annualTarget: m ? m.annualTarget || 0 : "",
      ratingScale: ratingScale(),
      keyInitiatives: m ? m.activities || "-" : "unkown",
      targetDate: m ? m.targetDate : "",
      sourceOfEvidence: m ? m.sourceOfEvidence || "-" : "unknown",
      comments: m ? m.comments : "",
      dataType: m.dataType,
      dataSymbol: m.dataSymbol,
    };

    return row;
  });

  const sortByPerspective = (
    a: IEmployeeTableRowItem,
    b: IEmployeeTableRowItem
  ) => {
    const order = ["F", "C", "I", "L"];
    const aIndex = order.indexOf(a.perspective.charAt(0));
    const bIndex = order.indexOf(b.perspective.charAt(0));
    return (
      aIndex - bIndex ||
      a.strategicObjective.localeCompare(b.strategicObjective) ||
      a.contributoryObjective.localeCompare(b.contributoryObjective)
    );
  };
  return tableRows.sort(sortByPerspective);
};

type FormatColumnParams = {
  value: any;
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
  rowSpan?: number;
};
const formatColumn = ({
  value,
  type = "String",
  backgroundColor,
  symbol = "",
  rowSpan,
}: FormatColumnParams) => {
  switch (type) {
    case "Currency":
      return {
        type: Number,
        format: "#,##0.00",
        value: Number(value) || null,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Number":
      return {
        type: Number,
        format: "#,##0",
        value: Number(value) || null,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Percentage":
      return {
        type: Number,
        format: "0.0%",
        value: Number(value) / 100 || null,
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Date":
      if (!value) {
        return {
          type: String,
          value: value.toString() || " - ",
          wrap: true,
          alignVertical: "top",
          backgroundColor: backgroundColor,
          borderColor: "#55555",
          rowSpan: rowSpan,
        };
      }
      return {
        type: Date,
        value: new Date(value) || null,
        format: "d mmmm yyyy",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Time":
      return {
        type: String,
        value: value.toString() || " - ",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    case "Custom":
      return {
        type: Number,
        value: value || " - ",
        format: "#,##0" + symbol,
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };

    default:
      return {
        type: String,
        value: value.toString() || " - ",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };
  }
};

export const exportEmployeeScorecardExcel = async (
  title: string,
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasure[]
) => {
  // Get the rows
  const rows = EmployeeExcelDefinition(
    objectives,
    contributoryObjectives,
    measures
  );

  let perspective = "";
  let objective = "";
  let cObjective = "";

  const dataRows = rows.map((row, _, data) => {
    let perspectiveRowSpan = undefined;
    let objectiveRowSpan = undefined;
    let cObjectiveRowSpan = undefined;

    if (perspective !== row.perspective) {
      perspective = row.perspective;
      perspectiveRowSpan = data.filter(
        (d) => d.perspective === perspective && d.perspective == null
      ).length;
    }

    if (objective !== row.strategicObjective) {
      objective = row.strategicObjective;
      objectiveRowSpan = data.filter(
        (d) =>
          d.strategicObjective === objective && d.strategicObjective == null
      ).length;
    }

    if (cObjective !== row.contributoryObjective) {
      cObjective = row.contributoryObjective;
      cObjectiveRowSpan = data.filter(
        (d) =>
          d.contributoryObjective === cObjective &&
          d.contributoryObjective == null
      ).length;
    }

    // if (perspective !== row.perspective) {
    //   perspective = row.perspective;
    //   perspectiveRowSpan = data.filter(
    //     (r) => r.perspective === perspective
    //   ).length;
    // }
    // if (objective !== row.strategicObjective) {
    //   objective = row.strategicObjective;
    //   objectiveRowSpan = data.filter(
    //     (r) => r.strategicObjective === objective
    //   ).length;
    // }
    // if (cObjective !== row.contributoryObjective) {
    //   cObjective = row.contributoryObjective;
    //   cObjectiveRowSpan = data.filter(
    //     (r) => r.contributoryObjective === cObjective
    //   ).length;
    // }

    return [
      formatColumn({
        value: perspectiveRowSpan !== 0 ? row.perspective : "",
        backgroundColor: "#F4B084",
        // rowSpan: perspectiveRowSpan || 1,
        // perspectiveRowSpan,
      }), // Perspectives
      formatColumn({
        value: objectiveRowSpan !== 0 ? row.strategicObjective : "",
        // rowSpan: objectiveRowSpan || 1,
      }), // Objectives
      formatColumn({
        value: cObjectiveRowSpan !== 0 ? row.contributoryObjective : "",
        // rowSpan: cObjectiveRowSpan != 0 ? cObjectiveRowSpan : 1,
      }), // Objectives
      formatColumn({
        value: cObjectiveRowSpan !== 0 ? row.weight : null,
        // rowSpan: cObjectiveRowSpan || 1,
        type: "Number",
      }), // Weight
      formatColumn({ value: row.measure }), // Measures/KPI
      formatColumn({
        value: row.baseline,
        type: row.dataType, //if general, the number dates are not converted to date TO DO:
        symbol: row.dataSymbol,
      }), // Baseline //if general, the number dates are not converted to date TO DO:
      formatColumn({
        value: row.annualTarget,
        type: row.dataType,
        symbol: row.dataSymbol,
      }), // Annual Target
      formatColumn({ value: row.ratingScale }), // Rating scale 1-5
      formatColumn({ value: row.keyInitiatives }), // Key Initiatives
      formatColumn({ value: row.targetDate, type: "Date" }), // Target Date
      formatColumn({ value: row.sourceOfEvidence }), // Source of evidence
      formatColumn({ value: row.comments }), // Comments
    ];
  });

  const data = [EMPLOYEE_HEADER_ROW, ...dataRows];

  await writeXlsxFile(data, {
    columns: SCORECARD_COLUMNS, // (optional) column widths, etc.
    fileName: `${title}.xlsx`,
    sheet: "Data",
    fontFamily: "Candara",
    fontSize: 12,
  });
};

// if (perspective !== row.perspective) {
//   perspective = row.perspective;
//   perspectiveRowSpan = data.filter(
//     (r) => r.perspective === perspective
//   ).length;
// }

// if (objective !== row.strategicObjective) {
//   objective = row.strategicObjective;
//   objectiveRowSpan = data.filter(
//     (r) => r.strategicObjective === objective
//   ).length;
// }

// if (cObjective !== row.contributoryObjective) {
//   cObjective = row.contributoryObjective;
//   cObjectiveRowSpan = data.filter(
//     (r) => r.contributoryObjective === cObjective
//   ).length;
// }
// formatColumn({
//   value: row.perspective,
//   backgroundColor: "#F4B084",
//   rowSpan: perspectiveRowSpan,
// }), // Perspectives
// formatColumn({
//   value: row.strategicObjective,
//   rowSpan: objectiveRowSpan,
// }), // Objectives
// formatColumn({
//   value: row.contributoryObjective,
//   rowSpan: cObjectiveRowSpan,
// }), // Contributory Objectives
// formatColumn({
//   value: row.weight,
//   type: "General",
//   rowSpan: cObjectiveRowSpan,
// }), // Weight

// if (perspective !== row.perspective) {
//   perspective = row.perspective;
// } else {
//   perspectiveRowSpan = data.filter(
//     (d) => d.perspective === perspective && d.perspective == null
//   ).length;
// }

// if (objective !== row.strategicObjective) {
//   objective = row.strategicObjective;
// } else {
//   objectiveRowSpan = data.filter(
//     (d) =>
//       d.strategicObjective === objective && d.strategicObjective == null
//   ).length;
// }

// if (objective !== row.contributoryObjective) {
//   objective = row.contributoryObjective;
// } else {
//   cObjectiveRowSpan = data.filter(
//     (d) =>
//       d.contributoryObjective === objective &&
//       d.contributoryObjective == null
//   ).length;
// }
