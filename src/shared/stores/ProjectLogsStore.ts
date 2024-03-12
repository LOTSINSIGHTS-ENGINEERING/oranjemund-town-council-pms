import { makeObservable, runInAction } from "mobx";
import ProjectLogs, { IProjectLogs } from "../models/ProjectLogs";
import AppStore from "./AppStore";
import Store from "./Store";

export default class ProjectLogsStore extends Store<IProjectLogs, ProjectLogs> {
    items = new Map<string, ProjectLogs>();
    selectedMID: string = ""; //slected milestone ID

    constructor(store: AppStore) {
        super(store);
        this.store = store;

        makeObservable(this, {
            selectedMID: true
        })
    }

    selectMID(mid: string) {
        runInAction(() => {
            this.selectedMID = mid;
        })
    }

    load(items: any) {
        runInAction(() => {
            items.forEach((item: any) => {
                this.items.set(item.id, new ProjectLogs(this.store, item))
            })
        });
    }
}
