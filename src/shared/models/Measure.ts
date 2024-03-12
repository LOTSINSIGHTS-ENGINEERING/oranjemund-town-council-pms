import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultMeasure: IMeasure = {
  id: "",
  uid: "",
  userName: "",
  objective: "",
  department: "",
  perspective: "",
  description: "",
  comments: "",
  activities: "",
  baseline: null,
  rating1: null,
  rating2: null,
  rating3: null,
  rating4: null,
  rating5: null,
  annualTarget: 0,
  midtermActual: null,
  annualActual: null,
  autoRating: 1,
  midtermAutoRating: 1,
  midtermRating: null,
  finalRating: null,
  weight: 0,
  dataType: "Currency",
  dataSymbol: "NAD",
  symbolPos: "prefix",
  sourceOfEvidence: "",
  targetDate: "",
};

export interface IMeasure {
  id: string;
  uid: string;
  userName: string;
  objective: string;
  department: string;
  perspective: string; // Finacial, Customer, Operational, Learning & Growth,
  description: string;
  comments: string;
  activities: string;
  baseline: number | null;
  rating1: number | null; // required field
  rating2: number | null; // required field
  rating3: number | null; // required field
  rating4: number | null;
  rating5: number | null;
  annualTarget: number | null;
  midtermActual: number | null;
  annualActual: number | null;
  targetDate: number | string;
  autoRating: number;
  midtermAutoRating: number;
  midtermRating: number | null; // supervisor
  finalRating: number | null; // supervisor
  weight: number; // percentage
  dataType: string; // Number | Text | Date | Percentage | Currency | YesNo | Rating
  dataSymbol: string; // %, $, €, £
  symbolPos: "prefix" | "suffix"; // prefix / suffix
  sourceOfEvidence: string;
  isUpdated?: boolean;
}

export default class Measure {
  private measure: IMeasure;

  constructor(private store: AppStore, measure: IMeasure) {
    makeAutoObservable(this);
    this.measure = measure;
  }

  get asJson(): IMeasure {
    return toJS(this.measure);
  }
}
