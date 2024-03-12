import { dataTypeSymbol } from "../../../logged-in/shared/functions/Scorecard";
import { dateFormat } from "../../../logged-in/shared/utils/utils";
import { fullPerspectiveName } from "../../interfaces/IPerspectiveTabs";
import { IMeasureCompany } from "../../models/MeasureCompany";
import { IObjective } from "../../models/Objective";
import { dataFormat } from "../Directives";
import {
  marginTopBottom,
  header,
  sectionHeader,
  companySignatureTable,
} from "./DocDefition";
import { brandLogo } from "./ImageLoader";

const tableWidths: Row = [
  100,
  "*",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
  "auto",
];

const tableHeader: Row = [
  { text: "Perspective", style: "tableHeader" },
  { text: "Strategic Objectives", style: "tableHeader" },
  { text: "Weight (%)", style: "tableHeader" },
  { text: "Measures/KPI", style: "tableHeader" },
  { text: "Baseline", style: "tableHeader" },
  { text: "Quarterly Target , Q1", style: "tableHeader" },
  { text: "Quarterly Target , Q2", style: "tableHeader" },
  { text: "Quarterly Target , Q3", style: "tableHeader" },
  { text: "Quarterly Target , Q4", style: "tableHeader" },
  { text: "Annual Target", style: "tableHeader" },
  { text: "Rating Scale 1-5", style: "tableHeader" },
  { text: "Key Initiatives", style: "tableHeader" },
  { text: "Target Date", style: "tableHeader" },
  { text: "Source of Evidence", style: "tableHeader" },
  { text: "Comments", style: "tableHeader" },
];

type RowSpan = {
  text: string | any;
  rowSpan?: number;
  style?: string;
};

type Row = [
  string | number | RowSpan, //   "Perspective",
  string | RowSpan, //   "Strategic Objectives",
  string | number | RowSpan, //   "Weight (%)",
  string | number | RowSpan, //   "Measures/KPI",
  string | number | RowSpan, //   "Baseline",
  string | number | RowSpan, //   "Quarterly Target , Q1",
  string | number | RowSpan, //   "Quarterly Target , Q2",
  string | number | RowSpan, //   "Quarterly Target , Q3",
  string | number | RowSpan, //   "Quarterly Target , Q4",
  string | number | RowSpan, //   "Annual Target",
  string | RowSpan, // Rating scale 1-5
  string | number | RowSpan, //   "Key Initiatives",
  string | number | RowSpan, //   "Target Date",
  string | RowSpan, //   "Source of Evidence",
  string | RowSpan //   "Comments",
];

export interface ICompanyAgreementTableRowItem {
  perspective: string; // "Perspective"
  description: string; // "Strategic Objectives"
  weight: number; // "Weight (%)"
  measure: string | number; // "Measures/KPI"
  baseline: string | number; // "Baseline"
  q1target: string | number; // "Quarterly Target , Q1"
  q2target: string | number; // "Quarterly Target , Q2"
  q3target: string | number; // "Quarterly Target , Q3"
  q4target: string | number; // "Quarterly Target , Q4"
  annualTarget: string | number; // "Annual Target"
  ratingScale: string; // "Annual Target",
  keyInitiatives: string | number; // "Key Initiatives"
  targetDate: string | number; // "Target Date"
  sourceOfEvidence: string; // "Source of Evidence"
  comments: string; // "Comments"
  dataType?: string; // "Data type"
  dataSymbol?: string; // "Symbol"
}

export const ConvertToTableRowItem = (
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

  const formatMeasureValue = (type: string, value: string | number | null) => {
    const suffix = dataTypeSymbol(type).suffix;
    const prefix = dataTypeSymbol(type).prefix;

    if (!value) return "";
    if (type === "Date") return dateFormat(Number(value));
    if (type === "Currency")
      return `${prefix}${Number(value).toFixed(2)}${suffix}`;

    return `${prefix}${value}${suffix}`;
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
      baseline: m ? formatMeasureValue(m.dataType, m.baseline) : "unkown",
      q1target: m ? formatMeasureValue(m.dataType, m.quarter1Target) : "unkown",
      q2target: m ? formatMeasureValue(m.dataType, m.quarter2Target) : "unkown",
      q3target: m ? formatMeasureValue(m.dataType, m.quarter3Target) : "unkown",
      q4target: m ? formatMeasureValue(m.dataType, m.quarter4Target) : "unkown",
      annualTarget: m
        ? formatMeasureValue(m.dataType, m.annualTarget)
        : "unknown",
      ratingScale: ratingScale(),
      keyInitiatives: m ? m.activities || "-" : "unkown",
      targetDate: m ? m.targetDate : "unkown",
      sourceOfEvidence: m ? m.sourceOfEvidence || "-" : "unkown",
      comments: m ? m.comments : "unkown",
      dataType: m.dataType,
      dataSymbol: m.dataSymbol,
    };

    return row;
  });

  return tableRows.sort(sortByPerspective);
};

const FormatTableSpan = (_rows: ICompanyAgreementTableRowItem[]) => {
  let perspective = "";
  let description = "";

  const rows: Row[] = _rows.map((row, _, data) => {
    let perspectiveRowSpan = undefined;
    let descRowSpan = undefined;

    if (perspective !== row.perspective) {
      perspective = row.perspective;
      perspectiveRowSpan = data.filter(
        (r) => r.perspective === perspective
      ).length;
    }

    if (description !== row.description) {
      description = row.description;
      descRowSpan = data.filter((r) => r.description === description).length;
    }

    return [
      {
        rowSpan: perspectiveRowSpan || 1,
        text: row.perspective,
      },
      {
        rowSpan: descRowSpan || 1,
        text: row.description,
      },
      {
        rowSpan: descRowSpan || 1,
        text: row.weight || "-",
      },
      row.measure || "-", // "Measures/KPI"
      row.baseline === 0 ? 0 : row.baseline || "-", // "Baseline",
      row.q1target === 0 ? 0 : row.q1target || "-", // "Quarterly Target , Q1"
      row.q2target === 0 ? 0 : row.q2target || "-", // "Quarterly Target , Q2"
      row.q3target === 0 ? 0 : row.q3target || "-", // "Quarterly Target , Q3"
      row.q4target === 0 ? 0 : row.q4target || "-", // "Quarterly Target , Q4"
      row.annualTarget === 0 ? 0 : row.annualTarget || "-", // "Annual Target"
      row.ratingScale, // rating scale 1-5
      row.keyInitiatives || "-", // "Key Initiatives"
      row.targetDate || "", // "Target Date"
      row.sourceOfEvidence || "", // "Source of Evidence"
      row.comments || "", // "Comments"
    ];
  });

  return rows;
};

export const CompanyPerformanceAgreementDocument = async (
  title: string,
  vision: string,
  mission: string,
  objectives: IObjective[],
  measures: IMeasureCompany[]
) => {
  const logo = await brandLogo();
  const rows: ICompanyAgreementTableRowItem[] = ConvertToTableRowItem(
    objectives,
    measures
  );

  const mappedRows = FormatTableSpan(rows);

  const body = [tableHeader, ...mappedRows];

  return {
    pageSize: "A2", // by default we use portrait, you can change it to landscape if you wish
    pageOrientation: "landscape",
    content: [
      logo,
      marginTopBottom(),
      header("Unicomms Strategy Execution and Performance Management System"),
      header(`${title}`),
      sectionHeader(
        "______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________"
      ),
      sectionHeader(`${new Date().toLocaleDateString()}`),
      marginTopBottom(),
      sectionHeader("Mission:"),
      sectionHeader(mission),
      marginTopBottom(),
      sectionHeader("Vision:"),
      sectionHeader(vision),
      marginTopBottom(),
      marginTopBottom(),
      header("PART A: Company Details"),
      sectionHeader(
        "______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________"
      ),
      marginTopBottom(),
      sectionHeader(`Company: Nkurenkuru Town Council`),
      marginTopBottom(),
      sectionHeader(`Performance Agreement Period: ${title}`),
      marginTopBottom(),
      marginTopBottom(),
      header("PART B: Higher Level Statements"),
      sectionHeader(
        "______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________"
      ),
      sectionHeader(
        "Commitment: We set targets and strive towards achievements in unison."
      ),
      marginTopBottom(),
      sectionHeader(
        "Professionalism: We deliever high-quality standard of service and demonstrate integrity and ethical behavior in carrying out our duties."
      ),
      marginTopBottom(),
      sectionHeader(
        "Innovation: We are open to new ideas and open to continuously and find efficient and effective ways in delivering services."
      ),
      marginTopBottom(),
      sectionHeader(
        "Transparency: We carry out duties in an open, fair, and procedural manner. "
      ),
      marginTopBottom(),
      sectionHeader(
        "Accountability: We are responsible and answerable for our actions."
      ),
      marginTopBottom(),

      marginTopBottom(),

      header("PART C: Scorecard"),
      sectionHeader(
        "______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________"
      ),
      marginTopBottom(),
      {
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: body,
        },
      },
      companySignatureTable(),
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "black",
      },
    },
  };
};
