import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import CheckInMonth, { ICheckInMonth } from "../models/check-in-model/CheckInMonth";

export default class CheckInMonthStore extends Store<ICheckInMonth, CheckInMonth> {
  items = new Map<string, CheckInMonth>();
  active: ICheckInMonth | null = null;

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  // get active month id
  get activeId() {
    return this.active ? this.active.id : null;
  }

  setActive(item: ICheckInMonth) {
    runInAction(() => {
      this.active = item;
    });
  }

  clearActive() {
    runInAction(() => {
      this.active = null;
    });
  }

  load(items: ICheckInMonth[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new CheckInMonth(this.store, item))
      );
    });
  }
}
