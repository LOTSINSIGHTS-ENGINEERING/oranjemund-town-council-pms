import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import ObjectiveDepartment, {
  IObjectiveDepartment,
} from "../models/ObjectiveDepartment";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class DepartmentObjectiveStore extends Store<
  IObjectiveDepartment,
  ObjectiveDepartment
> {
  items = new Map<string, ObjectiveDepartment>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IObjectiveDepartment[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new ObjectiveDepartment(this.store, item))
      );
    });
  }

  // get all objectives by department
  getByDepartment(department: string) {
    return this.all
      .filter((item) => item.asJson.department === department)
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      );
  }

  // get all my objectives
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
