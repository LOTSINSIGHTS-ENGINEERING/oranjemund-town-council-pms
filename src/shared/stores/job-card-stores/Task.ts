import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./../AppStore";
import Store from "./../Store";
import { ITask } from "../../models/job-card-model/Task";
import Task from "../../models/job-card-model/Task";

export default class TaskStore extends Store<
ITask,
Task
> {
  items = new Map<string, Task>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ITask[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Task(this.store, item))
      );
    });
  }
}


