import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export interface IProjectLogs {
    id: string;
    uid: string | undefined;
    projectId: string,
    displayName: string | null;
    actions: string;
    time: string;
}

export default class ProjectLogs {
    private _log: IProjectLogs;

    constructor(private store: AppStore, _log: IProjectLogs) {
        makeAutoObservable(this);
        this._log = _log;
    }

    get asJson(): IProjectLogs {
        return toJS(this._log);
    }
}