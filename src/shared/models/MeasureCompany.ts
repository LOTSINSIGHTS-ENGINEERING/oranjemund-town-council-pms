import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultMeasureCompany: IMeasureCompany = {
  id: "",
  uid: "",
  userName: "",
  objective: "",
  department: "",
  perspective: "",
  description: "",
  comments: "",
  sourceOfEvidence: "",
  statusUpdate: "",
  activities: "",
  baseline: 0,
  quarter1Target: 0,
  quarter2Target: 0,
  quarter3Target: 0,
  quarter4Target: 0,
  quarter1Actual: 0,
  quarter2Actual: 0,
  quarter3Actual: 0,
  quarter4Actual: 0,
  rating1: 0,
  rating2: 0,
  rating3: 0,
  rating4: 0,
  rating5: 0,
  annualTarget: 0,
  targetDate: "",
  annualActual: 0,
  weight: 0,
  dataType: "Currency",
  dataSymbol: "NAD",
  symbolPos: "prefix",

  q1AutoRating: 1,
  q1Rating: null,
  q2AutoRating: 1,
  q2Rating: null,
  q3AutoRating: 1,
  q3Rating: null,
  q4AutoRating: 1,
  q4Rating: null,
};

export interface IMeasureCompany {
  id: string;
  uid: string;
  userName: string;
  objective: string;
  department: string;
  perspective: string; // Finacial, Customer, Operational, Learning & Growth,
  description: string;
  comments: string;
  sourceOfEvidence: string;
  statusUpdate: string;
  activities: string;
  quarter1Target: number | null;
  quarter2Target: number | null;
  quarter3Target: number | null;
  quarter4Target: number | null;
  quarter1Actual: number | null;
  quarter2Actual: number | null;
  quarter3Actual: number | null;
  quarter4Actual: number | null;
  baseline: number | null;
  rating1: number | null; // required field
  rating2: number | null; // required field
  rating3: number | null; // required field
  rating4: number | null;
  rating5: number | null;
  annualTarget: number | null;
  annualActual: number | null;
  targetDate: number | string;

  q1AutoRating: number;
  q1Rating: number | null; // supervisor
  q2AutoRating: number;
  q2Rating: number | null; // supervisor
  q3AutoRating: number;
  q3Rating: number | null; // supervisor
  q4AutoRating: number;
  q4Rating: number | null; // supervisor

  weight: number; // percentage
  dataType: string; // Number | Text | Date | Percentage | Currency | YesNo | Rating
  dataSymbol: string; // %, $, €, £
  symbolPos: "prefix" | "suffix"; // prefix / suffix
  isUpdated?: boolean;
}

export default class MeasureCompany {
  private measure: IMeasureCompany;

  constructor(private store: AppStore, measure: IMeasureCompany) {
    makeAutoObservable(this);
    this.measure = measure;
  }

  get asJson(): IMeasureCompany {
    return toJS(this.measure);
  }
}
