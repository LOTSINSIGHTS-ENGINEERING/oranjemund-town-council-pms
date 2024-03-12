import Store from "./Store";
import AppStore from "./AppStore";
import { makeObservable, runInAction, toJS } from "mobx";
import Objective, { IObjective } from "../models/Objective";
import { ALL_TAB, ITAB_ID } from "../interfaces/IPerspectiveTabs";
import {
  sortAlphabetically,
  sortByPerspective,
} from "../../logged-in/shared/utils/utils";

export default class ObjectiveStore extends Store<IObjective, Objective> {
  perspectiveTab: ITAB_ID = ALL_TAB.id;
  items = new Map<string, Objective>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
    makeObservable(this, {
      perspectiveTab: true,
    });
  }

  load(items: IObjective[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Objective(this.store, item))
      );
    });
  }

  // get all objectives by uid
  getByUid(uid: string) {
    return this.all.filter((item) => item.asJson.uid === uid);
  }

  // get all my objectives
  get allMe() {
    const me = this.store.auth.meJson;
    if (!me) return [];
    return this.getByUid(me.uid); //me.uid
  }

  get all() {
    return Array.from(toJS(this.items.values()))
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      )
      .sort(sortByPerspective);
  }

  setPerspective(tab: ITAB_ID) {
    this.perspectiveTab = tab;
  }

  get perspective() {
    return this.perspectiveTab;
  }
}
