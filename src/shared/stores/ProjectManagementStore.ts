import { runInAction } from "mobx";
import AppStore from "./AppStore";
import ProjectManagent, { IProject } from "../models/ProjectManagement";
import Store from "./Store";

export default class ProjectManagementStore extends Store<IProject, ProjectManagent> {
    items = new Map<string, ProjectManagent>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IProject[] = []) {
        runInAction(() => {
            items.forEach((item) => {
                this.items.set(item.id, new ProjectManagent(this.store, item))
            })
        });
    }
}
