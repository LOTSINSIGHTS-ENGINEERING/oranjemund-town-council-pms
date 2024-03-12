import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";
import GeneralTask, { IGeneralTask } from "../models/GeneralTasks";

export default class GeneralTaskStore extends Store<IGeneralTask, GeneralTask> {
  items = new Map<string, GeneralTask>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IGeneralTask[] = []) {
    runInAction(() => {
      items.forEach((item) => {
        this.items.set(item.id, new GeneralTask(this.store, item));
      });
    });
  }


  getByUid(uid: string) {
    const all = Array.from(this.items.values());
    return all
      .filter((item) => item.asJson.uid === uid)
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      );
  }

  getByDate(date: string) {
    const all = Array.from(this.items.values());
    const measures = all
      .filter((item) => item.asJson.startDate === date)
      .sort((a, b) =>
        sortAlphabetically(a.asJson.description, b.asJson.description)
      );
    return measures;
  }

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
