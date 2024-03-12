import AppStore from "./AppStore";
import { makeObservable, runInAction } from "mobx";
import UserPerformanceData, { IUserPerformanceData } from "../models/Report";

export default class ReportStore {
  protected store: AppStore;

  userPerformanceData = new Map<string, UserPerformanceData>();

  constructor(store: AppStore) {
    this.store = store;

    makeObservable(this, {
      userPerformanceData: true,
    });
  }

  loadUserPerformanceData(items: IUserPerformanceData[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.userPerformanceData.set(
          item.uid,
          new UserPerformanceData(this.store, item)
        )
      );
    });
  }

  get allUserPerformanceData() {
    return Array.from(this.userPerformanceData.values());
  }

  //
}
