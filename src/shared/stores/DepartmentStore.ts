import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import Department, { IDepartment } from "../models/Department";

export default class DepartmentStore extends Store<IDepartment, Department> {
  items = new Map<string, Department>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IDepartment[]) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Department(this.store, item))
      );
    });
  }
}
