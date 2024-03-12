import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";
import { IMeasure } from "./Measure";
import { IMeasureAudit } from "./MeasureAudit";
import { IMeasureAuditCompany } from "./MeasureAuditCompany";
import { IMeasureAuditDepartment } from "./MeasureAuditDepartment";
import { IMeasureCompany } from "./MeasureCompany";
import { IMeasureDepartment } from "./MeasureDepartment";
import { IObjective } from "./Objective";

export const defaultReview: IScorecardReview = {
  uid: "",
  displayName: "",
  reviewerDisplayName: "",
  reviewerUid: "",
  objectives: [],
  measures: [],
  measureAudits: [],
  isLocked: false,
};

export interface IScorecardReview {
  uid: string;
  displayName: string | null;
  reviewerUid: string;
  reviewerDisplayName: string | null;
  objectives: IObjective[];
  measures: IMeasure[] | IMeasureDepartment[] | IMeasureCompany[];
  measureAudits:
    | IMeasureAudit[]
    | IMeasureAuditDepartment[]
    | IMeasureAuditCompany[];
  isLocked: boolean;
}

export default class ScorecardReview {
  private review: IScorecardReview;
  constructor(private store: AppStore, review: IScorecardReview) {
    makeAutoObservable(this);
    this.review = review;
  }
  get asJson(): IScorecardReview {
    return toJS(this.review);
  }
  get objectives(): IObjective[] {
    return toJS(this.asJson.objectives);
  }
  get measures(): IMeasure[] | IMeasureDepartment[] | IMeasureCompany[] {
    return toJS(this.asJson.measures);
  }
  get measureAudits():
    | IMeasureAudit[]
    | IMeasureAuditDepartment[]
    | IMeasureAuditCompany[] {
    return toJS(this.asJson.measureAudits);
  }
}
