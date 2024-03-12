import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export type IRiskStatus = "potential" | "identified" | "resolved"

export type IRiskSeverity = "low" | "medium" | "high"

export const defaultRisk: IProjectRisk = {
    id: "",
    riskName: "",
    description: "",
    logDate: "",
    resolutionDate: "",
    severity: "low",
    status: "identified",
    projectId: "",
    usersId: []
}
export interface IProjectRisk {
    id: string;
    riskName: string;
    description: string;
    logDate: string;
    resolutionDate: string;
    severity: IRiskSeverity;
    status: IRiskStatus;
    objectives?: string;
    projectId: string;
    usersId: string[]
}

export default class ProjectRisk {
    private task: IProjectRisk;

    constructor(private store: AppStore, task: IProjectRisk) {
        makeAutoObservable(this);
        this.task = task;
    }

    get asJson(): IProjectRisk {
        return toJS(this.task);
    }
}