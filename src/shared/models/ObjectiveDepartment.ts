import { makeAutoObservable, toJS } from "mobx";
import {
  totalQ1DepartmentObjectiveRating,
  totalQ2DepartmentObjectiveRating,
  totalQ3DepartmentObjectiveRating,
  totalQ4DepartmentObjectiveRating,
} from "../../logged-in/shared/functions/Scorecard";
import AppStore from "../stores/AppStore";
import MeasureDepartment from "./MeasureDepartment";
import { IObjective } from "./Objective";

interface IObjectiveRating {
  rate: number;
  isUpdated: boolean;
}

export const defaultObjectiveDepartment: IObjectiveDepartment = {
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

export interface IObjectiveDepartment extends IObjective {}

export default class ObjectiveDepartment {
  private objective: IObjectiveDepartment;

  constructor(private store: AppStore, objective: IObjectiveDepartment) {
    makeAutoObservable(this);
    this.objective = objective;
  }

  get asJson() {
    return toJS(this.objective);
  }

  get measures(): MeasureDepartment[] {
    const department = this.objective.department;
    return this.store.departmentMeasure
      .getByDepartment(department)
      .filter((measure) => measure.asJson.objective === this.objective.id);
  }

  private get measuresUpdated() {
    return this.measures.some((m) => m.asJson.isUpdated);
  }

  get q1Rating(): IObjectiveRating {
    const rating = totalQ1DepartmentObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }

  get q2Rating(): IObjectiveRating {
    const rating = totalQ2DepartmentObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }

  get q3Rating(): IObjectiveRating {
    const rating = totalQ3DepartmentObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }

  get q4Rating(): IObjectiveRating {
    const rating = totalQ4DepartmentObjectiveRating(
      this.measures.map((o) => o.asJson)
    );

    return {
      rate: rating || 1,
      isUpdated: this.measuresUpdated,
    };
  }
}
