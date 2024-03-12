import { UploadTask } from "firebase/storage";
import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export interface IUploadTask {
  id: string;
  fileName: string;
  fileExtension: string;
  task: UploadTask;
}

export default class UploadTaskModel {
  private uploadTask: IUploadTask;

  constructor(private store: AppStore, uploadTask: IUploadTask) {
    makeAutoObservable(this);
    this.uploadTask = uploadTask;
  }

  get asJson(): IUploadTask {
    return toJS(this.uploadTask);
  }
}
