import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultFolderFile: IFolderFile = {
  id: "",
  name: "File",
  folderId: "root",
  url: "",
  extension: "unknown",
  createdBy: "",
  createdAt: Date.now(),
};

export interface IFolderFile {
  id: string;
  name: string;
  folderId: string;
  url: string;
  extension: string;
  createdBy: string;
  createdAt: number;
}

export default class FolderFile {
  private FolderFile: IFolderFile;

  constructor(private store: AppStore, FolderFile: IFolderFile) {
    makeAutoObservable(this);
    this.FolderFile = FolderFile;
  }

  get asJson(): IFolderFile {
    return toJS(this.FolderFile);
  }
}
