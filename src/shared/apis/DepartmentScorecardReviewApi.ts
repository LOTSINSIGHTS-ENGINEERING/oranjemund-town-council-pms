import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import DepartmentScorecardReviewDraftApi from "./DepartmentScorecardReviewDraftApi";
import DepartmentScorecardReviewQuarter1Api from "./DepartmentScorecardReviewQuarter1Api";
import DepartmentScorecardReviewQuarter2Api from "./DepartmentScorecardReviewQuarter2Api";
import DepartmentScorecardReviewQuarter3Api from "./DepartmentScorecardReviewQuarter3Api";
import DepartmentScorecardReviewQuarter4Api from "./DepartmentScorecardReviewQuarter4Api";

export default class DepartmentScorecardReviewApi {
  draft: DepartmentScorecardReviewDraftApi;
  quarter1: DepartmentScorecardReviewQuarter1Api;
  quarter2: DepartmentScorecardReviewQuarter2Api;
  quarter3: DepartmentScorecardReviewQuarter3Api;
  quarter4: DepartmentScorecardReviewQuarter4Api;

  constructor(private api: AppApi, private store: AppStore) {
    this.draft = new DepartmentScorecardReviewDraftApi(this.api, this.store);
    this.quarter1 = new DepartmentScorecardReviewQuarter1Api(
      this.api,
      this.store
    );
    this.quarter2 = new DepartmentScorecardReviewQuarter2Api(
      this.api,
      this.store
    );
    this.quarter3 = new DepartmentScorecardReviewQuarter3Api(
      this.api,
      this.store
    );
    this.quarter4 = new DepartmentScorecardReviewQuarter4Api(
      this.api,
      this.store
    );
  }
}
