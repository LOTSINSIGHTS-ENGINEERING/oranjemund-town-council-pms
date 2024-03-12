import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import CheckInWeekTask, { ICheckInWeekTask } from "../models/check-in-model/CheckInWeekTask";

export default class CheckInWeekTaskStore extends Store<ICheckInWeekTask, CheckInWeekTask> {
  items = new Map<string, CheckInWeekTask>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ICheckInWeekTask[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new CheckInWeekTask(this.store, item))
      );
    });
  }

  getByWeekId(weekId: string) {
    return this.all.filter((item) => item.asJson.weekId === weekId)
  }
}
