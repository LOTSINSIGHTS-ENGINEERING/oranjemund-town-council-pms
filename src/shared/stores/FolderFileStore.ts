import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import FolderFile, { IFolderFile } from "../models/FolderFile";

export default class FolderFileStore extends Store<IFolderFile, FolderFile> {
  items = new Map<string, FolderFile>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IFolderFile[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new FolderFile(this.store, item))
      );
    });
  }
}
