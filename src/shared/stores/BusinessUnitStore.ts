import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import BusinessUnit, { IBusinessUnit } from "../models/BusinessUnit";

export default class BusinessUnitStore extends Store<
  IBusinessUnit,
  BusinessUnit
> {
  items = new Map<string, BusinessUnit>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }

  load(items: IBusinessUnit[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new BusinessUnit(this.store, item))
      );
    });
  }
}
