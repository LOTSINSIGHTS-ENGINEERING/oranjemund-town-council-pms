import AppStore from "./AppStore";
import { runInAction } from "mobx";
import UploadTaskModel, { IUploadTask } from "../models/UploadTask";
import Store from "./Store";

export default class UploadManagerStore extends Store<
  IUploadTask,
  UploadTaskModel
> {
  items = new Map<string, UploadTaskModel>();
  protected store: AppStore;

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(tasks: IUploadTask[] = []) {
    runInAction(() => {
      tasks.forEach((task) =>
        this.items.set(task.id, new UploadTaskModel(this.store, task))
      );
    });
  }
}
