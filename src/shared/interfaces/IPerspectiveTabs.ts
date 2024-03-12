import { observer } from "mobx-react-lite";
import { useAppContext } from "../functions/Context";


export type ITAB_ID =
  | "All"
  | "Map"
  | "Financial"
  | "Customer"
  | "Process"
  | "Growth";

export interface IPerspectiveTab {
  id: ITAB_ID;
  name: string;
  description: string;
}

export const ALL_TAB: IPerspectiveTab = {
  id: "All",
  name: "All Objectives",
  description: "All the objectives in the scorecard.",
};

export const MAP_TAB: IPerspectiveTab = {
  id: "Map",
  name: "Strategic Map",
  description: "Strategic map for your organization.",
};

export const FINANCIAL_TAB: IPerspectiveTab = {
  id: "Financial",
  name: "Financial Objectives",
  description: "Financial objectives in the scorecard.",
};

export const CUSTOMER_TAB: IPerspectiveTab = {
  id: "Customer",
  name: "Customer Objectives",
  description: "Customer objectives in the scorecard.",
};

export const PROCESS_TAB: IPerspectiveTab = {
  id: "Process",
  name: "Internal Process Objectives",
  description: "Process objectives in the scorecard.",
};

export const GROWTH_TAB: IPerspectiveTab = {
  id: "Growth",
  name: "Learning & Growth Objectives",
  description: "Learning & Growth objectives in the scorecard.",
};

const removeLast10Char = (str: string) => str.substring(0, str.length - 10);



export const fullPerspectiveName = (tab: string) => {
  if (tab === FINANCIAL_TAB.id) return removeLast10Char(FINANCIAL_TAB.name);
  else if (tab === CUSTOMER_TAB.id) return removeLast10Char(CUSTOMER_TAB.name);
  else if (tab === PROCESS_TAB.id) return removeLast10Char(PROCESS_TAB.name);
  if (tab === GROWTH_TAB.id) return removeLast10Char(GROWTH_TAB.name);
  return "uknown";
};


