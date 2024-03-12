import AppStore from "./AppStore";
import DepartmentScorecardReviewDraftStore from "./DepartmentScorecardReviewDraftStore";
import DepartmentScorecardReviewQuarter1Store from "./DepartmentScorecardReviewQuarter1Store";
import DepartmentScorecardReviewQuarter2Store from "./DepartmentScorecardReviewQuarter2Store";
import DepartmentScorecardReviewQuarter3Store from "./DepartmentScorecardReviewQuarter3Store";
import DepartmentScorecardReviewQuarter4Store from "./DepartmentScorecardReviewQuarter4Store";

export default class DepartmentScorecardReviewStore {
  draft = new DepartmentScorecardReviewDraftStore(this.store);
  quarter1 = new DepartmentScorecardReviewQuarter1Store(this.store);
  quarter2 = new DepartmentScorecardReviewQuarter2Store(this.store);
  quarter3 = new DepartmentScorecardReviewQuarter3Store(this.store);
  quarter4 = new DepartmentScorecardReviewQuarter4Store(this.store);

  constructor(private store: AppStore) {
    this.draft = new DepartmentScorecardReviewDraftStore(this.store);
    this.quarter1 = new DepartmentScorecardReviewQuarter1Store(this.store);
    this.quarter2 = new DepartmentScorecardReviewQuarter2Store(this.store);
    this.quarter3 = new DepartmentScorecardReviewQuarter3Store(this.store);
    this.quarter4 = new DepartmentScorecardReviewQuarter4Store(this.store);
  }
}
