import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultStrategicTheme: IStrategicTheme = {
  id: "",
  scorecard: "",
  description: "",
  orderNo: 0,
};

export interface IStrategicTheme {
  id: string;
  scorecard: string;
  description: string;
  orderNo: number;
}

export default class StrategicTheme {
  private strategicTheme: IStrategicTheme;

  constructor(private store: AppStore, strategicTheme: IStrategicTheme) {
    makeAutoObservable(this);
    this.strategicTheme = strategicTheme;
  }

  get asJson(): IStrategicTheme {
    return toJS(this.strategicTheme);
  }
}
