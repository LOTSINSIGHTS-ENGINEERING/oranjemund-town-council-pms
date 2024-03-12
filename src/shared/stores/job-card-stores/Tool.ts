import { makeObservable, runInAction, toJS } from "mobx";
import AppStore from "./../AppStore";
import Store from "./../Store";
import Tool, { ITool} from "../../models/job-card-model/Tool";

export default class ToolStore extends Store<
ITool,
Tool
> {
  items = new Map<string, Tool>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ITool[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new Tool(this.store, item))
      );
    });
  }
}

