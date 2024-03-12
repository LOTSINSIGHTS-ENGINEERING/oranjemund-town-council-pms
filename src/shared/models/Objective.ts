import { makeAutoObservable, toJS } from "mobx";
import {
  totalMidtermIndividualObjectiveRating,
  totalFinalIndividualObjectiveRating,
} from "../../logged-in/shared/functions/Scorecard";
import AppStore from "../stores/AppStore";
import Measure from "./Measure";

export interface IObjectiveRating {
  rate: number;
  isUpdated: boolean;
}

export const defaultObjective: IObjective = {
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

export interface IObjective {
  id: string;
  uid: string;
  userName: string;
  parent: string; // parent id
  theme: string;
  perspective: string;
  description: string;
  department: string;
  weight: number | null;
  createdAt: number;
  objectiveType?: "self-development" | "performance";
}

export default class Objective {
  private objective: IObjective;

  constructor(private store: AppStore, objective: IObjective) {
    makeAutoObservable(this);
    this.objective = objective;
  }

  get asJson(): IObjective {
    return toJS(this.objective);
  }

  get measures(): Measure[] {
    const uid = this.objective.uid;
    return this.store.measure
      .getByUid(uid)
      .filter((measure) => measure.asJson.objective === this.objective.id);
  }

  get midtermRating(): IObjectiveRating {
    const measuresUpdated = this.measures.some((m) => m.asJson.isUpdated);
    const rating = totalMidtermIndividualObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: measuresUpdated,
    };
  }

  get rating(): IObjectiveRating {
    const measuresUpdated = this.measures.some((m) => m.asJson.isUpdated);
    const rating = totalFinalIndividualObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: measuresUpdated,
    };
  }
}
