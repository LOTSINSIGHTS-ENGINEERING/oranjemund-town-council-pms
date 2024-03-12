import { runInAction } from "mobx";
import AppStore from "./AppStore";
import Store from "./Store";
import Portfolio, { IPortfolio } from "../models/Portfolio";

export default class PortfolioStore extends Store<IPortfolio, Portfolio> {
    items = new Map<string, Portfolio>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: any) {
        runInAction(() => {
            items.forEach((item: any) => {
                this.items.set(item.id, new Portfolio(this.store, item))
            })
        });
    }
}
