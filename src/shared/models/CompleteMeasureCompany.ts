import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

// CorporateScorecard Collection
export interface ICorporateScorecard {
  id: string; // corporate_id (randomly generated)
  title: string; // "Corporate 5-Year Plan (2019-2024)"
  from: string; // "2019"
  to: string; // "2024"
  type: string; // "Years" | "Quarters" | "Months" | "Weeks" | "Days"
  interval: number; // 1, 2, 3, 4, 5
  // annualScorecards: IAnnualScorecard[];
  metadata: {
    active: boolean;
    locked: boolean;
    hidden: boolean;
  };
}

// AnnualScorecard Collection --> Subcolleciton of Corporate Scorecard
export interface IAnnualScorecard {
  id: string; // annual_scorecard_id (corporate_id + year)
  title: string; // "2019-2020"
  from: string; // "2019"
  to: string; // "2024"
  type: string; // "Years" | "Quarters" | "Months" | "Weeks" | "Days"
  interval: number; // 1, 2, 3, 4, 5
  metadata: {
    active: boolean;
    locked: boolean;
    hidden: boolean;
  };
  corporateScorecard: {
    id: string; // corporate_id
    title: string; // "Corporate 5-Year Plan (2019-2024)"
  };
}

// Theme Collection
export interface ITheme {
  id: string; // theme_id (randomly generated)
  title: string; // "Operational and Organizational Excellence"
  description: string; // "Meaning of --> Operational and Organizational Excellence"
  corporateScorecard: {
    id: string; // corporate_id
    title: string; // "Corporate 5-Year Plan (2019-2024)"
  };
}

// Objective Collection
export interface IObjective {
  id: string; // objective_id (randomly generated)
  title: string; // "Improve Revenue &  Cost Leadership"
  description: string; // "Meaning of --> Improve Revenue &  Cost Leadership"
  theme: {
    id: string; // theme_id
    title: string; // "Operational and Organizational Excellence"
  };
  corporateScorecard: {
    id: string; // corporate_id
    title: string; // "Corporate 5-Year Plan (2019-2024)"
  };
}

// Measure Collection
export interface IMeasure {
  id: string;
  title: string; // Net Profit (N$)
  description: string; // "Meaning of --> Net Profit (N$)"
  perspective: string; // Finacial, Customer, Operational, Learning & Growth,
  comments: string; // "Comments" limited to 255 characters
  baseline: number; // 50,017.00
  targets: IAnnualTarget[]; // contains the targets for each year
  dataType: string; // Number | Text | Date | Percentage | Currency | YesNo | Rating
  weight: number; // percentage
  objective: {
    id: string; // objective_id
    title: string; // "Improve Revenue &  Cost Leadership"
  };
  theme: {
    id: string; // theme_id
    title: string; // "Operational and Organizational Excellence"
  };
  annualScorecard: {
    id: string; // annual_scorecard_id
    title: string; // "2019-2020"
  };
  corporateScorecard: {
    id: string; // corporate_id
    title: string; // "Corporate 5-Year Plan (2019-2024)"
  };
}

// Annual Scorecard Collection
interface IAnnualTarget {
  id: string; // annual_target_id (corporate_id + year)
  year: number; // 2020
  fromDate: string;
  toDate: string;
  interval: number;
  weight: number; // percentage
  baseline: number;
  quarterlyTargets: IQuarterlyTarget[];
  target: number; // 50% (related to quartely targets.)
  actual: number; // 10.9%
  manActivities: string;
  metadata: {
    active: boolean;
    locked: boolean;
    hidden: boolean;
  };
  objective: {
    id: string; // objective_id (randomly generated)
    title: string; // "Improve Revenue &  Cost Leadership"
  };
  theme: {
    id: string; // theme_id
    title: string; // "Operational and Organizational Excellence"
  };
  corporateScorecard: {
    id: string; // corporate_id
    title: string; // "Corporate 5-Year Plan (2019-2024)"
  };
}

interface IQuarterlyTarget {
  quarter: number; // 1, 2, 3, 4
  target: number; // 50%
  actual: number; // 78.1%
  metadata: {
    active: boolean;
    locked: boolean;
  };
}

export default class MeasureCompany {
  private measure: IMeasure;

  constructor(private store: AppStore, measure: IMeasure) {
    makeAutoObservable(this);
    this.measure = measure;
  }

  get asJson(): IMeasure {
    return toJS(this.measure);
  }
}
