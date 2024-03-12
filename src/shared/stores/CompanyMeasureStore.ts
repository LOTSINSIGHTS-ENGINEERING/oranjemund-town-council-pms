import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
import MeasureCompany, { IMeasureCompany } from "../models/MeasureCompany";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class CompanyMeasureStore extends Store<
  IMeasureCompany,
  MeasureCompany
> {
  items = new Map<string, MeasureCompany>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }

  load(items: IMeasureCompany[] = []) {
    runInAction(() => {
      items.forEach((item) => {
        if (item.dataType === "Date") item.annualActual = Date.now(); // for date measures set actual to today
        this.items.set(item.id, new MeasureCompany(this.store, item));
      });
    });
  }

  // get all measures by uid
  getByUid(uid: string) {
    const all = Array.from(this.items.values());
    return all.filter((item) => item.asJson.uid === uid);
  }

  // get all my measures
  get allMe() {
    const me = this.store.auth.meJson;
    if (!me) return [];

    return this.getByUid(me.uid);
  }

  get all() {
    return Array.from(toJS(this.items.values())).sort((a, b) =>
      sortAlphabetically(a.asJson.description, b.asJson.description)
    );
  }
}
