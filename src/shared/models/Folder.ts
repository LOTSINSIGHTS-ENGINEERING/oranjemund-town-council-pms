import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultFolder: IFolder = {
  id: "",
  name: "",
  department: "",
  parentId: "root",
  type: "Other",
  path: ["root"],
  createdBy: "",
  createdAt: Date.now(),
};

export interface IFolder {
  id: string;
  name: string;
  parentId: string;
  type: "Root" | "Department" | "User" | "FY" | "Perspective" | "Other";
  department: string;
  path: string[];
  createdBy: string;
  createdAt: number;
}

export default class Folder {
  private folder: IFolder;

  constructor(private store: AppStore, folder: IFolder) {
    makeAutoObservable(this);
    this.folder = folder;
  }

  get asJson(): IFolder {
    return toJS(this.folder);
  }
}
