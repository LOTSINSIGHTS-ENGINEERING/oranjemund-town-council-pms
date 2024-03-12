import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

const timestamp = new Date().getTime();
var c = new Date(timestamp);
const recordTime =
  c.getHours() + ":" + c.getMinutes() + ", " + c.toDateString();

export const defaultAudit: IAudit = {
  timestamp: 0,
  id: "",
  action: "",
  uid: "",
  userName: "",
};

export interface IAudit {
  id: string;
  action: string;
  timestamp: 0;
  uid: string;
  userName: string;
}

export default class Audit {
  private audit: IAudit;

  constructor(private store: AppStore, audit: IAudit) {
    makeAutoObservable(this);
    this.audit = audit;
  }

  get asJson(): IAudit {
    return toJS(this.audit);
  }
}
