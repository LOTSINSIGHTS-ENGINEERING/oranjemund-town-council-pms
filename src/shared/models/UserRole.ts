import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultUserRole: IUserRole = {
  id: "",
  roleName: "",
  team: {
    canView: false,
    canModify: false,
  },
};

export interface IAccessType {
  read: boolean;
  readWrite: boolean;
}

export interface IRole {
  canView: boolean;
  canModify: boolean;
}

export interface IUserRole {
  id: string;
  roleName: string;
  team: IRole;
}

export default class UserRole {
  role: IUserRole;

  constructor(private store: AppStore, role: IUserRole) {
    makeAutoObservable(this);
    this.role = role;
  }

  get asJson(): IUserRole {
    return toJS(this.role);
  }
}
