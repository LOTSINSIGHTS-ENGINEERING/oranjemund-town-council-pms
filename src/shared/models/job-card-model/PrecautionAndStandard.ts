import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultPrecaution: IPrecaution = {
  id: "",
  description: "",
};
export interface IPrecaution {
  id: string;
  description: string;
}

export interface IStandard {
  id: string;
  description: string;
}
export const defaultStandard: IStandard = {
  id: "",
  description: "",
};
export class Precaution {
  private precaution: IPrecaution;

  constructor(private store: AppStore, precaution: IPrecaution) {
    makeAutoObservable(this);
    this.precaution = precaution;
  }

  get asJson(): IPrecaution {
    return toJS(this.precaution);
  }
}

export class Standard {
  private standard: IStandard;

  constructor(private store: AppStore, standard: IStandard) {
    makeAutoObservable(this);
    this.standard = standard;
  }

  get asJson(): IStandard {
    return toJS(this.standard);
  }
}
