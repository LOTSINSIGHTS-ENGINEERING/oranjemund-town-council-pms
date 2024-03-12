import Store from "./Store";
import AppStore from "./AppStore";
import { makeObservable, runInAction } from "mobx";
import MeasureDepartment, {
  IMeasureDepartment,
} from "../models/MeasureDepartment";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class DepartmentMeasureStore extends Store<
  IMeasureDepartment,
  MeasureDepartment
> {
  items = new Map<string, MeasureDepartment>();

  constructor(store: AppStore) {
    super(store);
    makeObservable(this, {
      getByDepartment: true,
      allMeDepartment: true,
    });
    this.store = store;
  }

  load(items: IMeasureDepartment[] = []) {
    runInAction(() => {
      items.forEach((item) => {
        if (item.dataType === "Date") item.annualActual = Date.now(); // for date measures set actual to today
        this.items.set(item.id, new MeasureDepartment(this.store, item));
      });
    });
  }

  // get all measures by uid
  getByDepartment(department: string) {
    return this.all
      .filter((item) => item.asJson.department === department)
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      );
  }

  // get all my measures
  get allMeDepartment() {
    const me = this.store.auth.meJson;
    if (!me) return [];

    return this.getByDepartment(me.department);
  }

  get all() {
    return Array.from(this.items.values()).sort((a, b) =>
      sortAlphabetically(a.asJson.description, b.asJson.description)
    );
  }
}
