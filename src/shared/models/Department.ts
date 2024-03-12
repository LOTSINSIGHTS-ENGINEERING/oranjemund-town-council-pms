import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultDepartment: IDepartment = {
  id: "",
  name: "",
  businessUnit: "",
};

export interface IDepartment {
  id: string;
  name: string;
  businessUnit: string;
}

export default class Department {
  private department: IDepartment;

  constructor(private store: AppStore, department: IDepartment) {
    makeAutoObservable(this);
    this.department = department;
  }

  get asJson(): IDepartment {
    return toJS(this.department);
  }
}
