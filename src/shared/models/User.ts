import { makeAutoObservable, runInAction, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultUser: IUser = {
  uid: "",
  firstName: "",
  lastName: "",
  email: "",
  displayName: "",
  phoneNumber: "",
  emailVerified: false,
  userVerified: false,
  isAnonymous: false,
  photoURL: "",
  createdAt: "",
  lastLoginAt: "",
  jobTitle: null,
  department: "",
  supervisor: "none",
  role: "Employee",
  disabled: false,
};

export interface IUser {
  uid: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  email: string;
  phoneNumber: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  userVerified: boolean;
  isAnonymous: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
  department: string;
  supervisor: string;
  role: string;
  jobTitle: string | null;
  devUser?: boolean;
  disabled?: boolean;
}

export default class User {
  // Private properties should start wtih an underscore.
  private _user: IUser;
  private _subordinates = new Map<string, User>();

  constructor(private store: AppStore, user: IUser) {
    makeAutoObservable(this);
    this._user = user;
  }

  get asJson(): IUser {
    return toJS(this._user);
  }

  private findSubordinates(uid?: string) {
    // Avoid user reporting to themselve error
    if (uid === this.asJson.uid) return;

    // Get subordinates
    const users = this.store.user.all;
    const subs = uid
      ? users.filter((u) => u.asJson.supervisor === uid)
      : users.filter((u) => u.asJson.supervisor === this._user.uid);

    this.updateSubordinates(subs);
    subs.forEach((u) => this.findSubordinates(u.asJson.uid));
  }

  private updateSubordinates(items: User[]) {
    runInAction(() => {
      items.forEach((item) => this._subordinates.set(item.asJson.uid, item));
    });
  }

  get subordinates() {
    this.findSubordinates();
    return Array.from(this._subordinates.values());
  }

  get supervisor() {
    return this.store.user.getById(this._user.supervisor);
  }

  get department() {
    return this.store.department.getById(this._user.department);
  }

  // Maybe not important
  get objectives() {
    const uid = this._user.uid;
    return this.store.objective.getByUid(uid);
  }
}
