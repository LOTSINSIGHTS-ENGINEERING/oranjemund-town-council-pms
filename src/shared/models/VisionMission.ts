import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultVM: IVisionMission = {
  id: "",
  vision: "",
  mission: "",
};

export interface IVisionMission {
  id: string;
  vision: string;
  mission: string;
}

export default class VisionMission {
  private vm: IVisionMission;

  constructor(private store: AppStore, vm: IVisionMission) {
    makeAutoObservable(this);
    this.vm = vm;
  }

  get asJson(): IVisionMission {
    return toJS(this.vm);
  }
}
