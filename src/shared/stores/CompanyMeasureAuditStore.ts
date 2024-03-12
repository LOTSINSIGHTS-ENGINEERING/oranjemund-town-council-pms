import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import MeasureAuditCompany, {
  IMeasureAuditCompany,
} from "../models/MeasureAuditCompany";

export default class CompanyMeasureAuditStore extends Store<
  IMeasureAuditCompany,
  MeasureAuditCompany
> {
  items = new Map<string, MeasureAuditCompany>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }

  load(items: IMeasureAuditCompany[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new MeasureAuditCompany(this.store, item))
      );
    });
  }
}
