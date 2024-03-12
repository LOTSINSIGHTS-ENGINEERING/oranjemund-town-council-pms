import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./AppStore";
import Store from "./Store";
import ProjectTask, { IProjectTask } from "../models/ProjectTasks";

export default class ProjectTaskStore extends Store<IProjectTask, ProjectTask> {
    items = new Map<string, ProjectTask>();
    selectedMID: string = ""; //slected milestone ID

    constructor(store: AppStore) {
        super(store);
        this.store = store;

        makeObservable(this, {
            selectedMID: true
        })
    }

    selectMID(milestoneId: string) {
        runInAction(() => {
            this.selectedMID = milestoneId;
        })
    }


    getDependenciesById(id: string) {
        const tasks = Array.from(toJS(this.items.values()))
            .map(t => ({ milestoneId: t.asJson.milestoneId, id: t.asJson.id })).filter((t) => t.milestoneId === id).map(t => t.id);
        return tasks;
    }

    load(items: IProjectTask[] = []) {
        runInAction(() => {
            items.forEach((item) => {
                this.items.set(item.id, new ProjectTask(this.store, item))
            })
        });
    }
}
