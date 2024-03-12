import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import Project, { IProject } from "../models/Project";

export default class ProjectStore extends Store<IProject, Project> {
  items = new Map<string, Project>();

  constructor(store: AppStore) {
    super(store);

    this.store = store;
  }

  load(items: IProject[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Project(this.store, item))
      );
    });
  }
}
