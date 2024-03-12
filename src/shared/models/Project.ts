import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultProject: IProject = {
  id: "",
  owner: "",
  participants: [],
  description: "",
  startDate: 0,
  endDate: 0,
  status: "",
  budget: 0,
  spent: 0,
  variance: 0,
  createdAt: 0,
};

export interface IProject {
  id: string;
  owner: string;
  participants: string[];
  description: string;
  startDate: number;
  endDate: number;
  status: string;
  budget: number;
  spent: number;
  variance: number;
  createdAt: number;
}

export default class Project {
  private project: IProject;

  constructor(private store: AppStore, project: IProject) {
    makeAutoObservable(this);
    this.project = project;

    // Derive Variance
    this.deriveVariance();
  }

  deriveVariance() {
    this.project.variance =
      ((this.project.budget - this.project.spent) / this.project.budget) * 100;
  }

  get asJson(): IProject {
    return toJS(this.project);
  }
}
