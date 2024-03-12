import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultCheckInMonth: ICheckInMonth = {
    id: "",
    yearId: "",
    monthName: "",
    active: false,
    createdAt: Date.now(),
    startingDate: Date.now(),
    endingDate: Date.now(),
};

export interface ICheckInMonth {
    id: string;
    yearId: string;
    monthName: string;
    active: boolean;
    createdAt: number;
    startingDate: number;
    endingDate: number;
}

export default class CheckInMonth {
    private checkInMonth: ICheckInMonth;

    constructor(private store: AppStore, checkInMonth: ICheckInMonth) {
        makeAutoObservable(this);
        this.checkInMonth = checkInMonth;
    }

    get asJson(): ICheckInMonth {
        return toJS(this.checkInMonth);
    }
}
