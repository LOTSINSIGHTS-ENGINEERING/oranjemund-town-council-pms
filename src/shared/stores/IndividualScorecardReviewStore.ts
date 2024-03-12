import AppStore from "./AppStore";
import IndividualScorecardReviewDraftStore from "./IndividualScorecardReviewDraftStore";
import IndividualScorecardReviewQuarter2Store from "./IndividualScorecardReviewQuarter2Store";
import IndividualScorecardReviewQuarter4Store from "./IndividualScorecardReviewQuarter4Store";

export default class IndividualScorecardReviewStore {
  draft = new IndividualScorecardReviewDraftStore(this.store);
  quarter2 = new IndividualScorecardReviewQuarter2Store(this.store);
  quarter4 = new IndividualScorecardReviewQuarter4Store(this.store);

  constructor(private store: AppStore) {
    this.draft = new IndividualScorecardReviewDraftStore(this.store);
    this.quarter2 = new IndividualScorecardReviewQuarter2Store(this.store);
    this.quarter4 = new IndividualScorecardReviewQuarter4Store(this.store);
  }
}
