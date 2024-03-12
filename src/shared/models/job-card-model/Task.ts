import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultTask: ITask = {
    id:"",
    description: "",
    assignedTo: "",
    estimatedTime: 0,
  };
  
  
  export interface ITask {
    id:string,
    description: string;
    assignedTo: string;
    estimatedTime: number;
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