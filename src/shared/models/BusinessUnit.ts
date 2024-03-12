import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultBusinessUnit: IBusinessUnit = {
  id: "",
  name: "",
};

export interface IBusinessUnit {
  id: string;
  name: string;
}

export default class BusinessUnit {
  private BU: IBusinessUnit;

  constructor(private store: AppStore, BU: IBusinessUnit) {
    makeAutoObservable(this);
    this.BU = BU;
  }

  get asJson(): IBusinessUnit {
    return toJS(this.BU);
  }
}
