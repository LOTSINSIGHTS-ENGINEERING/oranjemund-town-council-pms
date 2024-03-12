import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "../AppStore";
import Store from "../Store";
import Labour, { ILabour } from "../../models/job-card-model/Labour";

export default class LabourStore extends Store<
ILabour,
Labour
> {
  items = new Map<string, Labour
  >();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ILabour[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Labour
            (this.store, item))
      );
    });
  }
}

