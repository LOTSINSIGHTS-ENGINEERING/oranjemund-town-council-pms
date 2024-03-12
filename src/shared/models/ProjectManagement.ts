import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export type IProjectStatus = "active" | "on-hold" | "at-risk" | "completed";

export const defaultProject: IProject = {
    id: "",
    projectName: "",
    description: "",
    department: "",
    startDate: "",
    endDate: "",
    actualStartDate: "",
    actualEndDate: "",
    budgetedAmount: 0,
    awardedAmount: 0,
    currency: "NAD",
    status: "active",
    manager: "",
    objectives: "",
    usersId: []
}

export interface IProject {
    id: string;
    projectName: string;
    description: string;
    department: string;
    section?: string | any;
    startDate: string;
    endDate: string;
    actualStartDate: string;
    actualEndDate: string;

    budgetedAmount: number;
    awardedAmount: number;

    currency?: string;
    status: IProjectStatus;
    portfolioId?: string;
    manager: string;
    objectives: string;
    usersId: string[];
    usersNames?: string[];
}

export default class ProjectManagent {
    private project: IProject;

    constructor(private store: AppStore, project: IProject) {
        makeAutoObservable(this);
        this.project = project;
    }

    get asJson(): IProject {
        return toJS(this.project);
    }
}
