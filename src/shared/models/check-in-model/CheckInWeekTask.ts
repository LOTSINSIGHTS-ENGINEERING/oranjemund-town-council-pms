import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export type IWeeklyTaskType = "elephant" | "horse" | "rabbit"
export type IWeeklyTaskStatus = "todo" | "in-review" | "done"

export const defaultWeekTask: ICheckInWeekTask = {
    id: "",
    weekId: "",
    monthId: "",
    uid: "",
    taskName: "",
    taskDescription: "",
    taskStatus: "todo",
    taskType: "elephant",
    allocatedTime: 0,
    taskAchievement: "",
    companyObjective: "",
    departmentObjective: "",
    projectName: "",
    projectId: "",
    milestoneId: ""
}

export interface ICheckInWeekTask {
    id: string;
    weekId: string;
    monthId: string;
    uid: string,
    taskName: string;
    taskDescription: string;
    taskStatus: IWeeklyTaskStatus;
    taskType: IWeeklyTaskType;
    allocatedTime: number;
    taskAchievement: string;
    companyObjective: string;
    departmentObjective: string;
    projectName: string;
    projectId: string;
    milestoneId: string;
}

export default class CheckInWeekTask {
    private checkInWeekTask: ICheckInWeekTask;

    constructor(private store: AppStore, checkInWeekTask: ICheckInWeekTask) {
        makeAutoObservable(this);
        this.checkInWeekTask = checkInWeekTask;
    }

    get asJson(): ICheckInWeekTask {
        return toJS(this.checkInWeekTask);
    }
}
