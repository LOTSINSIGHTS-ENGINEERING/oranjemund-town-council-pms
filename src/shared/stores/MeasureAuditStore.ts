import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
import MeasureAudit, { IMeasureAudit } from "../models/MeasureAudit";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class MeasureAuditStore extends Store<
  IMeasureAudit,
  MeasureAudit
> {
  items = new Map<string, MeasureAudit>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }

  load(items: IMeasureAudit[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new MeasureAudit(this.store, item))
      );
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
