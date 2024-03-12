import Store from "./Store";
import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./AppStore";
import User, { IUser } from "../models/User";

export default class UserStore extends Store<IUser, User> {
  items = new Map<string, User>();
  loading: boolean = true;

  constructor(store: AppStore) {
    super(store);
    makeObservable(this, {
      loading: true,
    });
    this.store = store;
  }

  load(items: IUser[]) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.uid, new User(this.store, item))
      );
    });
  }

  get all() {
    // sort by name
    const sortByName = (a: User, b: User) =>
      (a.asJson.displayName || "").localeCompare(b.asJson.displayName || "");

    const values = this.items.values();
    return Array.from(toJS(values)).sort(sortByName);
  }
}
