import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./../AppStore";
import Store from "./../Store";
import OtherExpense, { IOtherExpense } from "../../models/job-card-model/OtherExpense";

export default class OtherExpenseStore extends Store<
IOtherExpense,
OtherExpense
> {
  items = new Map<string, OtherExpense>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IOtherExpense[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new OtherExpense(this.store, item))
      );
    });
  }
}

