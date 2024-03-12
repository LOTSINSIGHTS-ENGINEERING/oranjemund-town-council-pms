import { IReviewCycleType } from "../models/ScorecardBatch";

export interface IReviewCycleTab {
  name: IReviewCycleType;
  description: string;
}

export const SCORECARD_TAB: IReviewCycleTab = {
  name: "Scorecard",
  description: "Drafting of performance agreements",
};

export const QUARTER1_TAB: IReviewCycleTab = {
  name: "Q1 Reviews",
  description: "",
};

export const QUARTER2_TAB: IReviewCycleTab = {
  name: "Midterm Reviews",
  description: "",
};

export const QUARTER3_TAB: IReviewCycleTab = {
  name: "Q3 Reviews",
  description: "",
};

export const QUARTER4_TAB: IReviewCycleTab = {
  name: "Assessment",
  description: "",
};
