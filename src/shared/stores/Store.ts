import { has, makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./AppStore";

export default abstract class Store<Type, Model> {
  items = new Map<string, Model>();
  selected: Type | null = null;
  protected store: AppStore;

  constructor(store: AppStore) {
    this.store = store;

    makeObservable(this, {
      items: true,
      selected: true,
      all: true,
      isEmpty: true,
      getById: true,
    });
  }

  load(items: Type[] = []) {}

  remove(id: string) {
    runInAction(() => {
      if (toJS(this.items.has(id))) this.items.delete(id);
    });
  }

  removeAll() {
    runInAction(() => {
      this.items.clear();
    });
  }

  getById(id: string) {
    const item = this.items.get(id);

    if (toJS(item)) return item;
    return undefined;
  }

  exists(id: string) {
    return toJS(has(this.items, id));
  }

  // added for project management
  getItemById(id: string) {
    const item = this.items.get(id);
    if (toJS(item)) return item;
    return undefined;
  }

  get all() {
    const values = this.items.values();
    return Array.from(toJS(values));
  }

  get isEmpty() {
    return toJS(this.items.size) === 0;
  }

  select(item: Type) {
    runInAction(() => {
      this.selected = item;
    });
  }

  clearSelected() {
    runInAction(() => {
      this.selected = null;
    });
  }
}
