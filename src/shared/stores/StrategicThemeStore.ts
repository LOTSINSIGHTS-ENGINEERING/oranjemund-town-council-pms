import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import StrategicTheme, { IStrategicTheme } from "../models/StrategicTheme";

export default class StrategicThemeStore extends Store<
  IStrategicTheme,
  StrategicTheme
> {
  items = new Map<string, StrategicTheme>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IStrategicTheme[] = []) {
    runInAction(() => {
      items.forEach((item) => {
        this.items.set(item.id, new StrategicTheme(this.store, item));
      });
    });
  }
}
