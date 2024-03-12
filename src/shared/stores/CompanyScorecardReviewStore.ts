import AppStore from "./AppStore";
import CompanyScorecardReviewDraftStore from "./CompanyScorecardReviewDraftStore";
import CompanyScorecardReviewQuarter1Store from "./CompanyScorecardReviewQuarter1Store";
import CompanyScorecardReviewQuarter2Store from "./CompanyScorecardReviewQuarter2Store";
import CompanyScorecardReviewQuarter3Store from "./CompanyScorecardReviewQuarter3Store";
import CompanyScorecardReviewQuarter4Store from "./CompanyScorecardReviewQuarter4Store";

export default class CompanyScorecardReviewStore {
  draft = new CompanyScorecardReviewDraftStore(this.store);
  quarter1 = new CompanyScorecardReviewQuarter1Store(this.store);
  quarter2 = new CompanyScorecardReviewQuarter2Store(this.store);
  quarter3 = new CompanyScorecardReviewQuarter3Store(this.store);
  quarter4 = new CompanyScorecardReviewQuarter4Store(this.store);

  constructor(private store: AppStore) {
    this.draft = new CompanyScorecardReviewDraftStore(this.store);
    this.quarter1 = new CompanyScorecardReviewQuarter1Store(this.store);
    this.quarter2 = new CompanyScorecardReviewQuarter2Store(this.store);
    this.quarter3 = new CompanyScorecardReviewQuarter3Store(this.store);
    this.quarter4 = new CompanyScorecardReviewQuarter4Store(this.store);
  }
}
