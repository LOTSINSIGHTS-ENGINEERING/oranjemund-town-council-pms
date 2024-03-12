import Store from "./Store";
import AppStore from "./AppStore";
import { makeObservable, runInAction } from "mobx";
import Measure, { IMeasure } from "../models/Measure";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class MeasureStore extends Store<IMeasure, Measure> {
  items = new Map<string, Measure>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
    makeObservable(this, {
      getByUid: true,
      allMe: true,
    });
  }

  load(items: IMeasure[] = []) {
    runInAction(() => {
      items.forEach((item) => {
        this.items.set(item.id, new Measure(this.store, item));
      });
    });
  }

  get all() {
    return Array.from(this.items.values()).sort((a, b) =>
      sortAlphabetically(a.asJson.description, b.asJson.description)
    );
  }

  // get all measures by uid
  getByUid(uid: string) {
    return this.all
      .filter((item) => item.asJson.uid === uid)
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      );
  }

  // get all my measures
  get allMe() {
    const me = this.store.auth.meJson;
    if (!me) return [];
    return this.getByUid(me.uid); //me.uid
  }
}
