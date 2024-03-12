import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import CheckInWeek, { ICheckInWeek } from "../models/check-in-model/CheckInWeek";

export default class CheckInWeekStore extends Store<ICheckInWeek, CheckInWeek> {
  items = new Map<string, CheckInWeek>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ICheckInWeek[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new CheckInWeek(this.store, item))
      );
    });
  }

  // get all weeks by uid
  getByUid(uid: string) {
    return this.all.filter((item) => item.asJson.uid === uid).sort((a, b) => b.asJson.weekNumber.localeCompare(a.asJson.weekNumber))
  }
  // get all my weeks
  get allMe() {
    const me = this.store.auth.meJson;
    if (!me) return [];
    return this.getByUid(me.uid); //me.uid
  }
}
