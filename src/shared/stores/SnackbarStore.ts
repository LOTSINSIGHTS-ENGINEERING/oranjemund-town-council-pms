import { makeObservable, runInAction } from "mobx";
import Snackbar, { ISnackbar } from "../models/Snackbar";
import UiStore from "./UiStore";

export default class SnackbarStore {
  protected store: UiStore;
  items = new Map<number, Snackbar>();

  constructor(store: UiStore) {
    makeObservable(this, {
      items: true,
    });
    this.store = store;
  }

  load(snack: ISnackbar) {
    runInAction(() => {
      this.items.set(snack.id, new Snackbar(snack));
    });
  }

  remove(id: number) {
    runInAction(() => {
      if (this.items.has(id)) this.items.delete(id);
    });
  }

  get snackbars() {
    return Array.from(this.items.values());
  }
}
