import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultCheckInYear: ICheckInYear = {
    id: "",
    yearName: "",
    active: false,
    createdAt: Date.now(),
};

export interface ICheckInYear {
    id: string;
    yearName: string;
    active: boolean;
    createdAt: number;
}

export default class CheckInYear {
    private checkInYear: ICheckInYear;

    constructor(private store: AppStore, checkInYear: ICheckInYear) {
        makeAutoObservable(this);
        this.checkInYear = checkInYear;
    }

    get asJson(): ICheckInYear {
        return toJS(this.checkInYear);
    }
}
