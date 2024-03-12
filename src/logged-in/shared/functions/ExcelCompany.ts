import writeXlsxFile from "write-excel-file";
import { dataFormat } from "../../../shared/functions/Directives";
import { ICompanyAgreementTableRowItem } from "../../../shared/functions/scorecard-pdf/CompanyPerformanceAgreementDocument ";
import { fullPerspectiveName } from "../../../shared/interfaces/IPerspectiveTabs";
import { IMeasureCompany } from "../../../shared/models/MeasureCompany";
import { IObjective } from "../../../shared/models/Objective";

const COMPANY_HEADER_ROW: any = [
  {
    value: "Perspectives",
    fontWeight: "bold",
    backgroundColor: "#F4B084",
  },
  {
    value: "Strategic Objectives",
    fontWeight: "bold",
    backgroundColor: "#FFCC00",
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

const COMPANY_COLUMNS = [
  { width: 10 }, // Perspectives
  { width: 40 }, // Objectives
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

const CompanyExcelDefinition = (
  objectives: IObjective[],
  measures: IMeasureCompany[]
): ICompanyAgreementTableRowItem[] => {
  const sortByPerspective = (
    a: ICompanyAgreementTableRowItem,
    b: ICompanyAgreementTableRowItem
  ) => {
    const order = ["F", "C", "I", "L"];
    const aIndex = order.indexOf(a.perspective.charAt(0));
    const bIndex = order.indexOf(b.perspective.charAt(0));
    return aIndex - bIndex || a.description.localeCompare(b.description);
  };

  const tableRows: ICompanyAgreementTableRowItem[] = measures.map((m) => {
    // get strategic objective
    const strategic = objectives.find((o) => {
      return o.id === m.objective;
    });

    const ratingScale = () => {
      const r1 =
        m.rating1 !== 0
          ? `1 = ${dataFormat(m.dataType, m.rating1, m.dataSymbol)}`
          : `1 = 0`;
      const r2 =
        m.rating2 !== 0
          ? `2 = ${dataFormat(m.dataType, m.rating2, m.dataSymbol)}`
          : `2 = 0`;
      const r3 =
        m.rating3 !== 0
          ? `3 = ${dataFormat(m.dataType, m.rating3, m.dataSymbol)}`
          : `3 = 0`;
      const r4 =
        m.rating4 !== 0
          ? `4 = ${dataFormat(m.dataType, m.rating4, m.dataSymbol)}`
          : `4 = 0`;
      const r5 =
        m.rating5 !== 0
          ? `5 = ${dataFormat(m.dataType, m.rating5, m.dataSymbol)}`
          : `5 = 0`;

      const scale = `${r1}\n${r2}\n${r3}\n${r4}\n${r5}`;
      return scale;
    };

    const row: ICompanyAgreementTableRowItem = {
      perspective: fullPerspectiveName(strategic ? strategic.perspective : ""),
      description: strategic ? strategic.description : "unknown",
      weight: strategic ? strategic.weight || 0 : 0,
      measure: m ? m.description : "unkown",
      baseline: m ? (m.baseline ? m.baseline || "-" : 0) : "",
      q1target: m ? (m.quarter1Target ? m.quarter1Target : "-") : "",
      q2target: m ? (m.quarter2Target ? m.quarter2Target : "-") : "",
      q3target: m ? (m.quarter3Target ? m.quarter3Target : "-") : "",
      q4target: m ? (m.quarter4Target ? m.quarter4Target : "-") : "",
      annualTarget: m ? (m.annualTarget ? m.annualTarget : "-") : "",
      ratingScale: ratingScale(),
      keyInitiatives: m ? m.activities || "-" : "unkown",
      targetDate: m ? m.targetDate : "",
      sourceOfEvidence: m ? m.sourceOfEvidence || "-" : "unkown",
      comments: m ? m.comments : "unkown",
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
  | "Date"
  | "Percentage"
  | "Number"
  | "Currency"
  | "Time"
  | "String"
  | "Custom";
  backgroundColor?: string;
  rowSpan?: number;
};
const formatColumn = ({
  value,
  type,
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
          value: value || " - ",
          wrap: true,
          alignVertical: "top",
          backgroundColor: backgroundColor,
          borderColor: "#55555",
          rowSpan: rowSpan,
        };
      } else
        return {
          type: Date,
          value: new Date(value) || null,
          format: "dd mmmm yyyy",
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
        value: value !== undefined || value !== 0 ? value.toString() : "-", //value || " - ",
        wrap: true,
        alignVertical: "top",
        backgroundColor: backgroundColor,
        borderColor: "#55555",
        rowSpan: rowSpan,
      };
  }
};

export const exportCompanyScorecardExcel = async (
  title: string,
  objectives: IObjective[],
  measures: IMeasureCompany[]
) => {
  // Get the rows
  const rows = CompanyExcelDefinition(objectives, measures);

  let perspective = "";
  let objective = "";

  const dataRows = rows.map((row, _, data) => {
    let perspectiveRowSpan = undefined;
    let objectiveRowSpan = undefined;

    if (perspective !== row.perspective) {
      perspective = row.perspective;
    } else {
      perspectiveRowSpan = data.filter(
        (d) => d.perspective === perspective && d.perspective == null
      ).length;
    }

    if (objective !== row.description) {
      objective = row.description;
    } else {
      objectiveRowSpan = data.filter(
        (d) => d.description === objective && d.description == null
      ).length;
    }

    return [
      formatColumn({
        value: perspectiveRowSpan !== 0 ? row.perspective : "",
        backgroundColor: "#F4B084",
      }), // Perspectives
      formatColumn({
        value: objectiveRowSpan !== 0 ? row.description : "",
      }), // Objectives
      formatColumn({
        value: objectiveRowSpan !== 0 ? row.weight : null,
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

  const data = [COMPANY_HEADER_ROW, ...dataRows];

  return await writeXlsxFile(data, {
    columns: COMPANY_COLUMNS, // (optional) column widths, etc.
    fileName: `${title}.xlsx`,
    sheet: "Data",
    fontFamily: "Candara",
    fontSize: 12,
  });
};
