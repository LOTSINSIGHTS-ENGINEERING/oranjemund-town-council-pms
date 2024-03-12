import { makeObservable, runInAction } from "mobx";

export default class ProjectStatusStore {
  status: string = "start";
  loading: boolean = false;
  progress: number = 0;

  constructor() {
    makeObservable(this, {
      status: true,
      loading: true,
      progress: true
    });
  }

  setStatus(status: string) {
    runInAction(() => {
      this.status = status;
    });
  }

  setProgress(progress: number) {
    runInAction(() => {
      this.progress = progress;
    });
  }

  setLoading(loading: boolean) {
    runInAction(() => {
      this.loading = loading;
    });
  }

}