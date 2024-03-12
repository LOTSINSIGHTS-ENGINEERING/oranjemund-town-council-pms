import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "../AppStore";
import Store from "../Store";
import JobCardModel, { IJobCard } from "../../models/job-card-model/Jobcard";

export default class JobStore extends Store<
IJobCard,
JobCardModel
> {
  items = new Map<string, JobCardModel
  >();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IJobCard[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new JobCardModel
            (this.store, item))
      );
    });
  }
}

