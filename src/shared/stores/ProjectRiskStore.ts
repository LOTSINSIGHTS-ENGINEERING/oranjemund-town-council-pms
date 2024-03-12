import { runInAction } from "mobx";
import AppStore from "./AppStore";
import Store from "./Store";
import ProjectRisk, { IProjectRisk } from "../models/ProjectRisks";

export default class ProjectRiskStore extends Store<IProjectRisk, ProjectRisk> {
    items = new Map<string, ProjectRisk>();
    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IProjectRisk[] = []) {
        runInAction(() => {
            items.forEach((item) => {
                this.items.set(item.id, new ProjectRisk(this.store, item))
            })
        });
    }
}
