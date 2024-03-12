import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import ScorecardMetadata, {
  IScorecardMetadata,
} from "../models/ScorecardMetadata";

export default class CompanyScorecardMetadataStore extends Store<
  IScorecardMetadata,
  ScorecardMetadata
> {
  items = new Map<string, ScorecardMetadata>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IScorecardMetadata[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.uid, new ScorecardMetadata(this.store, item))
      );
    });
  }
}
