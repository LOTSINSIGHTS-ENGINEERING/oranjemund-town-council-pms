import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";
import CheckInWeekTask from "./CheckInWeekTask";
import { generateUID } from "../../../logged-in/shared/utils/utils";

export const defaultMilestone: IMilestone = {
    milestoneId: generateUID(),
    milestoneName: "",
    completed: false
}

export interface IMilestone {
    milestoneId: string;
    milestoneName: string;
    completed: boolean;
}

export const defaultCheckInWeek: ICheckInWeek = {
    id: "",
    uid: "",
    weekNumber: "",
    weeklyMilestones: [defaultMilestone],
    weeklyAchievement: "",
    companyValue: "Creativity",
    overallProgress: 0,
    weeklyTotalHours: 40,
    weeklyActualHours: null,
    weeklyUtilazation: 0,
    monthId: "",
    createdOn: Date.now(),
};

export interface ICheckInWeek {
    id: string;
    uid: string;
    monthId: string;
    weekNumber: string;
    weeklyMilestones: IMilestone[];
    weeklyAchievement: string;
    companyValue: string;
    overallProgress: number;
    weeklyUtilazation: number;
    weeklyTotalHours: number;
    weeklyActualHours: number | null;
    createdOn: number;
}

export default class CheckInWeek {
    private checkInWeek: ICheckInWeek;

    constructor(private store: AppStore, checkInWeek: ICheckInWeek) {
        makeAutoObservable(this);
        this.checkInWeek = checkInWeek;
    }

    get asJson(): ICheckInWeek {
        return toJS(this.checkInWeek);
    }

    get tasks(): CheckInWeekTask[] {
        const weekId = this.checkInWeek.id;
        return this.store.checkIn.checkInWeekTask.getByWeekId(weekId);
    }
}
