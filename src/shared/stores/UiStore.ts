import { makeObservable, runInAction } from "mobx";
import SnackbarStore from "./SnackbarStore";

export default class UiStore {
  title: string = "";
  backButton = false;
  backPath: null | string = null;
  snackbar = new SnackbarStore(this);

  constructor() {
    makeObservable(this, {
      title: true,
      backButton: true,
    });
  }

  setTitle(title: string) {
    runInAction(() => {
      this.title = title;
    });
  }

  showBackButton(path?: string) {
    runInAction(() => {
      this.backButton = true;

      if (path) this.setPath(path);
      else this.setPath(null);
    });
  }

  hideBackButton() {
    runInAction(() => {
      this.backButton = false;
      this.setPath(null);
    });
  }

  private setPath(path: string | null) {
    runInAction(() => {
      this.backPath = path;
    });
  }
}
