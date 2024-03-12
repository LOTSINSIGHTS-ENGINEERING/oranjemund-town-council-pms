import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "../AppStore";
import Store from "../Store";
import Material, { IMaterial } from "../../models/job-card-model/Material";

export default class MaterialStore extends Store<
IMaterial,
Material
> {
  items = new Map<string, Material>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IMaterial[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Material(this.store, item))
      );
    });
  }
}

