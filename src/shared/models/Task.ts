import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultTask: ITask = {
  id: "",
  owner: "",
  scorecard: "",
  participants: [],
  description: "",
  startDate: 0,
  endDate: 0,
  status: "",
  budget: 0,
  spent: 0,
  createdAt: 0,
};

export interface ITask {
  id: string;
  owner: string;
  scorecard: string;
  participants: string[];
  description: string;
  startDate: number;
  endDate: number;
  status: string;
  budget: number;
  spent: number;
  createdAt: number;
}

export default class Task {
  private task: ITask;

  constructor(private store: AppStore, task: ITask) {
    makeAutoObservable(this);
    this.task = task;
  }

  get asJson(): ITask {
    return toJS(this.task);
  }
}
