import CheckInYear, { ICheckInYear } from "../models/check-in-model/CheckInYear";
import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";

export default class CheckInYearStore extends Store<ICheckInYear, CheckInYear> {
  items = new Map<string, CheckInYear>();
  active: ICheckInYear | null = null;

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  // get active year id
  get activeId() {
    return this.active ? this.active.id : null;
  }

  setActive(item: ICheckInYear) {
    runInAction(() => {
      this.active = item;
    });
  }

  clearActive() {
    runInAction(() => {
      this.active = null;
    });
  }

  load(items: ICheckInYear[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new CheckInYear(this.store, item))
      );
    });
  }
}
