import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "../AppStore";
import Store from "../Store";
import { IStandard, Standard } from "../../models/job-card-model/PrecautionAndStandard";

export default class StandardStore extends Store<
IStandard,
Standard
> {
  items = new Map<string, Standard>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IStandard[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Standard(this.store, item))
      );
    });
  }
}

