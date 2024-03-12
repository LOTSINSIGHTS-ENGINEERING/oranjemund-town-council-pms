import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import CheckInYearApi from "./CheckInYearApi";
import CheckInMonthApi from "./CheckInMonthApi";
import CheckInWeekApi from "./CheckInWeekApi";
import CheckInWeekTaskApi from "./CheckInWeekTaskApi";

export default class CheckInApi {

    checkInYear: CheckInYearApi;
    checkInMonth: CheckInMonthApi;
    checkInWeek: CheckInWeekApi;
    checkInWeekTask: CheckInWeekTaskApi;

    constructor(api: AppApi, store: AppStore) {
        this.checkInYear = new CheckInYearApi(api, store);
        this.checkInMonth = new CheckInMonthApi(api, store);
        this.checkInWeek = new CheckInWeekApi(api, store);
        this.checkInWeekTask = new CheckInWeekTaskApi(api, store);
    }
}
