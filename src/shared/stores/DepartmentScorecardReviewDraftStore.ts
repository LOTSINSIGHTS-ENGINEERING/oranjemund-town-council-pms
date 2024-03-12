import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import ScorecardReview, { IScorecardReview } from "../models/ScorecardReview";

export default class DepartmentScorecardReviewDraftStore extends Store<
  IScorecardReview,
  ScorecardReview
> {
  items = new Map<string, ScorecardReview>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IScorecardReview[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.uid, new ScorecardReview(this.store, item))
      );
    });
  }

  getById(id: string) {
    return this.items.get(id);
  }
}
