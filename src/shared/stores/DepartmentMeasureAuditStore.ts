import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import MeasureAuditDepartment, {
  IMeasureAuditDepartment,
} from "../models/MeasureAuditDepartment";

export default class DepartmentMeasureAuditStore extends Store<
  IMeasureAuditDepartment,
  MeasureAuditDepartment
> {
  items = new Map<string, MeasureAuditDepartment>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }

  load(items: IMeasureAuditDepartment[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new MeasureAuditDepartment(this.store, item))
      );
    });
  }
}
