import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export type IProjectTasktype = "task" | "milestone" | "project"

export type IProjectTaskStatus = "todo" | "in-progress" | "in-review" | "done"

export const defaultTask: IProjectTask = {
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
    actualAmount: 0
}

export interface IProjectTask {
    id: string;
    taskName: string;
    description: string;
    milestoneId: string;
    projectId: string
    status: IProjectTaskStatus;
    startDate: string;
    endDate: string;
    type: IProjectTasktype;
    progress: number;
    color?: string;
    comments?: string[];
    budgetedAmount: number;
    actualAmount: number;
    dependencies?: string[],
    files?: File[];
    usersId: string[];
}

export interface File {
    name: string;
    link: string;
}

export default class ProjectTask {
    private task: IProjectTask;

    constructor(private store: AppStore, task: IProjectTask) {
        makeAutoObservable(this);
        this.task = task;
    }

    get asJson(): IProjectTask {
        return toJS(this.task);
    }
}