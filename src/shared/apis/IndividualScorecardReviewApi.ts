import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import IndividualScorecardReviewDraftApi from "./IndividualScorecardReviewDraftApi";
import IndividualScorecardReviewQuarter2Api from "./IndividualScorecardReviewQuarter2Api";
import IndividualScorecardReviewQuarter4Api from "./IndividualScorecardReviewQuarter4Api";

export default class IndividualScorecardReviewApi {
  draft: IndividualScorecardReviewDraftApi;
  quarter2: IndividualScorecardReviewQuarter2Api;
  quarter4: IndividualScorecardReviewQuarter4Api;

  constructor(private api: AppApi, private store: AppStore) {
    this.draft = new IndividualScorecardReviewDraftApi(this.api, this.store);
    this.quarter2 = new IndividualScorecardReviewQuarter2Api(
      this.api,
      this.store
    );
    this.quarter4 = new IndividualScorecardReviewQuarter4Api(
      this.api,
      this.store
    );
  }
}
