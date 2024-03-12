import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultTheme: ITheme = {
  id: "",
  description: "",
};

export interface ITheme {
  id: string;
  description: string;
}

export default class Theme {
  private theme: ITheme;

  constructor(private store: AppStore, theme: ITheme) {
    makeAutoObservable(this);
    this.theme = theme;
  }

  get asJson(): ITheme {
    return toJS(this.theme);
  }
}
