import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";
import { IReviewCycleStatus, IReviewCycleType } from "./ScorecardBatch";

export const defaultScorecardCycleMetadata: IScorecardCycleMetadata = {
  reviewType: "Scorecard",
  status: "pending",
  submittedOn: "",
  reviewedOn: "",
  comments: "",
  isLocked: true,
};

export const defaultScorecardMetadata: IScorecardMetadata = {
  uid: "",
  displayName: "",
  department: "",
  departmentName: "",
  agreementDraft: {
    reviewType: "Scorecard",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter1Review: {
    reviewType: "Q1 Reviews",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter2Review: {
    reviewType: "Midterm Reviews",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter3Review: {
    reviewType: "Q3 Reviews",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  quarter4Review: {
    reviewType: "Assessment",
    status: "pending",
    submittedOn: "",
    reviewedOn: "",
    comments: "",
    isLocked: true,
  },
  jobTitle: "",
  supervisorId: "",
  supervisorName: "",
  role: "",
};

export interface IScorecardCycleMetadata {
  reviewType: IReviewCycleType;
  comments?: string;
  submittedOn: string;
  reviewedOn: string;
  status: IReviewCycleStatus;
  isLocked: boolean;
}

export interface IScorecardMetadata {
  uid: string;
  displayName: string;
  department: string;
  departmentName: string;
  agreementDraft: IScorecardCycleMetadata; // draft
  quarter1Review: IScorecardCycleMetadata; // quarter 1 review
  quarter2Review: IScorecardCycleMetadata; // midterm review
  quarter3Review: IScorecardCycleMetadata; // quarter 3 review
  quarter4Review: IScorecardCycleMetadata;
  jobTitle: string;
  supervisorId: string;
  supervisorName: string;
  role: string; //for separating exco scorecards from employee scorecards on perfornce overview intime
}

export default class ScorecardMetadata {
  private scorecard: IScorecardMetadata;

  constructor(private store: AppStore, scorecard: IScorecardMetadata) {
    makeAutoObservable(this);
    this.scorecard = scorecard;
  }

  get asJson(): IScorecardMetadata {
    return toJS(this.scorecard);
  }
}
