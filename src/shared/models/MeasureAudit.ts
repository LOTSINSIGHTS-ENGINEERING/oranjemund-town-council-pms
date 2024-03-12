import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";
import { IMeasure } from "./Measure";

// Only to enter keywords to inform briefly on performance, problems encountered, support needed etc.
export const defaultMeasureAudit: IMeasureAudit = {
  month: 0,
  year: 0,
  timestamp: 0,
  id: "",
  measure: "",
  uid: "",
  userName: "",
  objective: "",
  department: "",
  perspective: "",
  description: "",
  comments: "",
  activities: "",
  baseline: 0,
  rating1: 0,
  rating2: 0,
  rating3: 0,
  rating4: 0,
  rating5: 0,
  annualTarget: 0,
  annualActual: null,
  midtermActual: null,
  targetDate: "",
  autoRating: 0,
  midtermAutoRating: 0,
  midtermRating: null,
  finalRating: null,
  weight: 0,
  dataType: "",
  dataSymbol: "",
  sourceOfEvidence: "",
  symbolPos: "prefix",
};

export interface IMeasureAudit extends IMeasure {
  measure: string;
  month: number;
  year: number;
  timestamp: number;
}

export default class MeasureAudit {
  private measure: IMeasureAudit;

  constructor(private store: AppStore, measure: IMeasureAudit) {
    makeAutoObservable(this);
    this.measure = measure;
  }

  get asJson(): IMeasureAudit {
    return toJS(this.measure);
  }
}
