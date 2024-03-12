import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "../AppStore";
import Store from "../Store";
import Client, { IClient } from "../../models/job-card-model/Client";

export default class ClientStore extends Store<
IClient,
Client
> {
  items = new Map<string, Client
  >();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IClient[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Client
            (this.store, item))
      );
    });
  }
}

