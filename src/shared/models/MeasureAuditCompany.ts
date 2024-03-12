import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";
import { IMeasureCompany } from "./MeasureCompany";

export const defaultMeasureAuditCompany: IMeasureAuditCompany = {
  measure: "",
  month: 0,
  year: 0,
  timestamp: 0,
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
  quarter1Target: null,
  quarter2Target: null,
  quarter3Target: null,
  quarter4Target: null,
  quarter1Actual: null,
  quarter2Actual: null,
  quarter3Actual: null,
  quarter4Actual: null,
  baseline: null,
  rating1: null,
  rating2: null,
  rating3: null,
  rating4: null,
  rating5: null,
  annualTarget: null,
  annualActual: null,
  targetDate: "",
  q1AutoRating: 0,
  q1Rating: null,
  q2AutoRating: 0,
  q2Rating: null,
  q3AutoRating: 0,
  q3Rating: null,
  q4AutoRating: 0,
  q4Rating: null,
  weight: 0,
  dataType: "",
  dataSymbol: "",
  symbolPos: "prefix",
};

export interface IMeasureAuditCompany extends IMeasureCompany {
  measure: string;
  month: number;
  year: number;
  timestamp: number;
}

export default class MeasureAuditCompany {
  private measure: IMeasureAuditCompany;

  constructor(private store: AppStore, measure: IMeasureAuditCompany) {
    makeAutoObservable(this);
    this.measure = measure;
  }

  get asJson(): IMeasureAuditCompany {
    return toJS(this.measure);
  }
}
