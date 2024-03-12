import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export type IGeneralTaskType = "task" | "milestone"

export type IGeneralTaskStatus = "todo" | "in-progress" | "in-review" | "done"

export const defaultGeneralTask: IGeneralTask = {
    id: "",
    taskName: "",
    description: "",
    milestoneId: "",
    projectId: "",
    status: "todo",
    startDate: "",
    endDate: "",
    type: "task",
    progress: 0,
    usersId: [],
    budgetedAmount: 0,
    actualAmount: 0,
    uid: "",
    files: [],
    comments: []
}

export interface IGeneralTask {
    id: string;
    uid: string;
    taskName: string;
    description: string;
    milestoneId: string;
    projectId: string
    status: IGeneralTaskStatus;
    startDate: string;
    endDate: string;
    type: IGeneralTaskType;
    progress: number;
    color?: string;
    comments: string[];
    budgetedAmount: number;
    actualAmount: number;
    dependencies?: string[],
    files: ITaskFile[];
    usersId: string[];
}

export interface ITaskFile {
    name: string;
    link: string;
}

export default class GeneralTask {
    private task: IGeneralTask;

    constructor(private store: AppStore, task: IGeneralTask) {
        makeAutoObservable(this);
        this.task = task;
    }

    get asJson(): IGeneralTask {
        return toJS(this.task);
    }
}