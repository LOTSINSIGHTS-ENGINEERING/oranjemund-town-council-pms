import writeXlsxFile from "write-excel-file";
import { dataFormat } from "../../../shared/functions/Directives";
import { IDepartmentAgreementTableRowItem } from "../../../shared/functions/scorecard-pdf/DepartmentPerformanceAgreementDocument";
import { fullPerspectiveName } from "../../../shared/interfaces/IPerspectiveTabs";
import { IMeasureDepartment } from "../../../shared/models/MeasureDepartment";
import { IObjective } from "../../../shared/models/Objective";

const DEPARTMENT_HEADER_ROW: any = [
  {
    value: "Perspectives",
    fontWeight: "bold",
    backgroundColor: "#F4B084",
  },
  {
    value: "Strategic Objectives (Company)",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
  {
    value: "Contributory Departmental Objective",
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
    value: "Quarterly Target, Q1",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Quarterly Target, Q2",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Quarterly Target, Q3",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Quarterly Target, Q4",
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
    value: "Comments",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
  },
  {
    value: "Source of Evidence",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
    wrap: true,
  },
];

const DEPARTMENT_COLUMNS = [
  { width: 10 }, // Perspectives
  { width: 40 }, // Objectives
  { width: 40 }, // Contributory Objectives
  { width: 10 }, // Weight
  { width: 25 }, // Measures/KPI
  { width: 15 }, // Baseline
  { width: 15 }, // Quarter 1 Target
  { width: 15 }, // Quarter 2 Target
  { width: 15 }, // Quarter 3 Target
  { width: 15 }, // Quarter 4 Target
  { width: 15 }, // Annual Target
  { width: 15 }, // Rating Scale 1-5
  { width: 40 }, // Key Initiatives
  { width: 15 }, // Target Date
  { width: 40 }, // Comments
  { width: 25 }, // Source of Evidence
];

const DepartmentExcelDefinition = (
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasureDepartment[]
): IDepartmentAgreementTableRowItem[] => {
  const sortByPerspective = (
    a: IDepartmentAgreementTableRowItem,
    b: IDepartmentAgreementTableRowItem
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

  const tableRows: IDepartmentAgreementTableRowItem[] = measures.map((m) => {
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

    const row: IDepartmentAgreementTableRowItem = {
      perspective: fullPerspectiveName(
        contributory ? contributory.perspective : ""
      ),
      strategicObjective: strategic ? strategic.description : "unknown",
      contributoryObjective: contributory ? contributory.description : "unkown",
      weight: contributory ? contributory.weight || 0 : 0,
      measure: m ? m.description : "unknown",
      baseline: m ? (m.baseline ? m.baseline : "-") : "",
      q1target: m ? (m.quarter1Target ? m.quarter1Target : "-") : "",
      q2target: m ? (m.quarter2Target ? m.quarter2Target : "-") : "",
      q3target: m ? (m.quarter3Target ? m.quarter3Target : "-") : "",
      q4target: m ? (m.quarter4Target ? m.quarter4Target : "-") : "",
      annualTarget: m ? (m.annualTarget ? m.annualTarget : "-") : "",
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
  backgroundColor?: string;
  rowSpan?: number;
};
const formatColumn = ({
  value,
  type = "String",
  backgroundColor,
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

export const exportDepartmentScorecardExcel = async (
  title: string,
  objectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasureDepartment[]
) => {
  // Get the rows
  const rows = DepartmentExcelDefinition(
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
    } else {
      perspectiveRowSpan = data.filter(
        (d) => d.perspective === perspective && d.perspective == null
      ).length;
    }

    if (objective !== row.strategicObjective) {
      objective = row.strategicObjective;
    } else {
      objectiveRowSpan = data.filter(
        (d) =>
          d.strategicObjective === objective && d.strategicObjective == null
      ).length;
    }

    if (cObjective !== row.contributoryObjective) {
      cObjective = row.contributoryObjective;
    } else {
      cObjectiveRowSpan = data.filter(
        (d) =>
          d.contributoryObjective === objective &&
          d.contributoryObjective == null
      ).length;
    }

    return [
      formatColumn({
        value: perspectiveRowSpan !== 0 ? row.perspective : "",
        backgroundColor: "#F4B084",
      }), // Perspectives
      formatColumn({
        value: objectiveRowSpan !== 0 ? row.strategicObjective : "",
      }), // Objectives
      formatColumn({
        value: cObjectiveRowSpan !== 0 ? row.contributoryObjective : "",
      }), // Objectives
      formatColumn({
        value: cObjectiveRowSpan !== 0 ? row.weight : null,
        type: "Number",
      }), // Weight
      formatColumn({ value: row.measure }), // Measures/KPI
      formatColumn({ value: row.baseline, type: row.dataType }), // Baseline
      formatColumn({ value: row.q1target, type: row.dataType }), // Q1 Target
      formatColumn({ value: row.q2target, type: row.dataType }), // Q2 Target
      formatColumn({ value: row.q3target, type: row.dataType }), // Q3 Target
      formatColumn({ value: row.q4target, type: row.dataType }), // Q4 Target
      formatColumn({ value: row.annualTarget, type: row.dataType }), // Annual Target
      formatColumn({ value: row.ratingScale }), // Rating scale 1-5
      formatColumn({ value: row.keyInitiatives }), // Key Initiatives
      formatColumn({ value: row.targetDate, type: "Date" }), // Target Date
      formatColumn({ value: row.comments }), // Comments
      formatColumn({ value: row.sourceOfEvidence }), // Source of evidence
    ];
  });

  const data = [DEPARTMENT_HEADER_ROW, ...dataRows];

  await writeXlsxFile(data, {
    columns: DEPARTMENT_COLUMNS, // (optional) column widths, etc.
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
