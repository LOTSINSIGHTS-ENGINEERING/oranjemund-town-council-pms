import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "../AppStore";
import Store from "../Store";
import { IPrecaution, Precaution } from "../../models/job-card-model/PrecautionAndStandard";

export default class PrecautionStore extends Store<
IPrecaution,
Precaution
> {
  items = new Map<string, Precaution>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IPrecaution[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Precaution(this.store, item))
      );
    });
  }
}

