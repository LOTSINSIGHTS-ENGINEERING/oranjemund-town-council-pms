import AppStore from "./AppStore";
import CheckInMonthStore from "./CheckInMonthStore";
import CheckInWeekStore from "./CheckInWeekStore";
import CheckInWeekTaskStore from "./CheckInWeekTaskStore";
import CheckInYearStore from "./CheckInYearStore";

export default class CheckInStore {
    checkInYear: CheckInYearStore;
    checkInMonth: CheckInMonthStore;
    checkInWeek: CheckInWeekStore;
    checkInWeekTask: CheckInWeekTaskStore;

    constructor(store: AppStore) {
        this.checkInYear = new CheckInYearStore(store);
        this.checkInMonth = new CheckInMonthStore(store);
        this.checkInWeek = new CheckInWeekStore(store);
        this.checkInWeekTask = new CheckInWeekTaskStore(store);
    }
}