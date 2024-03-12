import { makeAutoObservable, toJS } from "mobx";

export interface ISnackbar {
  id: number;
  message: string;
  type: "primary" | "success" | "warning" | "danger" | "default";
  children?: any;
  timeoutInMs?: number;
  isUndoable?: boolean;
}

export default class Snackbar {
  private snackbar: ISnackbar;

  constructor(snackbar: ISnackbar) {
    makeAutoObservable(this);
    this.snackbar = snackbar;
  }

  get asJson(): ISnackbar {
    return toJS(this.snackbar);
  }
}
