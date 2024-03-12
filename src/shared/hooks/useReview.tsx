import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import { IReviewCycleType } from "../models/ScorecardBatch";
import { IScorecardReview } from "../models/ScorecardReview";

const useReview = (
  cycle: IReviewCycleType,
  uid?: string
): IScorecardReview | undefined => {
  const { api, store } = useAppContext();
  const draftApi = api.individualScorecardReview.draft;
  const midtermApi = api.individualScorecardReview.quarter2;
  const asssessmentApi = api.individualScorecardReview.quarter4;

  const [review, setReview] = useState<IScorecardReview>();
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current || !uid) return;
    firstRender.current = false;

    // load data scorecard from db
    const loadAll = async (uid: string) => {
      try {
        await draftApi.getByUid(uid); // Load Draft
        await midtermApi.getByUid(uid); // Load Draft
        await asssessmentApi.getByUid(uid); // Load Draft
      } catch (error) {
        console.log(error);
      }
    };

    loadAll(uid);
  }, [asssessmentApi, draftApi, midtermApi, uid]);

  // Get the review
  useEffect(() => {
    if (!uid) return;

    let _review;

    switch (cycle) {
      case "Scorecard":
        _review = store.individualScorecardReview.draft.getById(uid);
        break;
      case "Midterm Reviews":
        _review = store.individualScorecardReview.quarter2.getById(uid);
        break;
      case "Assessment":
        _review = store.individualScorecardReview.quarter4.getById(uid);
        break;
      default:
        _review = undefined;
        break;
    }

    if (_review) {
      setReview(_review.asJson);
    } else {
      setReview(undefined); // no data yet
    }
  }, [
    cycle,
    store.individualScorecardReview.draft,
    store.individualScorecardReview.quarter2,
    store.individualScorecardReview.quarter4,
    uid,
  ]);

  return review;
};

export default useReview;
