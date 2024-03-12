import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
import ObjectiveCompany, {
  IObjectiveCompany,
} from "../models/ObjectiveCompany";
import { sortAlphabetically } from "../../logged-in/shared/utils/utils";

export default class CompanyObjectiveStore extends Store<
  IObjectiveCompany,
  ObjectiveCompany
> {
  items = new Map<string, ObjectiveCompany>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }

  load(items: IObjectiveCompany[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new ObjectiveCompany(this.store, item))
      );
    });
  }

  // get all objectives by uid
  getByUid(uid: string) {
    const all = Array.from(this.items.values());
    return all.filter((item) => item.asJson.uid === uid);
  }

  // get all my objectives
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
