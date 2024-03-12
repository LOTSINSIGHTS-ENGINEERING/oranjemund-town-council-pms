import { dataTypeSymbol } from "../../../logged-in/shared/functions/Scorecard";
import { dateFormat } from "../../../logged-in/shared/utils/utils";
import { fullPerspectiveName } from "../../interfaces/IPerspectiveTabs";
import { IMeasureDepartment } from "../../models/MeasureDepartment";
import { IObjective } from "../../models/Objective";
import { dataFormat } from "../Directives";
import {
  marginTopBottom,
  header,
  sectionHeader,
  departmentSignatureTable,
} from "./DocDefition";
import { brandLogo } from "./ImageLoader";

const tableWidths: Row = [
  100,
  "*",
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
  { text: "Contributory Departmental Objective", style: "tableHeader" },
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
  RowSpan | string | number,
  RowSpan | string,
  RowSpan | string,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string,
  RowSpan | string | number,
  RowSpan | string | number,
  RowSpan | string,
  RowSpan | string
];

export interface IDepartmentAgreementTableRowItem {
  perspective: string; // "Perspective",
  strategicObjective: string; // "Strategic Objectives",
  contributoryObjective: string; // "Contributory Departmental Objective",
  weight: number; // "Weight (%)",
  measure: string | number; // "Measures/KPI",
  baseline: string | number; // "Baseline",
  q1target: string | number; // "Quarterly Target , Q1",
  q2target: string | number; // "Quarterly Target , Q2",
  q3target: string | number; // "Quarterly Target , Q3",
  q4target: string | number; // "Quarterly Target , Q4",
  annualTarget: string | number; // "Annual Target",
  ratingScale: string; // "Annual Target",
  keyInitiatives: string | number; // "Key Initiatives",
  targetDate: string | number; // "Target Date",
  sourceOfEvidence: string; // "Source of Evidence",
  comments: string; // "Comments",
  dataType?: string; // "Data type"
  dataSymbol?: string; // "Symbol"
}

const ConvertToTableRowItem = (
  strategicObjectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasureDepartment[]
) => {
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

  const formatMeasureValue = (type: string, value: string | number | null) => {
    const suffix = dataTypeSymbol(type).suffix;
    const prefix = dataTypeSymbol(type).prefix;

    if (!value) return "";
    if (type === "Date") return dateFormat(Number(value));
    if (type === "Currency")
      return `${prefix}${Number(value).toFixed(2)}${suffix}`;

    return `${prefix}${value}${suffix}`;
  };

  const tableRows: IDepartmentAgreementTableRowItem[] = measures.map((m) => {
    // get contributory objective
    const contributory = contributoryObjectives.find(
      (o) => o.id === m.objective
    );

    // get strategic objective
    const strategic = strategicObjectives.find((s) => {
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
      keyInitiatives: m ? m.activities : "unkown",
      targetDate: m ? m.targetDate : "unkown",
      sourceOfEvidence: m ? m.sourceOfEvidence : "unkown",
      comments: m ? m.comments : "unkown",
      dataType: m.dataType,
      dataSymbol: m.dataSymbol,
    };

    return row;
  });

  return tableRows.sort(sortByPerspective);
};

const FormatTableSpan = (_rows: IDepartmentAgreementTableRowItem[]) => {
  let perspective = "";
  let objective = "";
  let cObjective = "";

  const rows: Row[] = _rows.map((row, _, data) => {
    let perspectiveRowSpan = undefined;
    let objectiveRowSpan = undefined;
    let cObjectiveRowSpan = undefined;

    if (perspective !== row.perspective) {
      perspective = row.perspective;
      perspectiveRowSpan = data.filter(
        (r) => r.perspective === perspective
      ).length;
    }

    if (objective !== row.strategicObjective) {
      objective = row.strategicObjective;
      objectiveRowSpan = data.filter(
        (r) => r.strategicObjective === objective
      ).length;
    }

    if (cObjective !== row.contributoryObjective) {
      cObjective = row.contributoryObjective;
      cObjectiveRowSpan = data.filter(
        (r) => r.contributoryObjective === cObjective
      ).length;
    }

    return [
      {
        rowSpan: perspectiveRowSpan || 1,
        text: row.perspective,
      },
      {
        rowSpan: objectiveRowSpan || 1,
        text: row.strategicObjective,
      },
      {
        rowSpan: cObjectiveRowSpan || 1,
        text: row.contributoryObjective,
      },
      {
        rowSpan: cObjectiveRowSpan || 1,
        text: row.weight || "-",
      },
      row.measure || "-",
      row.baseline || "-",
      row.q1target || "-",
      row.q2target || "-",
      row.q3target || "-",
      row.q4target || "-",
      row.annualTarget || "-",
      row.ratingScale || "-",
      row.keyInitiatives || "-",
      row.targetDate || "-",
      row.sourceOfEvidence || "-",
      row.comments || "-",
    ];
  });

  return rows;
};

export const DepartmentPerformanceAgreementDocument = async (
  title: string,
  vision: string,
  mission: string,
  strategicObjectives: IObjective[],
  contributoryObjectives: IObjective[],
  measures: IMeasureDepartment[],
  department: string
) => {
  const logo = await brandLogo();
  const rows: IDepartmentAgreementTableRowItem[] = ConvertToTableRowItem(
    strategicObjectives,
    contributoryObjectives,
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
      header("PART A: Department Details"),
      sectionHeader(
        "______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________"
      ),
      marginTopBottom(),
      sectionHeader(`Department: ${title}`),
      marginTopBottom(),
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
      marginTopBottom(),
      marginTopBottom(),
      departmentSignatureTable(),
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
