import { observer } from "mobx-react-lite";
import { Fragment, useCallback, useEffect, useState } from "react";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import useTitle from "../../../shared/hooks/useTitle";
import { IScorecardBatch } from "../../../shared/models/ScorecardBatch";
import EmptyError from "../../admin-settings/EmptyError";
import MODAL_NAMES from "../ModalName";
import ScorecardItem from "./ScorecardItem";

const ScorecardModal = observer(() => {
  const { api, store } = useAppContext();
  const [title, setTitle] = useTitle();
  const [loading, setLoading] = useState(false);

  const onSelect = (scorecard: IScorecardBatch) => {
    // remove all the meaures & objectives
    store.measure.removeAll();
    store.objective.removeAll();

    // set title of active
    setTitle(`My Scorecard: ${scorecard.description}`);
    // set active scorecard
    store.scorecard.setActive(scorecard);
  };

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.EXECUTION.SCORECARD_MODAL);
  };

  // load scorecard batch from db
  const loadAll = useCallback(async () => {
    setLoading(true); // start loading
    try {
      await api.scorecard.getAll();
    } catch (error) {
      console.log("Failed to load scorecard batch> Error: ", error);
    }
    setLoading(false); // stop loading
  }, [api.scorecard]);

  useEffect(() => {
    loadAll();

    return () => { };
  }, [loadAll]);

  return (
    <div className="scorecard-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Past Scorecards</h3>

      <div className="dialog-content uk-position-relative">
        {!loading &&
          store.scorecard.all.map((batch) => (
            <Fragment key={batch.asJson.id}>
              <ScorecardItem
                activeScorecard={store.scorecard.active}
                scorecard={batch.asJson}
                onSelect={onSelect}
              />
            </Fragment>
          ))}

        {/* Empty & not loading */}
        {!store.scorecard.all.length && !loading && (
          <EmptyError errorMessage="No scorecards found" />
        )}

        {/* Loading */}
        {loading && <LoadingEllipsis />}

        <div className="uk-text-right">
          <button className="btn btn-primary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});

export default ScorecardModal;
