import { makeAutoObservable, toJS } from "mobx";
import {
  totalQ1CompanyObjectiveRating,
  totalQ2CompanyObjectiveRating,
  totalQ3CompanyObjectiveRating,
  totalQ4CompanyObjectiveRating,
} from "../../logged-in/shared/functions/Scorecard";

import AppStore from "../stores/AppStore";
import MeasureCompany from "./MeasureCompany";
import { IObjective } from "./Objective";

interface IObjectiveRating {
  rate: number;
  isUpdated: boolean;
}

export const defaultObjectiveCompany: IObjectiveCompany = {
  id: "",
  uid: "",
  userName: "",
  parent: "",
  theme: "",
  perspective: "Financial",
  description: "",
  department: "",
  weight: 0,
  createdAt: Date.now(),
};

export interface IObjectiveCompany extends IObjective {}

export default class ObjectiveCompany {
  private objective: IObjectiveCompany;

  constructor(private store: AppStore, objective: IObjectiveCompany) {
    makeAutoObservable(this);
    this.objective = objective;
  }

  get asJson() {
    return toJS(this.objective);
  }

  get measures(): MeasureCompany[] {
    return this.store.companyMeasure.all.filter(
      (measure) => measure.asJson.objective === this.objective.id
    );
  }

  private get measuresUpdated() {
    return this.measures.some((m) => m.asJson.isUpdated);
  }

  get q1Rating(): IObjectiveRating {
    const rating = totalQ1CompanyObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }

  get q2Rating(): IObjectiveRating {
    const rating = totalQ2CompanyObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }

  get q3Rating(): IObjectiveRating {
    const rating = totalQ3CompanyObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }

  get q4Rating(): IObjectiveRating {
    const rating = totalQ4CompanyObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }
}
